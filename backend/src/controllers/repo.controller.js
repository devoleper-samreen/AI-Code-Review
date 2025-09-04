import prisma from "../prisma/client.js";
import axios from "axios";
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
    console.log("repo log", full_name);

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

    //create webhook on github
    const response = await axios.post(
      `https://api.github.com/repos/${owner}/${repoName}/hooks`,
      {
        name: "web",
        active: true,
        events: ["pull_request"],
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
