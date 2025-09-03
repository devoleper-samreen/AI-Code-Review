import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";
import { StructuredOutputParser } from "langchain/output_parsers";
import { PromptTemplate } from "langchain/prompts";

export const analyzeDiff = async (diff) => {
  const model = new ChatGoogleGenerativeAI({
    modelName: "gemini-1.5-flash",
    apiKey: process.env.GOOGLE_API_KEY,
    temperature: 0.2,
  });

  const schema = z.object({
    bugs: z.array(z.string()).describe("List of bugs found in the PR"),
    optimizations: z
      .array(z.string())
      .describe("Performance or code optimization suggestions"),
    security_issues: z
      .array(z.string())
      .describe("Potential security vulnerabilities"),
  });

  const parser = StructuredOutputParser.fromZodSchema(schema);

  const prompt = new PromptTemplate({
    template: `You are a senior code reviewer AI.
     Analyze the following PR diff and give feedback.
     PR Diff:
     {diff}
     {format_instructions}`,

    inputVariables: ["diff"],
    partialVariables: {
      format_instructions: parser.getFormatInstructions(),
    },
  });

  const input = await prompt.format({ diff });

  // call Gemini model
  const result = await model.invoke(input);

  // parse response
  try {
    return await parser.parse(result.content[0].text);
  } catch (err) {
    console.error("Failed to parse AI response:", err);
    return {
      bugs: [],
      optimizations: [],
      security_issues: [],
    };
  }
};
