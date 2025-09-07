import { verifySignature } from "../utils/verifySignature.js";
import { prQueue } from "../config/queues.js";

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

    const payload = JSON.parse(req.body.toString());
    const action = payload.action;
    const pr = payload.pull_request;
    const repo = payload.repository;

    console.log("👉 Received PR event:", action);

    if (
      action === "opened" ||
      action === "reopened" ||
      action === "synchronize"
    ) {
      await prQueue.add("review-pr", {
        repoFullName: repo.full_name, // "owner/repo"
        prNumber: pr.number,
        prUrl: pr.url,
        diffUrl: pr.diff_url,
        installationId: payload.installation?.id,
      });

      console.log("Event received and queued for processing");
    }

    res.status(200).send("Event received");
  } catch (error) {
    console.error(error);
    res.status(500).send("Webhook handling failed");
  }
};
