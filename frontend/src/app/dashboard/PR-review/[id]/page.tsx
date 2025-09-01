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
  GitPullRequest,
  CheckCircle,
  AlertTriangle,
  Code2,
  Lightbulb,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// Mock data for a single PR review (replace with actual API/DB fetch)
const getMockPRData = (id: string) => {
  const prs = {
    "1": {
      id: "1",
      title: "Add user auth feature",
      repo: "my-awesome-project",
      author: "dev-user",
      status: "Reviewed",
      issues: [
        {
          type: "Error",
          description: "Potential SQL injection in login query.",
          severity: "High",
          codeSnippet:
            "const query = `SELECT * FROM users WHERE username = '${username}'`;",
        },
        {
          type: "Performance",
          description: "Unoptimized loop in auth handler.",
          severity: "Medium",
          codeSnippet: "for (let i = 0; i < array.length; i++) { ... }",
        },
      ],
      suggestions: [
        {
          description: "Use prepared statements to prevent SQL injection.",
          improvedCode:
            "const query = 'SELECT * FROM users WHERE username = ?'; stmt.prepare(query, [username]);",
        },
        {
          description: "Switch to forEach for better readability.",
          improvedCode: "array.forEach(item => { ... });",
        },
      ],
      bestPractices: [
        "Follow OWASP guidelines for authentication.",
        "Implement rate limiting on login attempts.",
        "Use bcrypt for password hashing.",
      ],
      overallScore: 85,
      summary:
        "The PR introduces a solid auth feature but needs security and performance tweaks for production readiness.",
    },
    // Add more mock PRs as needed
  };

  return prs[id as keyof typeof prs] || null;
};

export default function PRReviewPage({ params }: { params: { id: string } }) {
  const pr = getMockPRData(params.id);
  if (!pr) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Github className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold">CodeAI Review</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="hover:text-blue-400 transition">
              Dashboard
            </Link>
            <Button variant="outline" size="icon">
              <Github className="h-5 w-5 text-black" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 pt-24 pb-12">
        <Link
          href="/dashboard"
          className="text-blue-400 hover:underline mb-4 inline-block"
        >
          &larr; Back to Dashboard
        </Link>

        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{pr.title}</h1>
          <div className="flex items-center gap-4 text-gray-400">
            <span>Repo: {pr.repo}</span>
            <span>Author: {pr.author}</span>
            <span
              className={`flex items-center gap-1 ${
                pr.status === "Reviewed" ? "text-green-500" : "text-yellow-500"
              }`}
            >
              {pr.status === "Reviewed" ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertTriangle className="h-5 w-5" />
              )}
              {pr.status}
            </span>
          </div>
        </header>

        {/* Overview Card */}
        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-white">
              AI Review Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-300 mb-4">{pr.summary}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-white">
                    Overall Score:
                  </span>
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 flex items-center justify-center text-3xl font-bold">
                    {pr.overallScore}%
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700 p-4 rounded-lg text-center">
                  <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{pr.issues.length}</p>
                  <p>Issues Found</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg text-center">
                  <Lightbulb className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{pr.suggestions.length}</p>
                  <p>Suggestions</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg text-center">
                  <ShieldCheck className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">
                    {pr.bestPractices.length}
                  </p>
                  <p>Best Practices</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Issues Section */}
        <section className="mb-8">
          <h2 className="text-3xl font-bold mb-4">Identified Issues</h2>
          <Accordion type="single" collapsible className="w-full">
            {pr.issues.map((issue, index) => (
              <AccordionItem key={index} value={`issue-${index}`}>
                <AccordionTrigger className="hover:bg-gray-800 p-4 rounded-t-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle
                      className={`h-5 w-5 ${
                        issue.severity === "High"
                          ? "text-red-500"
                          : "text-yellow-500"
                      }`}
                    />
                    <span>
                      {issue.type} - {issue.severity} Severity
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="bg-gray-800 p-4 rounded-b-lg">
                  <p className="mb-4">{issue.description}</p>
                  <pre className="bg-black p-4 rounded-lg overflow-x-auto">
                    <code className="text-red-300">{issue.codeSnippet}</code>
                  </pre>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Suggestions Section */}
        <section className="mb-8">
          <h2 className="text-3xl font-bold mb-4">Improvement Suggestions</h2>
          <Accordion type="single" collapsible className="w-full">
            {pr.suggestions.map((sug, index) => (
              <AccordionItem key={index} value={`sug-${index}`}>
                <AccordionTrigger className="hover:bg-gray-800 p-4 rounded-t-lg">
                  <div className="flex items-center gap-3">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    <span>Suggestion {index + 1}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="bg-gray-800 p-4 rounded-b-lg">
                  <p className="mb-4">{sug.description}</p>
                  <pre className="bg-black p-4 rounded-lg overflow-x-auto">
                    <code className="text-green-300">{sug.improvedCode}</code>
                  </pre>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Best Practices Section */}
        <section>
          <h2 className="text-3xl font-bold mb-4">
            Recommended Best Practices
          </h2>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <ul className="list-disc pl-6 space-y-2">
                {pr.bestPractices.map((bp, index) => (
                  <li key={index} className="text-gray-300">
                    {bp}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
