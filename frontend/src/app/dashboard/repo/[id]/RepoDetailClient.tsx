"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Github,
  GitPullRequest,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Code,
  ArrowLeft,
  Calendar,
  Activity,
  TrendingUp,
  GitBranch,
  Clock,
  ExternalLink,
  Trash2,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { repoAPI, prAPI, authAPI } from "@/services/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Props {
  id: string;
}

interface RepoData {
  id: string;
  repoName: string;
  webhookId: number;
  createdAt: string;
  prCount: number;
}

interface PRReview {
  id: string;
  prNumber: number;
  repoName: string;
  status: string;
  createdAt: string;
  feedback: any;
}

export default function RepoDetailClient({ id }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [repoData, setRepoData] = useState<RepoData | null>(null);
  const [prReviews, setPRReviews] = useState<PRReview[]>([]);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [stats, setStats] = useState({
    total: 0,
    reviewed: 0,
    pending: 0,
    avgScore: 0,
  });

  useEffect(() => {
    fetchRepoData();
  }, [id]);

  const fetchRepoData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      // Use the new getRepoById API
      const [repoRes, prReviewsRes, userRes] = await Promise.all([
        repoAPI.getRepoById(id),
        prAPI.getPRReviews(),
        authAPI.getCurrentUser(),
      ]);

      if (!repoRes.success || !repoRes.repo) {
        router.push("/dashboard");
        return;
      }

      setRepoData(repoRes.repo);
      if (userRes.success && userRes.user) {
        setUserInfo(userRes.user);
      }

      // Get PR reviews for this repo
      const repoReviews = prReviewsRes.reviews.filter(
        (pr: any) => pr.repoName === repoRes.repo.repoName
      );

      setPRReviews(repoReviews);

      // Calculate stats
      const total = repoReviews.length;
      const reviewed = repoReviews.filter((pr: any) => pr.status === "reviewed").length;
      const pending = total - reviewed;

      // Calculate average score from feedbacks
      let totalScore = 0;
      let scoredReviews = 0;
      repoReviews.forEach((pr: any) => {
        if (pr.feedback?.aiSuggestions) {
          const feedback = pr.feedback.aiSuggestions;
          const bugs = feedback.bugs?.length || 0;
          const security = feedback.security_issues?.length || 0;
          let score = 100;

          feedback.bugs?.forEach((bug: any) => {
            if (bug.severity === 'critical') score -= 20;
            else if (bug.severity === 'high') score -= 10;
            else if (bug.severity === 'medium') score -= 5;
            else score -= 2;
          });

          feedback.security_issues?.forEach((issue: any) => {
            if (issue.severity === 'high') score -= 15;
            else if (issue.severity === 'medium') score -= 8;
            else score -= 3;
          });

          totalScore += Math.max(score, 0);
          scoredReviews++;
        }
      });

      const avgScore = scoredReviews > 0 ? Math.round(totalScore / scoredReviews) : 0;

      setStats({ total, reviewed, pending, avgScore });
    } catch (error: any) {
      console.error("Failed to fetch repo data:", error);
      if (error.response?.status === 401) {
        router.push("/signup");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setDisconnecting(true);
      await repoAPI.disconnectRepo(id);
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Failed to disconnect repo:", error);
      alert("Failed to disconnect repository. Please try again.");
    } finally {
      setDisconnecting(false);
    }
  };

  const handleRefresh = () => {
    fetchRepoData(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading repository...</p>
        </div>
      </div>
    );
  }

  if (!repoData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Repository Not Found</h1>
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

  const [owner, repoName] = repoData.repoName.split("/");

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
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-700 hover:text-gray-900 font-medium transition">
              Dashboard
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
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-4 rounded-2xl">
                <Github className="h-10 w-10 text-blue-600" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {repoData.repoName}
                </h1>
                <div className="flex items-center gap-4 text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Connected {new Date(repoData.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Activity className="h-4 w-4" />
                    Webhook Active
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="border-gray-300 hover:border-gray-400"
                asChild
              >
                <a
                  href={`https://github.com/${repoData.repoName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View on GitHub
                </a>
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-red-300 hover:border-red-400 text-red-600 hover:text-red-700"
                    disabled={disconnecting}
                  >
                    {disconnecting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Disconnecting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Disconnect
                      </>
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-gray-900">
                      Disconnect Repository?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-600">
                      This will remove the webhook from GitHub and delete all PR review data for{" "}
                      <span className="font-semibold">{repoData.repoName}</span>. This action
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="border-gray-300">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDisconnect}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Yes, Disconnect
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-10">
          <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Total PRs</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-xl">
                  <GitPullRequest className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Reviewed</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.reviewed}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Pending</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-xl">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Avg Score</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.avgScore}%</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Repository Info */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <Card className="bg-white border-gray-200 shadow-sm md:col-span-2">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900">Repository Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Owner</span>
                <span className="text-gray-900 font-semibold">{owner}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Repository</span>
                <span className="text-gray-900 font-semibold">{repoName}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Webhook ID</span>
                <span className="text-gray-900 font-mono text-sm">{repoData.webhookId}</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-gray-600 font-medium">Status</span>
                <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  <CheckCircle className="h-4 w-4" />
                  Active
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="secondary"
                className="w-full bg-white text-blue-600 hover:bg-gray-100"
                asChild
              >
                <a
                  href={`https://github.com/${repoData.repoName}/pulls`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GitPullRequest className="mr-2 h-4 w-4" />
                  View All PRs
                </a>
              </Button>
              <Button
                variant="secondary"
                className="w-full bg-white text-blue-600 hover:bg-gray-100"
                asChild
              >
                <a
                  href={`https://github.com/${repoData.repoName}/settings/hooks/${repoData.webhookId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Webhook Settings
                </a>
              </Button>
              <Button
                variant="secondary"
                className="w-full bg-white text-blue-600 hover:bg-gray-100"
                asChild
              >
                <a
                  href={`https://github.com/${repoData.repoName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GitBranch className="mr-2 h-4 w-4" />
                  View Repository
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Pull Requests List */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Pull Requests</h2>
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing}
              className="border-gray-300 hover:border-gray-400"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-0">
              {prReviews.length === 0 ? (
                <div className="p-12 text-center">
                  <GitPullRequest className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No pull requests yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Pull requests will appear here once they're created in this repository
                  </p>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    asChild
                  >
                    <a
                      href={`https://github.com/${repoData.repoName}/compare`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <GitPullRequest className="mr-2 h-4 w-4" />
                      Create Pull Request
                    </a>
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {prReviews.map((pr) => (
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
                            PR #{pr.prNumber}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(pr.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-sm">
                          {pr.status === "reviewed" ? (
                            <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                              <CheckCircle className="h-4 w-4" />
                              Reviewed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-medium">
                              <Clock className="h-4 w-4" />
                              {pr.status}
                            </span>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          asChild
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Link href={`/dashboard/PR-review/${pr.id}`}>
                            View Review →
                          </Link>
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
