// import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
// import { z } from "zod";
// import { StructuredOutputParser } from "langchain/output_parsers";
// import { PromptTemplate } from "@langchain/core/prompts";

// export const analyzeDiff = async (diff) => {
//   console.log("I am from analyzeDiff1");

//   try {
//     console.log(process.env.GOOGLE_API_KEY);
//     const model = new ChatGoogleGenerativeAI({
//       modelName: "gemini-1.5-flash",
//       apiKey: process.env.GOOGLE_API_KEY,
//       temperature: 0.2,
//     });
//     console.log("I am from analyzeDiff2");

//     const schema = z.object({
//       bugs: z.array(z.string()).describe("List of bugs found in the PR"),
//       optimizations: z
//         .array(z.string())
//         .describe("Performance or code optimization suggestions"),
//       security_issues: z
//         .array(z.string())
//         .describe("Potential security vulnerabilities"),
//     });
//     console.log("I am from analyzeDiff3");

//     const parser = StructuredOutputParser.fromZodSchema(schema);
//     console.log("I am from analyzeDiff4");

//     const prompt = new PromptTemplate({
//       template: `You are a senior code reviewer AI.
//      Analyze the following PR diff and give feedback.
//      PR Diff:
//      {diff}
//      {format_instructions}`,

//       inputVariables: ["diff"],
//       partialVariables: {
//         format_instructions: parser.getFormatInstructions(),
//       },
//     });
//     console.log("I am from analyzeDiff5");

//     const input = await prompt.format({ diff });
//     console.log("I am from analyzeDiff6");

//     // call Gemini model
//     const result = await model.invoke(input);
//     console.log("I am from analyzeDiff7");

//     const rawText = result.content[0]?.text || "";
//     console.log("I am from analyzeDiff8");
//     console.log("AI Raw Response:", rawText);

//     // parse response
//     const parsed = await parser.parse(rawText);
//     console.log("I am from analyzeDiff9");
//     return parsed;
//   } catch (err) {
//     console.error("❌ Failed to parse AI response:", err, "Raw:", rawText);

//     return {
//       bugs: [],
//       optimizations: [],
//       security_issues: [],
//     };
//   }
// };

import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

export const analyzeDiff = async (diff) => {
  console.log("I am from analyzeDiff1");

  try {
    console.log(process.env.GOOGLE_API_KEY);
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    console.log("I am from analyzeDiff2");

    // define schema with zod
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

    console.log("I am from analyzeDiff3");

    // prompt
    const prompt = `
You are an experienced **senior software engineer and code reviewer AI**.
Your job is to analyze the following GitHub Pull Request diff and return **detailed, actionable feedback** ONLY in valid JSON.

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
    console.log("I am from analyzeDiff4");

    // call Gemini model
    const result = await model.generateContent(prompt);
    console.log("I am from analyzeDiff5");

    let rawText = result.response.text();
    console.log("AI Raw Response:", rawText);

    // remove ```json ... ``` if present
    rawText = rawText.replace(/```json|```/g, "").trim();

    // try parse JSON
    let parsed;
    try {
      parsed = FeedbackSchema.parse(JSON.parse(rawText));
    } catch (err) {
      console.error("❌ Failed to parse AI response:", err);
      parsed = { bugs: [], optimizations: [], security_issues: [] };
    }

    console.log("I am from analyzeDiff6");
    return parsed;
  } catch (err) {
    console.error("❌ analyzeDiff crashed:", err);
    return { bugs: [], optimizations: [], security_issues: [] };
  }
};
