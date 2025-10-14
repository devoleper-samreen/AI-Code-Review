import prisma from "../prisma/client.js";
import axios from "axios";
import { embeddingQueue } from "../config/queues.js";
export const getRepos = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || !user.githubToken) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const response = await axios.get("https://api.github.com/user/repos", {
      headers: {
        Authorization: `token ${user.githubToken}`,
      },
    });

    res.status(200).json({
      message: "Successfully fetched repos",
      repos: response.data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch repos" });
  }
};

export const connectRepo = async (req, res) => {
  try {
    const userId = req.user.id;
    const { full_name } = req.body;

    const repo = full_name;

    //Get user from DB for github token
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || !user.githubToken) {
      return res.status(401).json({
        success: false,
        message: "GitHub token not found",
      });
    }

    const [owner, repoName] = repo.split("/");

    //create webhook on github on this repo
    const response = await axios.post(
      `https://api.github.com/repos/${owner}/${repoName}/hooks`,
      {
        name: "web",
        active: true,
        events: ["pull_request", "push"],
        config: {
          url: `${process.env.WEBHOOK_URL}/github/webhook`,
          content_type: "json",
          secret: process.env.GITHUB_WEBHOOK_SECRET,
        },
      },
      {
        headers: {
          Authorization: `token ${user.githubToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    //save repo in DB
    const savedRepo = await prisma.repo.create({
      data: {
        userId: userId,
        repoName: repo,
        webhookId: response.data.id,
      },
    });

    // Enqueue background job for embeddings
    embeddingQueue.add("generate-embeddings", {
      repoId: savedRepo.id,
      repoName: full_name,
      userId,
    });

    console.log("saved repo and enqueued processing...: ", savedRepo);

    return res.status(200).json({
      success: true,
      message: "Repo connnected successfully",
      data: savedRepo,
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: "Failed to connect repo",
    });
  }
};

export const getConnectedRepos = async (req, res) => {
  try {
    const userId = req.user.id;

    const repos = await prisma.repo.findMany({
      where: { userId },
      include: {
        _count: {
          select: { prs: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      success: true,
      repos: repos.map((repo) => ({
        ...repo,
        prCount: repo._count.prs,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch connected repos" });
  }
};

export const getRepoById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const repo = await prisma.repo.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        _count: {
          select: { prs: true },
        },
      },
    });

    if (!repo) {
      return res.status(404).json({
        success: false,
        error: "Repository not found",
      });
    }

    res.status(200).json({
      success: true,
      repo: {
        ...repo,
        prCount: repo._count.prs,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch repository" });
  }
};

export const disconnectRepo = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Get repo from DB
    const repo = await prisma.repo.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!repo) {
      return res.status(404).json({
        success: false,
        message: "Repository not found",
      });
    }

    // Get user for GitHub token
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || !user.githubToken) {
      return res.status(401).json({
        success: false,
        message: "GitHub token not found",
      });
    }

    const [owner, repoName] = repo.repoName.split("/");

    // Delete webhook from GitHub
    try {
      await axios.delete(
        `https://api.github.com/repos/${owner}/${repoName}/hooks/${repo.webhookId}`,
        {
          headers: {
            Authorization: `token ${user.githubToken}`,
          },
        }
      );
    } catch (error) {
      console.warn("Failed to delete webhook from GitHub:", error.message);
      // Continue anyway to delete from DB
    }

    // Get all PRs for this repo to delete their feedbacks first
    const prs = await prisma.pR.findMany({
      where: { repoId: id },
      select: { id: true },
    });

    // Delete all feedbacks for these PRs
    if (prs.length > 0) {
      const prIds = prs.map((pr) => pr.id);
      await prisma.feedback.deleteMany({
        where: { prId: { in: prIds } },
      });

      // Delete all PRs for this repo
      await prisma.pR.deleteMany({
        where: { repoId: id },
      });
    }

    // Finally delete the repo
    await prisma.repo.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "Repository disconnected successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to disconnect repository",
    });
  }
};
