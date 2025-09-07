import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export const embeddingModel = genAI.getGenerativeModel({
  model: "text-embedding-004",
});

export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});
