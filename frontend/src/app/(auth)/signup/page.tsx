"use client";

import { Github, Code, Sparkles, Shield, Zap } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const handleGitHubLogin = async () => {
    window.location.href = "http://localhost:8000/auth/github";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-6">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">
        {/* Left Side - Branding */}
        <div className="hidden md:block">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl">
              <Code className="w-8 h-8 text-white" />
            </div>
            <span className="text-3xl font-bold text-gray-900">
              CodeAI Review
            </span>
          </div>

          <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
            Transform Your Code
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Review Process
            </span>
          </h2>

          <p className="text-lg text-gray-600 mb-8">
            Join thousands of developers using AI-powered code reviews to ship better code faster.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Sparkles className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">AI-Powered Analysis</h3>
                <p className="text-gray-600 text-sm">Get instant feedback on every pull request</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Zap className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Lightning Fast</h3>
                <p className="text-gray-600 text-sm">Reviews completed in seconds, not hours</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Enterprise Security</h3>
                <p className="text-gray-600 text-sm">SOC 2 compliant with industry-grade encryption</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-200">
          <div className="md:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg">
              <Code className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              CodeAI Review
            </span>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Welcome Back
            </h1>
            <p className="text-gray-600">
              Sign in to access your AI code review dashboard
            </p>
          </div>

          <button
            onClick={handleGitHubLogin}
            className="w-full flex items-center justify-center gap-3 bg-gray-900 hover:bg-gray-800 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Github className="w-6 h-6" />
            Continue with GitHub
          </button>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">
                Secure authentication via GitHub OAuth
              </span>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-gray-700 text-center">
              <span className="font-semibold">🎉 Free Trial Available</span>
              <br />
              Start with 14 days of full access, no credit card required
            </p>
          </div>

          <p className="text-gray-500 text-xs text-center mt-8 leading-relaxed">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="text-blue-600 hover:text-blue-700 font-medium underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-blue-600 hover:text-blue-700 font-medium underline">
              Privacy Policy
            </Link>
          </p>

          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              New to CodeAI Review?{" "}
              <Link href="/" className="text-blue-600 hover:text-blue-700 font-semibold">
                Learn more
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
