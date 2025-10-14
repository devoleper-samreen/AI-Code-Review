"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Code,
  ArrowLeft,
  Loader2,
  TrendingUp,
  GitPullRequest,
  Shield,
  Bug,
  Lightbulb,
  BarChart3,
  PieChart,
  Activity,
  CheckCircle,
  GitBranch,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { analyticsAPI, authAPI } from "@/services/api";

export default function AnalyticsClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [analyticsRes, userRes] = await Promise.all([
        analyticsAPI.getAnalytics(),
        authAPI.getCurrentUser(),
      ]);

      if (analyticsRes.success) {
        setAnalytics(analyticsRes.analytics);
      }
      if (userRes.success && userRes.user) {
        setUserInfo(userRes.user);
      }
    } catch (error: any) {
      console.error("Failed to fetch analytics:", error);
      if (error.response?.status === 401) {
        router.push("/signup");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Analytics Data</h1>
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const { overview, qualityTrend, issuesByType, weeklyActivity, repoPerformance, recentActivity } = analytics;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl">
              <Code className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">CodeAI Review</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-gray-700 hover:text-gray-900 font-medium transition">
              Dashboard
            </Link>
            <Link href="/dashboard/analytics" className="text-blue-600 font-semibold">
              Analytics
            </Link>
            {userInfo?.avatarUrl && (
              <Link href="/dashboard/settings" title="Settings">
                <img
                  src={userInfo.avatarUrl}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full border-2 border-gray-200 hover:border-blue-500 transition-colors cursor-pointer"
                />
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-blue-100 p-4 rounded-2xl">
              <BarChart3 className="h-10 w-10 text-blue-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Analytics</h1>
              <p className="text-gray-600 mt-1">Track your code quality metrics and trends</p>
            </div>
          </div>
        </header>

        {/* Overview Cards */}
        <div className="grid md:grid-cols-5 gap-6 mb-10">
          <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <GitPullRequest className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{overview.totalPRs}</p>
              <p className="text-sm text-gray-600 mt-1">Total PRs</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-green-100 p-2 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{overview.reviewedPRs}</p>
              <p className="text-sm text-gray-600 mt-1">Reviewed</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{overview.avgScore}%</p>
              <p className="text-sm text-gray-600 mt-1">Avg Score</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Bug className="w-5 h-5 text-orange-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{overview.totalIssues}</p>
              <p className="text-sm text-gray-600 mt-1">Total Issues</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <GitBranch className="w-5 h-5 text-indigo-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{overview.activeRepos}</p>
              <p className="text-sm text-gray-600 mt-1">Active Repos</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {/* Quality Trend */}
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Code Quality Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              {qualityTrend.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No trend data available</p>
              ) : (
                <div className="space-y-3">
                  {qualityTrend.slice(-7).map((item: any, index: number) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="text-xs text-gray-600 w-24 truncate">{item.date}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full flex items-center justify-end pr-2"
                          style={{ width: `${Math.max(item.score, 5)}%` }}
                        >
                          <span className="text-xs font-semibold text-white">{item.score}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Issues by Type */}
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Issues by Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Bug className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-medium text-gray-700">Bugs</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{issuesByType.bugs}</span>
                  </div>
                  <div className="bg-gray-100 rounded-full h-3">
                    <div
                      className="bg-red-500 h-3 rounded-full"
                      style={{
                        width: `${
                          overview.totalIssues > 0
                            ? (issuesByType.bugs / overview.totalIssues) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-orange-600" />
                      <span className="text-sm font-medium text-gray-700">Security Issues</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{issuesByType.security}</span>
                  </div>
                  <div className="bg-gray-100 rounded-full h-3">
                    <div
                      className="bg-orange-500 h-3 rounded-full"
                      style={{
                        width: `${
                          overview.totalIssues > 0
                            ? (issuesByType.security / overview.totalIssues) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-medium text-gray-700">Optimizations</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{issuesByType.optimizations}</span>
                  </div>
                  <div className="bg-gray-100 rounded-full h-3">
                    <div
                      className="bg-yellow-500 h-3 rounded-full"
                      style={{
                        width: `${
                          overview.totalIssues > 0
                            ? (issuesByType.optimizations / overview.totalIssues) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Activity */}
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Weekly Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {weeklyActivity.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No activity data available</p>
              ) : (
                <div className="flex items-end justify-between h-48 gap-2">
                  {weeklyActivity.slice(-8).map((item: any, index: number) => {
                    const maxCount = Math.max(...weeklyActivity.map((w: any) => w.count));
                    const height = (item.count / maxCount) * 100;
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <div className="relative w-full">
                          <div
                            className="bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t-lg mx-auto transition-all hover:from-blue-700 hover:to-indigo-600"
                            style={{ height: `${height * 1.6}px`, width: "100%" }}
                          />
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-bold text-gray-900">{item.count}</p>
                          <p className="text-[10px] text-gray-500">{item.week.split("/")[0]}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Repository Performance */}
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Top Repositories
              </CardTitle>
            </CardHeader>
            <CardContent>
              {repoPerformance.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No repository data available</p>
              ) : (
                <div className="space-y-3">
                  {repoPerformance.map((repo: any, index: number) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-700 flex-1 truncate">
                        {repo.repo.split("/")[1]}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="bg-gray-100 rounded-full h-6 w-20 relative overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-green-500 to-emerald-600 h-full rounded-full"
                            style={{ width: `${repo.avgScore}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-gray-900 w-12">{repo.avgScore}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-0">
              {recentActivity.length === 0 ? (
                <div className="p-12 text-center">
                  <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No recent activity</h3>
                  <p className="text-gray-600">Start reviewing PRs to see activity here</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {recentActivity.map((pr: any) => (
                    <div
                      key={pr.id}
                      className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <GitPullRequest className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {pr.repoName} #{pr.prNumber}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(pr.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                            pr.status === "reviewed"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {pr.status === "reviewed" ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <Activity className="h-4 w-4" />
                          )}
                          {pr.status}
                        </span>
                        <Button variant="ghost" asChild className="text-blue-600 hover:text-blue-700">
                          <Link href={`/dashboard/PR-review/${pr.id}`}>View →</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
