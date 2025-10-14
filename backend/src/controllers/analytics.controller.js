import prisma from "../prisma/client.js";

export const getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all PRs for user's repos
    const allPRs = await prisma.pR.findMany({
      where: {
        repo: {
          userId: userId,
        },
      },
      include: {
        feedbacks: true,
        repo: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate overview metrics
    const totalPRs = allPRs.length;
    const reviewedPRs = allPRs.filter((pr) => pr.status === "reviewed").length;

    // Calculate average quality score
    let totalScore = 0;
    let scoredPRs = 0;
    let totalBugs = 0;
    let totalSecurity = 0;
    let totalOptimizations = 0;

    allPRs.forEach((pr) => {
      if (pr.feedbacks?.[0]?.aiSuggestions) {
        const feedback = pr.feedbacks[0].aiSuggestions;
        const bugs = feedback.bugs || [];
        const security = feedback.security_issues || [];
        const optimizations = feedback.optimizations || [];

        totalBugs += bugs.length;
        totalSecurity += security.length;
        totalOptimizations += optimizations.length;

        // Calculate score
        let score = 100;
        bugs.forEach((bug) => {
          if (bug.severity === "critical") score -= 20;
          else if (bug.severity === "high") score -= 10;
          else if (bug.severity === "medium") score -= 5;
          else score -= 2;
        });

        security.forEach((issue) => {
          if (issue.severity === "high") score -= 15;
          else if (issue.severity === "medium") score -= 8;
          else score -= 3;
        });

        totalScore += Math.max(score, 0);
        scoredPRs++;
      }
    });

    const avgScore = scoredPRs > 0 ? Math.round(totalScore / scoredPRs) : 0;
    const totalIssues = totalBugs + totalSecurity + totalOptimizations;

    // Get active repos count
    const activeRepos = await prisma.repo.count({
      where: { userId },
    });

    // Quality trend (all PRs with feedback)
    const qualityTrend = {};
    allPRs.forEach((pr) => {
      if (pr.feedbacks?.[0]?.aiSuggestions) {
        const date = new Date(pr.createdAt).toLocaleDateString();
        if (!qualityTrend[date]) {
          qualityTrend[date] = { total: 0, count: 0 };
        }

        const feedback = pr.feedbacks[0].aiSuggestions;
        const bugs = feedback.bugs || [];
        const security = feedback.security_issues || [];

        let score = 100;
        bugs.forEach((bug) => {
          if (bug.severity === "critical") score -= 20;
          else if (bug.severity === "high") score -= 10;
          else if (bug.severity === "medium") score -= 5;
          else score -= 2;
        });

        security.forEach((issue) => {
          if (issue.severity === "high") score -= 15;
          else if (issue.severity === "medium") score -= 8;
          else score -= 3;
        });

        qualityTrend[date].total += Math.max(score, 0);
        qualityTrend[date].count += 1;
      }
    });

    // Convert to array with average scores
    const trendData = Object.entries(qualityTrend)
      .map(([date, data]) => ({
        date,
        score: data.count > 0 ? Math.round(data.total / data.count) : 0,
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    // Issues by type
    const issuesByType = {
      bugs: totalBugs,
      security: totalSecurity,
      optimizations: totalOptimizations,
    };

    // PRs per week (last 8 weeks)
    const eightWeeksAgo = new Date();
    eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 56);

    const weeklyActivity = {};
    const weekPRs = allPRs.filter(
      (pr) => new Date(pr.createdAt) >= eightWeeksAgo
    );

    weekPRs.forEach((pr) => {
      const weekStart = getWeekStart(new Date(pr.createdAt));
      const weekLabel = weekStart.toLocaleDateString();

      if (!weeklyActivity[weekLabel]) {
        weeklyActivity[weekLabel] = 0;
      }
      weeklyActivity[weekLabel]++;
    });

    const activityData = Object.entries(weeklyActivity)
      .map(([week, count]) => ({ week, count }))
      .sort((a, b) => new Date(a.week) - new Date(b.week));

    // Repository performance
    const repoPerformance = {};
    allPRs.forEach((pr) => {
      const repoName = pr.repo.repoName;
      if (!repoPerformance[repoName]) {
        repoPerformance[repoName] = { total: 0, count: 0 };
      }

      if (pr.feedbacks?.[0]?.aiSuggestions) {
        const feedback = pr.feedbacks[0].aiSuggestions;
        const bugs = feedback.bugs || [];
        const security = feedback.security_issues || [];

        let score = 100;
        bugs.forEach((bug) => {
          if (bug.severity === "critical") score -= 20;
          else if (bug.severity === "high") score -= 10;
          else if (bug.severity === "medium") score -= 5;
          else score -= 2;
        });

        security.forEach((issue) => {
          if (issue.severity === "high") score -= 15;
          else if (issue.severity === "medium") score -= 8;
          else score -= 3;
        });

        repoPerformance[repoName].total += Math.max(score, 0);
        repoPerformance[repoName].count += 1;
      }
    });

    const repoData = Object.entries(repoPerformance)
      .map(([repo, data]) => ({
        repo,
        avgScore: data.count > 0 ? Math.round(data.total / data.count) : 0,
        prCount: data.count,
      }))
      .sort((a, b) => b.avgScore - a.avgScore)
      .slice(0, 5); // Top 5 repos

    // Recent activity
    const recentActivity = allPRs
      .slice(0, 10)
      .map((pr) => ({
        id: pr.id,
        prNumber: pr.prNumber,
        repoName: pr.repo.repoName,
        status: pr.status,
        createdAt: pr.createdAt,
      }));

    res.status(200).json({
      success: true,
      analytics: {
        overview: {
          totalPRs,
          reviewedPRs,
          avgScore,
          totalIssues,
          activeRepos,
        },
        qualityTrend: trendData,
        issuesByType,
        weeklyActivity: activityData,
        repoPerformance: repoData,
        recentActivity,
      },
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
    });
  }
};

// Helper function to get week start date
function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
}
