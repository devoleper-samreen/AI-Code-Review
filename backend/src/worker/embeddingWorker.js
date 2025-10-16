import { Worker } from "bullmq";
import prisma from "../prisma/client.js";
import {
  fetchRepoFiles,
  splitText,
  getEmbedding,
} from "../utils/embeddingWorkerHelper.js";
import { qdrant } from "../config/vectorDB.js";
import { randomUUID } from "crypto";
import pLimit from "p-limit";
console.log("redis url: ", process.env.REDIS_URL);


const embeddingWorker = new Worker(
  "embedding-queue",
  async (job) => {
    console.log("queue job id", job.id);

    console.log("job data", job.data);

    const { repoId, repoName, userId } = job.data;
    const [owner, repoShortName] = repoName.split("/");

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user?.githubToken) throw new Error("GitHub token not found");

    const files = await fetchRepoFiles(owner, repoShortName, user.githubToken);

    if (files.length === 0) return;

    try {
      await qdrant
        .createCollection("repo_embeddings", {
          vectors: { size: 768, distance: "Cosine" },
        })
        .catch(() => {});

      const vectors = [];

      // concurrency limiter (ek time pe max 5 requests)
      const limit = pLimit(5);

      console.log("files", files);
      console.log("generating embeddings for files");

      for (const f of files) {
        const chunks = splitText(f.content);

        // ek file ke saare embeddings parallel with concurrency control
        const vectorsBatch = await Promise.all(
          chunks.map((chunk) =>
            limit(async () => {
              const vector = await getEmbedding(chunk);
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
    } catch (error) {
      console.error("Error storing embeddings:", error);
    }
  },
  {
    connection: {
      url: process.env.REDIS_URL, // single Upstash URL
      tls: {}, // required for rediss://
    },
  }
);
