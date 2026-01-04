"use client";

import { Github, Code, Sparkles, Shield, Zap, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const handleGitHubLogin = async () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/github`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl animate-float delay-200"></div>
      </div>

      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left Side - Branding */}
        <div className="hidden md:block animate-slide-up">
          <Link href="/" className="flex items-center gap-2 mb-6 cursor-pointer group">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
              <Code className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              CodeReviewHub
            </span>
          </Link>

          <h2 className="text-3xl font-bold text-gray-900 mb-4 leading-tight animate-slide-up delay-100">
            Transform Your Code
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
              Review Process
            </span>
          </h2>

          <p className="text-base text-gray-600 mb-6 animate-slide-up delay-200">
            Join thousands of developers using AI-powered code reviews to ship better code faster.
          </p>

          <div className="space-y-3 animate-slide-up delay-300">
            <div className="flex items-start gap-2.5 group cursor-pointer">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-1.5 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm mb-0.5">AI-Powered Analysis</h3>
                <p className="text-gray-600 text-xs">Get instant feedback on every pull request</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 group cursor-pointer">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-1.5 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm mb-0.5">Lightning Fast</h3>
                <p className="text-gray-600 text-xs">Reviews completed in seconds, not hours</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 group cursor-pointer">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-1.5 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm mb-0.5">Enterprise Security</h3>
                <p className="text-gray-600 text-xs">SOC 2 compliant with industry-grade encryption</p>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 pt-6 border-t border-gray-200 animate-fade-in delay-400">
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                <span>1M+ PRs Reviewed</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                <span>10K+ Developers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-gray-200/50 animate-scale-in">
          <div className="md:hidden flex items-center gap-2 mb-6 justify-center">
            <Link href="/" className="flex items-center gap-2 cursor-pointer">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-1.5 rounded-lg">
                <Code className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                CodeReviewHub
              </span>
            </Link>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-sm text-gray-600">
              Sign in to access your AI code review dashboard
            </p>
          </div>

          <button
            onClick={handleGitHubLogin}
            className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white py-3 px-5 rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer group"
          >
            <Github className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            Continue with GitHub
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-gray-500">
                Secure authentication via GitHub OAuth
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-xl p-3.5">
            <p className="text-xs text-gray-700 text-center leading-relaxed">
              <span className="font-semibold text-sm">Free Trial Available</span>
              <br />
              <span className="text-gray-600">Start with 14 days of full access, no credit card required</span>
            </p>
          </div>

          <p className="text-gray-500 text-xs text-center mt-6 leading-relaxed">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="text-blue-600 hover:text-blue-700 font-medium underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-blue-600 hover:text-blue-700 font-medium underline">
              Privacy Policy
            </Link>
          </p>

          <div className="mt-6 pt-5 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-600">
              New to CodeReviewHub?{" "}
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
