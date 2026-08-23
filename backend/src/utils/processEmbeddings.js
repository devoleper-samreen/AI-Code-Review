import prisma from "../prisma/client.js";
import { fetchRepoFiles, splitText, getEmbedding } from "./embeddingWorkerHelper.js";
import { qdrant } from "../config/vectorDB.js";
import { randomUUID } from "crypto";
import pLimit from "p-limit";

export const processEmbeddings = async ({ repoId, repoName, userId }) => {
  const [owner, repoShortName] = repoName.split("/");
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user?.githubToken) throw new Error("GitHub token not found");

  const files = await fetchRepoFiles(owner, repoShortName, user.githubToken);
  if (files.length === 0) return;

  // Try to recreate collection if dimensions changed (3072 for gemini-embedding-001)
  try {
    const existing = await qdrant.getCollection("repo_embeddings");
    if (existing.config?.params?.vectors?.size !== 3072) {
      await qdrant.deleteCollection("repo_embeddings");
      throw new Error("recreate");
    }
  } catch (e) {
    if (e.message === "recreate" || e.status === 404) {
      await qdrant.createCollection("repo_embeddings", {
        vectors: { size: 3072, distance: "Cosine" },
      });
    }
  }

  const limit = pLimit(1);

  const getEmbeddingWithRetry = async (text, retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        return await getEmbedding(text);
      } catch (e) {
        if (e.message?.includes("429") && i < retries - 1) {
          await new Promise((r) => setTimeout(r, 2000 * (i + 1)));
        } else throw e;
      }
    }
  };

  for (const f of files) {
    const chunks = splitText(f.content);
    const vectorsBatch = await Promise.all(
      chunks.map((chunk) =>
        limit(async () => {
          const vector = await getEmbeddingWithRetry(chunk);
          await new Promise((r) => setTimeout(r, 200)); // 200ms gap between requests
          return {
            id: randomUUID(),
            vector,
            payload: { text: chunk, path: f.path, repoId },
          };
        })
      )
    );

    if (vectorsBatch.length > 0) {
      await qdrant.upsert("repo_embeddings", { points: vectorsBatch });
      console.log(`Embeddings stored for file: ${f.path}`);
    }
  }
};
