import { verifySignature } from "../utils/verifySignature.js";
import { Queue } from "bullmq";

// BullMQ queue banayi
const prQueue = new Queue("pr-review", {
  connection: { host: "127.0.0.1", port: 6379 },
});

export const webhookPR = async (req, res) => {
  try {
    const isValid = verifySignature(req, process.env.GITHUB_WEBHOOK_SECRET);

    if (!isValid) {
      return res.status(401).send("Invalid signature");
    }

    const event = req.headers["x-github-event"];

    if (event !== "pull_request") {
      return res.status(200).send("Not a PR event");
    }

    const payload = req.body;
    const action = payload.action;
    const pr = payload.pull_request;
    const repo = payload.repository;

    if (action === "opened" || action === "synchronize") {
      await prQueue.add("review-pr", {
        repoFullName: repo.full_name, // "owner/repo"
        prNumber: pr.number,
        prUrl: pr.url,
        diffUrl: pr.diff_url,
        installationId: payload.installation?.id,
      });

      res.status(200).send("Event received");
    }
  } catch (error) {
    console.error(err);
    res.status(500).send("Webhook handling failed");
  }
};
