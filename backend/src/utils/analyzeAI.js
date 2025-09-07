import { z } from "zod";
import { qdrant } from "../config/vectorDB.js";
import { geminiModel } from "../config/gemini.js";

// 🔹 Custom chain
const prReviewChain = {
  call: async ({ input }) => {
    // fetch top-k docs from Qdrant
    const searchResult = await qdrant.search({
      collection_name: "repo_embeddings",
      vector: [], // placeholder if you don't have an embedding yet
      limit: 5,
    });

    const contextChunks = searchResult.map(
      (d) => d.payload.pageContent || d.payload.content || ""
    );

    // send prompt + context to Gemini
    const result = await geminiModel.generateContent(
      `${input}\n\nRepo Context:\n${contextChunks.join("\n\n")}`
    );

    return { output_text: result.response.text() };
  },
};

// 🔹 Zod schema
const FeedbackSchema = z.object({
  bugs: z.array(
    z.object({
      title: z.string(),
      details: z.string(),
      severity: z.enum(["low", "medium", "high", "critical"]),
    })
  ),
  optimizations: z.array(
    z.object({
      title: z.string(),
      details: z.string(),
    })
  ),
  security_issues: z.array(
    z.object({
      title: z.string(),
      details: z.string(),
      severity: z.enum(["low", "medium", "high", "critical"]),
    })
  ),
  general_feedback: z.array(z.string()).optional(),
});

const prompt = `You are an experienced senior software engineer and code reviewer AI. Analyze this GitHub Pull Request diff and return detailed, actionable feedback in valid JSON only. PR Diff: ${diff}`;

// 🔹 Main function
export const analyzeDiffWithContext = async (diff) => {
  try {
    const result = await prReviewChain.call({ input: prompt });
    const rawText = result.output_text.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = FeedbackSchema.parse(JSON.parse(rawText));
    } catch (err) {
      console.error("Failed to parse AI response:", err);
      parsed = {
        bugs: [],
        optimizations: [],
        security_issues: [],
        general_feedback: [],
      };
    }

    return parsed;
  } catch (err) {
    console.error("analyzeDiff crashed:", err);
    return {
      bugs: [],
      optimizations: [],
      security_issues: [],
      general_feedback: [],
    };
  }
};
