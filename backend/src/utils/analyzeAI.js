import { z } from "zod";
import { qdrant } from "../config/vectorDB.js";
import { geminiModel } from "../config/gemini.js";
import { getEmbedding } from "../utils/embeddingWorkerHelper.js";

const prReviewChain = {
  call: async ({ input, diff }) => {
    // 1. Diff ka embedding banao
    const diffEmbedding = await getEmbedding(diff);

    // 2. Qdrant se top-k related context fetch karo
    const searchResult = await qdrant.search("repo_embeddings", {
      vector: diffEmbedding,
      limit: 5,
    });

    const contextChunks = searchResult.map(
      (d) => d.payload.text || d.payload.content || ""
    );

    // 3. Prompt + context Gemini ko bhejo
    const result = await geminiModel.generateContent(
      `
      ${input}\n\n
      I am providing you repo contex used to analyze this PR.
      you have to review only diff and not the context be careful.
      you can use contex as a reference if needed.
      Repo Context:\n
      ${contextChunks.join("\n\n")}
      `
    );

    return { AIFeedback: result.response.text() };
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

// 🔹 Main function
export const analyzeDiffWithContext = async (diff) => {
  const prompt = `
You are an experienced **senior software engineer and code reviewer AI**.
Your job is to analyze the following GitHub Pull Request diff and return **actionable feedback** ONLY in valid JSON.

Guidelines for feedback:
- Be **specific**: mention exact files, functions, or lines if possible.
- Be **actionable**: explain WHAT should be fixed/optimized and WHY.
- Be **professional**: keep tone constructive and helpful (like a senior mentor).
- Be **prioritized**: critical bugs first, then optimizations, then minor improvements.
- Keep responses **concise but insightful** (no filler).

PR Diff:
${diff}

Return JSON in this format:
{
  "bugs": [
    {
      "title": "Bug summary in one line",
      "details": "Clear explanation of the bug, why it's an issue, and suggested fix",
      "severity": "critical | high | medium | low"
    }
  ],
  "optimizations": [
    {
      "title": "Optimization summary",
      "details": "What can be optimized and why it matters (performance, readability, maintainability)"
    }
  ],
  "security_issues": [
    {
      "title": "Security issue summary",
      "details": "What the vulnerability is, how it could be exploited, and how to fix it",
      "severity": "high | medium | low"
    }
  ],
  "general_feedback": [
    "High-level suggestions about code style, documentation, or best practices"
  ]
}
`;

  try {
    const result = await prReviewChain.call({ input: prompt, diff });
    const rawText = result.AIFeedback.replace(/```json|```/g, "").trim();

    console.log("Raw AI Response:", rawText);

    let parsed;
    try {
      const jsonResponse = JSON.parse(rawText);
      console.log("Parsed JSON:", JSON.stringify(jsonResponse, null, 2));

      // Normalize general_feedback if it's objects instead of strings
      if (jsonResponse.general_feedback && Array.isArray(jsonResponse.general_feedback)) {
        jsonResponse.general_feedback = jsonResponse.general_feedback.map(item =>
          typeof item === 'string' ? item : (item.text || item.title || item.details || JSON.stringify(item))
        );
      }

      parsed = FeedbackSchema.parse(jsonResponse);
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
    console.error("analyzeDiffWithContext crashed:", err);
    return {
      bugs: [],
      optimizations: [],
      security_issues: [],
      general_feedback: [],
    };
  }
};
