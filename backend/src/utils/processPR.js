import axios from "axios";
import { analyzeDiffWithContext } from "./analyzeAI.js";
import prisma from "../prisma/client.js";
import { formatFeedbackForComment } from "./comment.js";

export const processPR = async ({ repoFullName, prNumber, diffUrl }) => {
  const repo = await prisma.repo.findFirst({
    where: { repoName: repoFullName },
  });

  if (!repo) throw new Error("Repo not found");

  // Dedup guard: if already processing or reviewed, skip
  const existingPR = await prisma.pR.findFirst({
    where: { repoId: repo.id, prNumber },
  });

  if (existingPR?.status === "processing" || existingPR?.status === "reviewed") {
    console.log(`⏭️ PR #${prNumber} is already ${existingPR.status}, skipping.`);
    return;
  }

  let pr = existingPR;

  if (!pr) {
    pr = await prisma.pR.create({
      data: { repoId: repo.id, prNumber, status: "processing" },
    });
  } else {
    await prisma.pR.update({
      where: { id: pr.id },
      data: { status: "processing" },
    });
    pr = { ...pr, status: "processing" };
  }

  console.log(`🔍 Processing PR #${prNumber} from ${repoFullName}`);

  try {
    // Fetch diff and PR metadata in parallel
    const [owner, repoShortName] = repoFullName.split("/");
    const user = await prisma.user.findFirst({ where: { username: owner } });
    if (!user) throw new Error("User not found");

    const [diffResponse, prMetaResponse] = await Promise.allSettled([
      axios.get(diffUrl, { headers: { Accept: "application/vnd.github.v3.diff" } }),
      axios.get(`https://api.github.com/repos/${repoFullName}/pulls/${prNumber}`, {
        headers: { Authorization: `token ${user.githubToken}` },
      }),
    ]);

    if (diffResponse.status === "rejected") throw new Error("Failed to fetch PR diff");
    const diff = diffResponse.value.data;

    // Save PR title if fetched successfully
    if (prMetaResponse.status === "fulfilled") {
      const meta = prMetaResponse.value.data;
      await prisma.pR.update({
        where: { id: pr.id },
        data: {
          prTitle: meta.title,
          author: meta.user?.login,
          prUrl: meta.html_url,
        },
      }).catch(() => {}); // non-fatal if schema doesn't have these fields yet
    }

    const feedback = await analyzeDiffWithContext(diff);

    const isFeedbackEmpty =
      !feedback ||
      (feedback.bugs.length === 0 &&
        feedback.optimizations.length === 0 &&
        feedback.security_issues.length === 0 &&
        (!feedback.general_feedback || feedback.general_feedback.length === 0));

    if (isFeedbackEmpty) {
      await prisma.pR.update({
        where: { id: pr.id },
        data: { status: "failed" },
      });
      throw new Error("AI review failed - feedback is empty.");
    }

    await prisma.feedback.create({
      data: { prId: pr.id, aiSuggestions: feedback },
    });

    await prisma.pR.update({
      where: { id: pr.id },
      data: { status: "reviewed" },
    });

    const commentBody = formatFeedbackForComment(feedback);

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
    // Mark as failed if not already reviewed
    const current = await prisma.pR.findUnique({ where: { id: pr.id } });
    if (current?.status !== "reviewed") {
      await prisma.pR.update({
        where: { id: pr.id },
        data: { status: "failed" },
      }).catch(() => {});
    }
    throw error;
  }
};
