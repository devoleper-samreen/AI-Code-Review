import jwt from "jsonwebtoken";
import prisma from "../prisma/client.js";
import axios from "axios";

export const githubCallbackController = (req, res) => {
  const user = req.user;

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
  });

  res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}/dashboard?token=${token}`);
};

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        avatarUrl: true,
        githubId: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user with all repos
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        repos: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete webhooks from GitHub for all repos
    for (const repo of user.repos) {
      try {
        const [owner, repoName] = repo.repoName.split("/");
        await axios.delete(
          `https://api.github.com/repos/${owner}/${repoName}/hooks/${repo.webhookId}`,
          {
            headers: {
              Authorization: `token ${user.githubToken}`,
            },
          }
        );
      } catch (error) {
        console.warn(
          `Failed to delete webhook for ${repo.repoName}:`,
          error.message
        );
        // Continue deletion even if webhook deletion fails
      }
    }

    // Get all PRs for all repos
    const allPRs = await prisma.pR.findMany({
      where: {
        repo: {
          userId: userId,
        },
      },
      select: { id: true },
    });

    // Delete all feedbacks for these PRs
    if (allPRs.length > 0) {
      const prIds = allPRs.map((pr) => pr.id);
      await prisma.feedback.deleteMany({
        where: { prId: { in: prIds } },
      });

      // Delete all PRs
      await prisma.pR.deleteMany({
        where: { id: { in: prIds } },
      });
    }

    // Delete all repos
    await prisma.repo.deleteMany({
      where: { userId },
    });

    // Finally delete the user
    await prisma.user.delete({
      where: { id: userId },
    });

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Account deletion error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete account",
    });
  }
};
