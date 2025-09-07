import { Worker } from "bullmq";
import axios from "axios";
import { analyzeDiffWithContext } from "../utils/analyzeAI.js";
import prisma from "../prisma/client.js";
import { formatFeedbackForComment } from "../utils/comment.js";

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

    const feedback = await analyzeDiffWithContext(diff);

    console.log("feedback: ", feedback);

    const repo = await prisma.repo.findFirst({
      where: { repoName: repoFullName },
    });

    if (!repo) {
      throw new Error("Repo not found");
    }

    const pr = await prisma.pR.findFirst({
      where: {
        repoId: repo.id,
        prNumber,
      },
    });

    if (!pr) {
      pr = await prisma.pR.create({
        data: {
          repoId: repo.id,
          prNumber,
          status: "pending",
        },
      });
    }

    await prisma.feedback.create({
      data: {
        prId: pr.id,
        aiSuggestions: feedback,
      },
    });

    console.log(`✅ Feedback saved for PR #${prNumber}`);

    //AUTO Comment on PR on Github
    const commentBody = formatFeedbackForComment(feedback);

    const { repoName } = repo;

    const [owner, repoShortName] = repoName.split("/");

    const user = await prisma.user.findFirst({ where: { username: owner } });

    if (!user) {
      throw new Error("User not found");
    }

    try {
      await axios.post(
        `https://api.github.com/repos/${owner}/${repoShortName}/issues/${prNumber}/comments`,
        { body: commentBody },
        {
          headers: {
            Authorization: `token ${user.githubToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(`✅ AI review comment posted to PR #${prNumber}`);
    } catch (error) {
      console.error(
        `Error posting AI review comment to PR #${prNumber}: ${error.message}`
      );
    }
  },
  {
    connection: { host: "127.0.0.1", port: 6379 },
  }
);
