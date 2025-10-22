"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Github,
  GitPullRequest,
  CheckCircle,
  AlertTriangle,
  PlusCircle,
  Loader2,
  Code,
  Calendar,
  TrendingUp,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { repoAPI, prAPI, authAPI } from "@/services/api";
import { useRouter, useSearchParams } from "next/navigation";

interface ConnectedRepo {
  id: number;
  repoName: string;
  userId: number;
  webhookId: number;
  createdAt: string;
  prCount?: number;
}

interface AvailableRepo {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
  };
  description: string | null;
  private: boolean;
}

interface UserInfo {
  username: string;
  githubId: number;
  avatarUrl: string;
  createdAt: string;
}

interface PRReview {
  id: number;
  prNumber: number;
  prTitle?: string;
  repoName: string;
  author?: string;
  status: string;
  reviewData?: unknown;
  createdAt: string;
  feedback?: {
    aiSuggestions?: Record<string, unknown>;
  };
}

export default function DashboardClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [connectedRepos, setConnectedRepos] = useState<ConnectedRepo[]>([]);
  const [availableRepos, setAvailableRepos] = useState<AvailableRepo[]>([]);
  const [prReviews, setPRReviews] = useState<PRReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [reposLoading, setReposLoading] = useState(false);
  const [connectingRepo, setConnectingRepo] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
      router.replace("/dashboard");
    }
  }, [searchParams, router]);

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [connectedReposRes, prReviewsRes, userRes] = await Promise.all([
        repoAPI.getConnectedRepos(),
        prAPI.getPRReviews(),
        authAPI.getCurrentUser(),
      ]);

      setConnectedRepos(connectedReposRes.repos);
      setPRReviews(prReviewsRes.reviews);
      if (userRes.success && userRes.user) {
        setUserInfo(userRes.user);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      const err = error as { response?: { status?: number } };
      if (err.response?.status === 401) {
        router.push("/signup");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableRepos = async () => {
    try {
      setReposLoading(true);
      const response = await repoAPI.getRepos();

      const connectedRepoNames = new Set(connectedRepos.map(r => r.repoName));
      const available = response.repos.filter(
        repo => !connectedRepoNames.has(repo.full_name)
      );

      setAvailableRepos(available);
    } catch (error) {
      console.error("Failed to fetch repos:", error);
    } finally {
      setReposLoading(false);
    }
  };

  const handleConnectRepo = async (full_name: string) => {
    try {
      setConnectingRepo(full_name);
      const response = await repoAPI.connectRepo(full_name);

      if (response.success) {
        await fetchDashboardData();
        setAvailableRepos(prev => prev.filter(r => r.full_name !== full_name));
        setDialogOpen(false);
      }
    } catch (error) {
      console.error("Failed to connect repo:", error);
      const err = error as { response?: { data?: { message?: string } } };
      alert(err.response?.data?.message || "Failed to connect repository");
    } finally {
      setConnectingRepo(null);
    }
  };

  const handleDialogOpen = (open: boolean) => {
    setDialogOpen(open);
    if (open && availableRepos.length === 0) {
      fetchAvailableRepos();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl">
              <Code className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">CodeReviewHub</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-blue-600 font-semibold">
              Dashboard
            </Link>
            <Link href="/dashboard/analytics" className="text-gray-700 hover:text-gray-900 font-medium transition">
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
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {userInfo?.username || "Developer"}!
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your repositories and review pull requests
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Connected Repos</p>
                  <p className="text-3xl font-bold text-gray-900">{connectedRepos.length}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-xl">
                  <Github className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Total Reviews</p>
                  <p className="text-3xl font-bold text-gray-900">{prReviews.length}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-xl">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Active PRs</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {prReviews.filter(pr => pr.status !== 'reviewed').length}
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Connected Repos */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Connected Repositories
            </h2>
            <Dialog open={dialogOpen} onOpenChange={handleDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Connect Repository
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white border-gray-200 text-gray-900 max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-gray-900">
                    Select a Repository
                  </DialogTitle>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto">
                  {reposLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    </div>
                  ) : availableRepos.length === 0 ? (
                    <div className="text-center py-12">
                      <Github className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600 font-medium">No repositories available</p>
                      <p className="text-gray-500 text-sm mt-2">All your repos are already connected</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {availableRepos.map((repo) => (
                        <div
                          key={repo.id}
                          className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{repo.full_name}</p>
                            <p className="text-sm text-gray-600 mt-1">
                              {repo.description || "No description available"}
                            </p>
                          </div>
                          <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white ml-4"
                            onClick={() => handleConnectRepo(repo.full_name)}
                            disabled={connectingRepo === repo.full_name}
                          >
                            {connectingRepo === repo.full_name ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              "Connect"
                            )}
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {connectedRepos.length === 0 ? (
            <Card className="bg-white border-2 border-dashed border-gray-300">
              <CardContent className="p-12 text-center">
                <Github className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No repositories connected yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Connect your first repository to start reviewing pull requests
                </p>
                <Dialog open={dialogOpen} onOpenChange={handleDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                      <PlusCircle className="mr-2 h-5 w-5" />
                      Connect Your First Repo
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {connectedRepos.map((repo) => (
                <Card
                  key={repo.id}
                  className="bg-white border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
                >
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                      <Github className="w-5 h-5 text-gray-600" />
                      {repo.repoName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <GitPullRequest className="w-4 h-4" />
                        <span className="text-sm">{repo.prCount} PRs</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span className="text-xs">
                          {new Date(repo.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-700"
                      asChild
                    >
                      <Link href={`/dashboard/repo/${repo.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Recent PRs */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Pull Requests</h2>
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-0">
              {prReviews.length === 0 ? (
                <div className="p-12 text-center">
                  <GitPullRequest className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">No pull requests yet</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Pull requests will appear here once they&apos;re created
                  </p>
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
                          <p className="text-sm text-gray-600">{pr.repoName}</p>
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
                              <AlertTriangle className="h-4 w-4" />
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
