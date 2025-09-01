import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Github,
  GitPullRequest,
  CheckCircle,
  AlertTriangle,
  Settings,
} from "lucide-react";
import Link from "next/link";

// Mock data for demo (replace with actual GitHub API calls)
const mockRepos = [
  { id: 1, name: "my-awesome-project", owner: "user", prCount: 3 },
  { id: 2, name: "cool-app", owner: "user", prCount: 1 },
];

const mockPRs = [
  {
    id: 1,
    repo: "my-awesome-project",
    title: "Add user auth feature",
    status: "Reviewed",
    issues: 2,
    suggestions: 5,
  },
  {
    id: 2,
    repo: "my-awesome-project",
    title: "Fix navbar bug",
    status: "Pending",
    issues: 0,
    suggestions: 0,
  },
  {
    id: 3,
    repo: "cool-app",
    title: "Optimize DB queries",
    status: "Reviewed",
    issues: 1,
    suggestions: 3,
  },
];

export default async function Dashboard() {
  const session = true;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Github className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold">CodeAI Review</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-blue-400 font-semibold">
              Dashboard
            </Link>

            <Button variant="outline" size="icon" className="cursor-pointer">
              <Settings className="h-5 w-5 text-black cursor-pointer" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pt-24 pb-12">
        <h1 className="text-4xl font-bold mb-8">Welcome, {"Developer"}!</h1>

        {/* Connected Repos */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            Connected Repositories
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {mockRepos.map((repo) => (
              <Card
                key={repo.id}
                className="bg-gray-800 border-gray-700 hover:border-blue-500 transition"
              >
                <CardHeader>
                  <CardTitle className="text-xl text-white">
                    {repo.owner}/{repo.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">Active PRs: {repo.prCount}</p>
                  <Button variant="outline" className="mt-4 w-full" asChild>
                    <Link href={`/dashboard/repo/${repo.id}`}>
                      View Details
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
            <Card className="bg-gray-800 border-dashed border-2 border-gray-600 flex items-center justify-center">
              <CardContent>
                <Button className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
                  <Github className="mr-2 h-5 w-5" />
                  Connect New Repo
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Recent PRs */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Recent Pull Requests</h2>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-0">
              <div className="divide-y divide-gray-700">
                {mockPRs.map((pr) => (
                  <div
                    key={pr.id}
                    className="flex items-center justify-between p-4 hover:bg-gray-700 transition"
                  >
                    <div className="flex items-center gap-4">
                      <GitPullRequest className="h-6 w-6 text-blue-400" />
                      <div>
                        <p className="font-semibold text-white">{pr.title}</p>
                        <p className="text-sm text-gray-400">{pr.repo}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm">
                        {pr.status === "Reviewed" ? (
                          <span className="flex items-center gap-1 text-green-500">
                            <CheckCircle className="h-4 w-4" /> Reviewed
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-yellow-500">
                            <AlertTriangle className="h-4 w-4" /> Pending
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">
                        {pr.issues} Issues, {pr.suggestions} Suggestions
                      </p>
                      <Button variant="link" asChild className="text-blue-400">
                        <Link href={`/dashboard/pr/${pr.id}`}>View Review</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
