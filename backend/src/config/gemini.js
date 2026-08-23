import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export const embeddingModel = genAI.getGenerativeModel({
  model: "gemini-embedding-001",
});

export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});
