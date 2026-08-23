"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Github,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  ShieldCheck,
  Loader2,
  ArrowLeft,
  Clock,
  FileCode,
  Shield,
  Bug,
  ExternalLink,
  XCircle,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { prAPI, authAPI } from "@/services/api";
import DashboardNavbar from "@/components/DashboardNavbar";

interface Props {
  id: string;
}

interface UserInfo {
  username: string;
  githubId: number;
  avatarUrl: string;
  createdAt: string;
}

interface Feedback {
  bugs?: Array<{ title: string; details: string; severity: string }>;
  optimizations?: Array<{ title: string; details: string }>;
  security_issues?: Array<{ title: string; details: string; severity: string }>;
  general_feedback?: string[];
  summary?: string;
}

interface PRData {
  id: number;
  prNumber: number;
  repoName: string;
  status: string;
  createdAt: string;
  prTitle?: string;
  author?: string;
  prUrl?: string;
  feedbacks?: Array<{ aiSuggestions?: Feedback }>;
}

const POLL_INTERVAL = 6000;

export default function PRReviewClient({ id }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [prData, setPRData] = useState<PRData | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  const fetchPRReview = async (opts: { silent?: boolean } = {}) => {
    try {
      if (!opts.silent) setLoading(true);
      else setRefreshing(true);

      const [prRes, userRes] = await Promise.all([
        prAPI.getPRReviewById(id),
        authAPI.getCurrentUser(),
      ]);
      const review: PRData = prRes.review;
      setPRData(review);
      if (userRes.success && userRes.user) setUserInfo(userRes.user);

      // Stop polling once terminal state reached
      if (review.status === "reviewed" || review.status === "failed") {
        stopPolling();
      }
    } catch (error) {
      console.error("Failed to fetch PR review:", error);
      const err = error as { response?: { status?: number } };
      if (err.response?.status === 401) router.push("/signup");
      else if (err.response?.status === 404) router.push("/dashboard");
      stopPolling();
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPRReview();
    return () => stopPolling();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Start polling when status is pending/processing
  useEffect(() => {
    if (!prData) return;
    if (prData.status === "pending" || prData.status === "processing") {
      if (!pollRef.current) {
        pollRef.current = setInterval(() => fetchPRReview({ silent: true }), POLL_INTERVAL);
      }
    } else {
      stopPolling();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prData?.status]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading review...</p>
        </div>
      </div>
    );
  }

  if (!prData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">PR Review Not Found</h1>
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

  const feedback = prData.feedbacks?.[0]?.aiSuggestions || {};
  const bugs = feedback.bugs || [];
  const optimizations = feedback.optimizations || [];
  const securityIssues = feedback.security_issues || [];
  const generalFeedback = feedback.general_feedback || [];

  const totalIssues = bugs.length + securityIssues.length;
  const totalSuggestions = optimizations.length;
  const totalBestPractices = generalFeedback.length;

  const summary = feedback.summary ||
    (prData.feedbacks?.[0] ?
      `AI review completed. Found ${totalIssues} issues, ${totalSuggestions} optimization suggestions, and ${totalBestPractices} best practice recommendations.`
      : "Review in progress...");

  const calculateScore = () => {
    if (!prData.feedbacks?.[0]) return 0;
    let score = 100;
    bugs.forEach((bug) => {
      if (bug.severity === "critical") score -= 20;
      else if (bug.severity === "high") score -= 10;
      else if (bug.severity === "medium") score -= 5;
      else score -= 2;
    });
    securityIssues.forEach((issue) => {
      if (issue.severity === "high") score -= 15;
      else if (issue.severity === "medium") score -= 8;
      else score -= 3;
    });
    return Math.max(score, 0);
  };

  const overallScore = calculateScore();

  const statusBadge = () => {
    switch (prData.status) {
      case "reviewed":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full font-medium bg-green-100 text-green-700">
            <CheckCircle className="h-4 w-4" /> Reviewed
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full font-medium bg-red-100 text-red-700">
            <XCircle className="h-4 w-4" /> Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full font-medium bg-yellow-100 text-yellow-700">
            <Loader2 className="h-4 w-4 animate-spin" />
            {prData.status.charAt(0).toUpperCase() + prData.status.slice(1)}
          </span>
        );
    }
  };

  const githubPRUrl = prData.prUrl ||
    `https://github.com/${prData.repoName}/pull/${prData.prNumber}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar avatarUrl={userInfo?.avatarUrl} />

      <main className="max-w-6xl mx-auto px-6 py-10">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-xl">
                <FileCode className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">
                  {prData.prTitle ? prData.prTitle : `Pull Request #${prData.prNumber}`}
                </h1>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-gray-600">
                  <span className="flex items-center gap-1">
                    <Github className="h-4 w-4" />
                    {prData.repoName}
                  </span>
                  {prData.author && (
                    <span className="text-sm">by @{prData.author}</span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {new Date(prData.createdAt).toLocaleDateString()}
                  </span>
                  {statusBadge()}
                </div>
              </div>
            </div>
            <a
              href={githubPRUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 hover:border-gray-400 px-3 py-2 rounded-lg transition-colors flex-shrink-0"
            >
              <ExternalLink className="h-4 w-4" />
              View on GitHub
            </a>
          </div>
        </header>

        {/* Overview Card */}
        <Card className="bg-white border-gray-200 shadow-sm mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-900">AI Review Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-gray-700 mb-6 leading-relaxed">{summary}</p>
                {overallScore > 0 && (
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-semibold text-gray-900">Quality Score:</span>
                    <div className="relative w-24 h-24">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 opacity-20"></div>
                      <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                        <span className="text-3xl font-bold bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 bg-clip-text text-transparent">
                          {overallScore}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-center">
                  <Bug className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{totalIssues}</p>
                  <p className="text-sm text-gray-600">Issues</p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl text-center">
                  <Lightbulb className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{totalSuggestions}</p>
                  <p className="text-sm text-gray-600">Optimizations</p>
                </div>
                <div className="bg-green-50 border border-green-200 p-4 rounded-xl text-center">
                  <ShieldCheck className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{totalBestPractices}</p>
                  <p className="text-sm text-gray-600">Best Practices</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bugs */}
        {bugs.length > 0 && (
          <section className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Bug className="h-8 w-8 text-red-600" /> Bugs Detected
            </h2>
            <Accordion type="single" collapsible className="space-y-3">
              {bugs.map((bug, index) => (
                <AccordionItem
                  key={index}
                  value={`bug-${index}`}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden"
                >
                  <AccordionTrigger className="hover:bg-gray-50 px-6 py-4">
                    <div className="flex items-center gap-3 text-left">
                      <AlertTriangle className={`h-5 w-5 flex-shrink-0 ${bug.severity === "critical" || bug.severity === "high" ? "text-red-600" : "text-orange-600"}`} />
                      <div>
                        <span className="font-semibold text-gray-900 block">{bug.title}</span>
                        <span className={`text-xs px-2 py-1 rounded mt-1 inline-block ${
                          bug.severity === "critical" ? "bg-red-100 text-red-700" :
                          bug.severity === "high" ? "bg-orange-100 text-orange-700" :
                          bug.severity === "medium" ? "bg-yellow-100 text-yellow-700" :
                          "bg-gray-100 text-gray-700"
                        }`}>
                          {bug.severity.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{bug.details}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        )}

        {/* Security Issues */}
        {securityIssues.length > 0 && (
          <section className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="h-8 w-8 text-red-600" /> Security Issues
            </h2>
            <Accordion type="single" collapsible className="space-y-3">
              {securityIssues.map((issue, index) => (
                <AccordionItem
                  key={index}
                  value={`security-${index}`}
                  className="bg-white border border-red-200 rounded-xl overflow-hidden"
                >
                  <AccordionTrigger className="hover:bg-red-50 px-6 py-4">
                    <div className="flex items-center gap-3 text-left">
                      <Shield className={`h-5 w-5 flex-shrink-0 ${issue.severity === "high" ? "text-red-600" : "text-orange-600"}`} />
                      <div>
                        <span className="font-semibold text-gray-900 block">{issue.title}</span>
                        <span className={`text-xs px-2 py-1 rounded mt-1 inline-block ${
                          issue.severity === "high" ? "bg-red-100 text-red-700" :
                          issue.severity === "medium" ? "bg-orange-100 text-orange-700" :
                          "bg-yellow-100 text-yellow-700"
                        }`}>
                          {issue.severity.toUpperCase()} SECURITY RISK
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{issue.details}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        )}

        {/* Optimizations */}
        {optimizations.length > 0 && (
          <section className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Lightbulb className="h-8 w-8 text-yellow-600" /> Optimization Suggestions
            </h2>
            <Accordion type="single" collapsible className="space-y-3">
              {optimizations.map((opt, index) => (
                <AccordionItem
                  key={index}
                  value={`opt-${index}`}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden"
                >
                  <AccordionTrigger className="hover:bg-gray-50 px-6 py-4">
                    <div className="flex items-center gap-3 text-left">
                      <Lightbulb className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                      <span className="font-semibold text-gray-900">{opt.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{opt.details}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        )}

        {/* Best Practices */}
        {generalFeedback.length > 0 && (
          <section className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Best Practices & Recommendations</h2>
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <ul className="space-y-3">
                  {generalFeedback.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Pending / Processing / Failed state */}
        {(!prData.feedbacks || prData.feedbacks.length === 0) && (
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-12 text-center">
              {prData.status === "failed" ? (
                <>
                  <div className="bg-red-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <XCircle className="h-10 w-10 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Review Failed</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    The AI was unable to process this pull request. This can happen with very large diffs or temporary service issues.
                  </p>
                </>
              ) : (
                <>
                  <div className="bg-yellow-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <Loader2 className="h-10 w-10 text-yellow-600 animate-spin" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Review in Progress</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Our AI is analyzing this pull request. This page will update automatically.
                  </p>
                </>
              )}
              <Button
                onClick={() => fetchPRReview({ silent: true })}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={refreshing}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
