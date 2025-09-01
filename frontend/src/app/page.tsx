import { Button } from "@/components/ui/button";
import { Github, Code, CheckCircle, AlertTriangle, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold">CodeAI Review</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/signup" className="text-black">
                Sign In
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center pt-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            Revolutionize Your Code Reviews with AI
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Connect your GitHub repo and let our AI provide instant, detailed
            feedback on every Pull Request. Catch bugs, improve code quality,
            and ship faster.
          </p>
          <Link href={"/signup"}>
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 cursor-pointer"
            >
              <Github className="mr-2 h-5 w-5" />
              Connect with GitHub
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            Powerful Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition">
              <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
              <h3 className="text-2xl font-semibold mb-2">
                Comprehensive Reviews
              </h3>
              <p className="text-gray-400">
                AI analyzes code changes, detects issues, suggests improvements,
                and checks best practices.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition">
              <AlertTriangle className="w-12 h-12 text-yellow-500 mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Error Detection</h3>
              <p className="text-gray-400">
                Identify bugs, security vulnerabilities, and performance
                bottlenecks before they hit production.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition">
              <Zap className="w-12 h-12 text-purple-500 mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Instant Feedback</h3>
              <p className="text-gray-400">
                Get reviews in seconds on every PR, accelerating your
                development workflow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 w-12 h-12 mx-auto rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                1
              </div>
              <h3 className="text-2xl font-semibold mb-2">Connect GitHub</h3>
              <p className="text-gray-400">
                Link your repositories with a single click.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 w-12 h-12 mx-auto rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                2
              </div>
              <h3 className="text-2xl font-semibold mb-2">Select Repo</h3>
              <p className="text-gray-400">Choose which projects to monitor.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 w-12 h-12 mx-auto rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                3
              </div>
              <h3 className="text-2xl font-semibold mb-2">AI Reviews PRs</h3>
              <p className="text-gray-400">
                Automatic, detailed feedback on every pull request.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-purple-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Elevate Your Code?
          </h2>
          <p className="text-xl text-gray-200 mb-8">
            Join thousands of developers using AI-powered code reviews.
          </p>
          <Link href={"/signup"}>
            <Button
              size="lg"
              className=" cursor-pointer bg-white text-black hover:bg-gray-200 font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-black border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-around items-center">
          <p className="text-gray-500">
            &copy; 2025 CodeAI Review. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/terms" className="text-gray-500 hover:text-white">
              Terms
            </Link>
            <Link href="/privacy" className="text-gray-500 hover:text-white">
              Privacy
            </Link>
            <Link href="/contact" className="text-gray-500 hover:text-white">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
