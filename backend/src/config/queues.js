import { Queue } from "bullmq";
import dotenv from "dotenv";

dotenv.config();

const redisConnection = {
    url: process.env.REDIS_URL, // single line from Upstash
    tls: {}, // required for rediss://
    maxRetriesPerRequest: 1, // prevent endless retry inside requests
    retryStrategy: (times) => {
      if (times > 1) return null; // stop after 2 total tries (first + one retry)
      console.warn("🔁 Retrying Redis connection...");
      return 2000; // wait 2s before retrying
    },
  }

console.log(redisConnection);


export const embeddingQueue = new Queue("embedding-queue", {
  connection: redisConnection,
});

export const prQueue = new Queue("pr-review", {
  connection: redisConnection,
});
