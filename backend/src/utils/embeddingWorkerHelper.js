import { embeddingModel } from "../config/gemini.js";
import axios from "axios";
export const fetchRepoFiles = async (owner, repo, token, path = "") => {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  const res = await axios.get(url, {
    headers: { Authorization: `token ${token}` },
  });

  let files = [];
  for (let item of res.data) {
    if (
      item.type === "file" &&
      !item.name.match(/\.(png|jpg|jpeg|gif|svg|exe|zip|pdf)$/i)
    ) {
      try {
        const fileRes = await axios.get(item.download_url);
        files.push({ path: item.path, content: fileRes.data });
      } catch (error) {
        console.error(`Error fetching file ${item.path}:`, error.message);
      }
    } else if (item.type === "dir") {
      const subFiles = await fetchRepoFiles(owner, repo, token, item.path);
      files = files.concat(subFiles);
    }
  }
  return files;
};

export const splitText = (text, chunkSize = 1000, chunkOverlap = 100) => {
  const chunks = [];
  let start = 0;
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end));
    start += chunkSize - chunkOverlap;
  }
  return chunks;
};

export const getEmbedding = async (text) => {
  if (!text || text.trim().length === 0) {
    return []; // fallback empty vector
  }
  const result = await embeddingModel.embedContent({
    content: { parts: [{ text }] },
  });

  console.log("embeddings result", result);

  return result.embedding.values || [];
};
