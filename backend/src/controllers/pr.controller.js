import prisma from "../prisma/client.js";

export const getPRReviews = async (req, res) => {
  try {
    const userId = req.user.id;
    const { repoId } = req.query;

    // Build query filter
    const whereClause = {
      repo: {
        userId: userId,
      },
    };

    if (repoId) {
      whereClause.repoId = repoId;
    }

    const prs = await prisma.pR.findMany({
      where: whereClause,
      include: {
        repo: true,
        feedbacks: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      success: true,
      reviews: prs.map((pr) => ({
        id: pr.id,
        prNumber: pr.prNumber,
        repoName: pr.repo.repoName,
        status: pr.status,
        createdAt: pr.createdAt,
        feedback: pr.feedbacks[0] || null,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch PR reviews" });
  }
};

export const getPRReviewById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const pr = await prisma.pR.findFirst({
      where: {
        id,
        repo: {
          userId,
        },
      },
      include: {
        repo: true,
        feedbacks: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!pr) {
      return res.status(404).json({ error: "PR review not found" });
    }

    res.status(200).json({
      success: true,
      review: {
        id: pr.id,
        prNumber: pr.prNumber,
        repoName: pr.repo.repoName,
        status: pr.status,
        createdAt: pr.createdAt,
        feedbacks: pr.feedbacks,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch PR review" });
  }
};
