"use client";

import { useEffect, useState } from "react";
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
  Code,
  ArrowLeft,
  Clock,
  FileCode,
  Shield,
  Bug,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { prAPI, authAPI } from "@/services/api";

interface Props {
  id: string;
}

export default function PRReviewClient({ id }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [prData, setPRData] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    fetchPRReview();
  }, [id]);

  const fetchPRReview = async () => {
    try {
      setLoading(true);
      const [prRes, userRes] = await Promise.all([
        prAPI.getPRReviewById(id),
        authAPI.getCurrentUser(),
      ]);
      setPRData(prRes.review);
      if (userRes.success && userRes.user) {
        setUserInfo(userRes.user);
      }
    } catch (error: any) {
      console.error("Failed to fetch PR review:", error);
      if (error.response?.status === 401) {
        router.push("/signup");
      } else if (error.response?.status === 404) {
        router.push("/dashboard");
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

  // Get feedback from backend format
  const feedback = prData.feedbacks?.[0]?.aiSuggestions || {};
  const bugs = feedback.bugs || [];
  const optimizations = feedback.optimizations || [];
  const securityIssues = feedback.security_issues || [];
  const generalFeedback = feedback.general_feedback || [];

  // Calculate total issues
  const totalIssues = bugs.length + securityIssues.length;
  const totalSuggestions = optimizations.length;
  const totalBestPractices = generalFeedback.length;

  // Generate summary if not exists
  const summary = feedback.summary ||
    (prData.feedbacks?.[0] ?
      `AI review completed. Found ${totalIssues} issues, ${totalSuggestions} optimization suggestions, and ${totalBestPractices} best practice recommendations.`
      : "Review in progress...");

  // Calculate overall score based on severity
  const calculateScore = () => {
    if (!prData.feedbacks?.[0]) return 0;

    let score = 100;
    bugs.forEach((bug: any) => {
      if (bug.severity === 'critical') score -= 20;
      else if (bug.severity === 'high') score -= 10;
      else if (bug.severity === 'medium') score -= 5;
      else score -= 2;
    });
    securityIssues.forEach((issue: any) => {
      if (issue.severity === 'high') score -= 15;
      else if (issue.severity === 'medium') score -= 8;
      else score -= 3;
    });
    return Math.max(score, 0);
  };

  const overallScore = calculateScore();

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
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <FileCode className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Pull Request #{prData.prNumber}</h1>
              <div className="flex items-center gap-4 mt-2 text-gray-600">
                <span className="flex items-center gap-1">
                  <Github className="h-4 w-4" />
                  {prData.repoName}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {new Date(prData.createdAt).toLocaleDateString()}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-medium ${
                    prData.status === "reviewed"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {prData.status === "reviewed" ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertTriangle className="h-4 w-4" />
                  )}
                  {prData.status.charAt(0).toUpperCase() + prData.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Overview Card */}
        <Card className="bg-white border-gray-200 shadow-sm mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-900">
              AI Review Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-gray-700 mb-6 leading-relaxed">{summary}</p>
                {overallScore > 0 && (
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-semibold text-gray-900">
                      Quality Score:
                    </span>
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

        {/* Bugs Section */}
        {bugs.length > 0 && (
          <section className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Bug className="h-8 w-8 text-red-600" />
              Bugs Detected
            </h2>
            <Accordion type="single" collapsible className="space-y-3">
              {bugs.map((bug: any, index: number) => (
                <AccordionItem
                  key={index}
                  value={`bug-${index}`}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden"
                >
                  <AccordionTrigger className="hover:bg-gray-50 px-6 py-4">
                    <div className="flex items-center gap-3 text-left">
                      <AlertTriangle
                        className={`h-5 w-5 flex-shrink-0 ${
                          bug.severity === "critical" || bug.severity === "high"
                            ? "text-red-600"
                            : "text-orange-600"
                        }`}
                      />
                      <div>
                        <span className="font-semibold text-gray-900 block">
                          {bug.title}
                        </span>
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

        {/* Security Issues Section */}
        {securityIssues.length > 0 && (
          <section className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="h-8 w-8 text-red-600" />
              Security Issues
            </h2>
            <Accordion type="single" collapsible className="space-y-3">
              {securityIssues.map((issue: any, index: number) => (
                <AccordionItem
                  key={index}
                  value={`security-${index}`}
                  className="bg-white border border-red-200 rounded-xl overflow-hidden"
                >
                  <AccordionTrigger className="hover:bg-red-50 px-6 py-4">
                    <div className="flex items-center gap-3 text-left">
                      <Shield
                        className={`h-5 w-5 flex-shrink-0 ${
                          issue.severity === "high" ? "text-red-600" : "text-orange-600"
                        }`}
                      />
                      <div>
                        <span className="font-semibold text-gray-900 block">
                          {issue.title}
                        </span>
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

        {/* Optimizations Section */}
        {optimizations.length > 0 && (
          <section className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Lightbulb className="h-8 w-8 text-yellow-600" />
              Optimization Suggestions
            </h2>
            <Accordion type="single" collapsible className="space-y-3">
              {optimizations.map((opt: any, index: number) => (
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

        {/* Best Practices Section */}
        {generalFeedback.length > 0 && (
          <section className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Best Practices & Recommendations
            </h2>
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <ul className="space-y-3">
                  {generalFeedback.map((feedback: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feedback}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>
        )}

        {/* No feedback yet */}
        {(!prData.feedbacks || prData.feedbacks.length === 0) && (
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-12 text-center">
              <div className="bg-yellow-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <AlertTriangle className="h-10 w-10 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Review in Progress</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Our AI is analyzing this pull request. This usually takes just a few seconds.
                Check back soon for detailed feedback!
              </p>
              <Button
                onClick={fetchPRReview}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Loader2 className="mr-2 h-4 w-4" />
                Refresh Review
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
