import { Queue } from "bullmq";

export const embeddingQueue = new Queue("embedding-queue", {
  connection: { host: "127.0.0.1", port: 6379 },
});

export const prQueue = new Queue("pr-review", {
  connection: { host: "127.0.0.1", port: 6379 },
});
