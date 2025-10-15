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
    console.log("diff: ", diff);

    // Find repo and PR first, update status to "processing"
    const repo = await prisma.repo.findFirst({
      where: { repoName: repoFullName },
    });

    if (!repo) {
      throw new Error("Repo not found");
    }

    let pr = await prisma.pR.findFirst({
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
          status: "processing",
        },
      });
      console.log("✅ PR created with status: processing");
    } else {
      await prisma.pR.update({
        where: { id: pr.id },
        data: { status: "processing" },
      });
      console.log("✅ PR status updated to: processing");
    }

    const feedback = await analyzeDiffWithContext(diff);

    console.log("feedback: ", feedback);

    // Check if feedback is empty or failed
    const isFeedbackEmpty =
      !feedback ||
      (feedback.bugs.length === 0 &&
        feedback.optimizations.length === 0 &&
        feedback.security_issues.length === 0 &&
        (!feedback.general_feedback || feedback.general_feedback.length === 0));

    if (isFeedbackEmpty) {
      console.error(
        `❌ AI review failed or returned empty feedback for PR #${prNumber}. Skipping database save and comment.`
      );
      // Update PR status back to "pending" if feedback fails
      await prisma.pR.update({
        where: { id: pr.id },
        data: { status: "pending" },
      });
      throw new Error(
        "AI review failed - feedback is empty. This might be due to Qdrant connection issues or AI model errors."
      );
    }

    try {
      await prisma.feedback.create({
        data: {
          prId: pr.id,
          aiSuggestions: feedback,
        },
      });
    } catch (error) {
      console.error(
        `Error saving feedback for PR #${prNumber}: ${error.message}`
      );
      throw error;
    }

    console.log(`✅ Feedback saved for PR #${prNumber}`);

    await prisma.pR.update({
      where: { id: pr.id },
      data: { status: "reviewed" },
    });

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
      throw error;
    }
  },
  {
    connection: { host: "127.0.0.1", port: 6379 },
  }
);
