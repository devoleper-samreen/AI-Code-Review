import { Worker } from "bullmq";
import axios from "axios";
import { analyzeDiff } from "../utils/ai.js";
import { prisma } from "../prisma/client.js";

const worker = new Worker(
  "pr-review",
  async (job) => {
    const { repoFullName, prNumber, diffUrl } = job.data;

    //fetch PR diff from github
    const diffResponse = await axios.get(diffUrl, {
      headers: { Accept: "application/vnd.github.v3.diff" },
    });

    const diff = diffResponse.data;

    console.log(`🔍 Processing PR #${prNumber} from ${repoFullName}`);

    const feedback = await analyzeDiff(diff);

    const repo = await prisma.Repo.findFirst({
      where: { repoName: repoFullName },
    });

    if (!repo) {
      throw new Error("Repo not found");
    }

    const pr = await prisma.PR.findFirst({
      where: {
        repoId: repo.id,
        prNumber,
      },
    });

    if (!pr) {
      pr = await prisma.PR.create({
        data: {
          repoId: repo.id,
          prNumber,
          status: "pending",
        },
      });
    }

    await prisma.Feedback.create({
      data: {
        prId: pr.id,
        aiSuggestions: feedback,
      },
    });

    console.log(`✅ Feedback saved for PR #${prNumber}`);
  },
  {
    connection: { host: "127.0.0.1", port: 6379 },
  }
);
