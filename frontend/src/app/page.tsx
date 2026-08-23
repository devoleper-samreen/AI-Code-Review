"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Github, Code, CheckCircle, AlertTriangle, Zap, Star, Users, Shield,
  ArrowRight, Sparkles, Lock, TrendingUp, Clock, Award, Check, X,
  GitBranch, FileCode, Bug, Rocket, Building2, BarChart3, Globe
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [selectedPlan, setSelectedPlan] = useState<string>("Pro");

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const pricingPlans = [
    {
      name: "Free",
      price: 0,
      description: "Perfect for individual developers and small projects",
      features: [
        { text: "5 PR reviews per month", included: true },
        { text: "1 repository", included: true },
        { text: "Basic AI analysis", included: true },
        { text: "GitHub integration", included: true },
        { text: "Community support", included: true },
        { text: "Advanced security scanning", included: false },
        { text: "Priority support", included: false },
        { text: "Custom AI models", included: false },
      ],
      cta: "Get Started Free",
      popular: false,
    },
    {
      name: "Pro",
      price: billingCycle === "monthly" ? 49 : 39,
      description: "For professional developers and growing teams",
      features: [
        { text: "Unlimited PR reviews", included: true },
        { text: "Up to 10 repositories", included: true },
        { text: "Advanced AI analysis", included: true },
        { text: "GitHub integration", included: true },
        { text: "Advanced security scanning", included: true },
        { text: "Priority email support", included: true },
        { text: "Review analytics dashboard", included: true },
        { text: "Custom review rules", included: true },
        { text: "Team collaboration tools", included: true },
        { text: "API access", included: true },
        { text: "Custom AI models", included: false },
        { text: "Dedicated account manager", included: false },
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "Advanced features for large teams and organizations",
      features: [
        { text: "Unlimited everything", included: true },
        { text: "Unlimited repositories", included: true },
        { text: "Custom AI models", included: true },
        { text: "Advanced security & compliance", included: true },
        { text: "SSO & SAML authentication", included: true },
        { text: "Dedicated account manager", included: true },
        { text: "24/7 priority support", included: true },
        { text: "SLA guarantee (99.9%)", included: true },
        { text: "On-premise deployment option", included: true },
        { text: "Custom integrations", included: true },
        { text: "Advanced team management", included: true },
        { text: "Custom contract & invoicing", included: true },
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Engineering Lead at TechCorp",
      image: "https://ui-avatars.com/api/?name=Priya+Sharma&background=6366f1&color=fff&size=128&font-size=0.5&bold=true",
      content: "PR Reviewer has transformed our code review process. We catch bugs 3x faster and our code quality has improved significantly. The AI suggestions are incredibly accurate!",
      rating: 5,
    },
    {
      name: "Rahul Verma",
      role: "Senior Developer at StartupXYZ",
      image: "https://ui-avatars.com/api/?name=Rahul+Verma&background=8b5cf6&color=fff&size=128&font-size=0.5&bold=true",
      content: "Best investment we've made for our development workflow. The AI catches issues that even experienced developers miss. Saved us countless hours of manual review time.",
      rating: 5,
    },
    {
      name: "Ananya Patel",
      role: "CTO at DevStudio",
      image: "https://ui-avatars.com/api/?name=Ananya+Patel&background=ec4899&color=fff&size=128&font-size=0.5&bold=true",
      content: "The security scanning feature alone is worth the price. We've identified and fixed vulnerabilities before they reached production. Highly recommend!",
      rating: 5,
    },
  ];

  const faqs = [
    {
      question: "How does the AI code review work?",
      answer: "Our AI uses Google Gemini to analyze your pull requests, understanding code context through vector embeddings. It checks for bugs, security issues, performance problems, and best practice violations, then posts detailed feedback directly on your GitHub PRs.",
    },
    {
      question: "Is my code secure and private?",
      answer: "Absolutely! We use enterprise-grade encryption for all data. Your code is never stored permanently and is only processed temporarily for analysis. We're SOC 2 compliant and offer on-premise deployment for enterprise customers.",
    },
    {
      question: "Can I try it before committing to a paid plan?",
      answer: "Yes! We offer a 14-day free trial for the Pro plan with no credit card required. You can also start with our Free tier to test the platform with limited reviews.",
    },
    {
      question: "Which languages and frameworks are supported?",
      answer: "We support all major programming languages including JavaScript, TypeScript, Python, Java, Go, Rust, C++, Ruby, PHP, and more. Our AI understands popular frameworks like React, Vue, Angular, Django, Spring Boot, and others.",
    },
    {
      question: "How do I integrate with my GitHub repositories?",
      answer: "Integration is simple! Just authenticate with GitHub OAuth, select your repositories, and we'll automatically set up webhooks. From then on, every pull request gets automatically reviewed.",
    },
    {
      question: "What happens if I exceed my plan limits?",
      answer: "You'll receive a notification when approaching your limit. For the Free plan, you can upgrade anytime. Pro users rarely hit limits, but if needed, you can purchase additional capacity or upgrade to Enterprise.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-1.5 rounded-lg">
              <Code className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">
              PR Reviewer
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-gray-700 hover:text-gray-900 font-medium transition-colors">Features</a>
            <a href="#pricing" className="text-sm text-gray-700 hover:text-gray-900 font-medium transition-colors">Pricing</a>
            <a href="#testimonials" className="text-sm text-gray-700 hover:text-gray-900 font-medium transition-colors">Testimonials</a>
            <a href="#faq" className="text-sm text-gray-700 hover:text-gray-900 font-medium transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Button asChild size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm">
                <Link href="/dashboard">
                  Dashboard
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild className="hidden md:inline-flex text-sm text-gray-700 hover:text-gray-900">
                  <Link href="/signup">Sign In</Link>
                </Button>
                <Button asChild size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm">
                  <Link href="/signup">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-28 pb-16 px-6 overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50/30 to-white">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 left-1/2 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 backdrop-blur-sm text-blue-700 px-4 py-2 rounded-full text-xs font-semibold mb-8 border border-blue-200/50 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Powered by Google Gemini AI
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-5 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                Ship Better Code,
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                10x Faster
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
              AI-powered code reviews that catch bugs and security issues{" "}
              <span className="text-blue-600 font-semibold">before production</span>.
              Automate your PR reviews in seconds.
            </p>

            {/* CTA Buttons */}
            <div className="flex items-center justify-center gap-4 flex-wrap mb-8">
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <Button className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-3 rounded-xl text-base shadow-2xl hover:shadow-blue-500/50 transition-all hover:scale-105">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              ) : (
                <Link href="/signup">
                  <Button className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-3 rounded-xl text-base shadow-2xl hover:shadow-blue-500/50 transition-all hover:scale-105">
                    <Github className="mr-2 h-5 w-5" />
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-8 text-sm text-gray-500 flex-wrap">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Free 14-day trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>

          {/* Visual Element - Code Review Preview */}
          <div className="mt-16 max-w-5xl mx-auto">
            <div className="relative group">
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl blur-2xl opacity-25 group-hover:opacity-40 transition-opacity"></div>

              {/* Main Card */}
              <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-2xl overflow-hidden">
                {/* Browser-like Header */}
                <div className="bg-gradient-to-r from-gray-100 to-gray-50 px-4 py-3 border-b border-gray-200 flex items-center gap-2">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="flex-1 text-center text-xs font-medium text-gray-600">
                    PR Reviewer - Pull Request #1234
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-bold text-gray-900">AI Review Bot</span>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">Automated</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">Completed automated code review in 2.3 seconds</p>

                      {/* Review Items */}
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg p-3">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold text-green-900">Code quality looks great!</p>
                            <p className="text-xs text-green-700 mt-1">All best practices followed, no issues found.</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold text-yellow-900">Potential performance issue detected</p>
                            <p className="text-xs text-yellow-700 mt-1">Line 42: Consider using memoization for expensive calculation</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold text-blue-900">Security scan passed</p>
                            <p className="text-xs text-blue-700 mt-1">No vulnerabilities detected. All dependencies are up to date.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto">
            <div className="text-center p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1">10K+</div>
              <div className="text-xs text-gray-600 font-medium">Active Developers</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-green-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-1">500K+</div>
              <div className="text-xs text-gray-600 font-medium">PRs Reviewed</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">99.9%</div>
              <div className="text-xs text-gray-600 font-medium">Uptime SLA</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-orange-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent mb-1">2.3s</div>
              <div className="text-xs text-gray-600 font-medium">Avg Review Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Logo Wall - Trusted By */}
      <section className="py-12 bg-gray-50 border-y border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-gray-500 font-medium mb-6 uppercase tracking-wider text-xs">
            Trusted by development teams worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-50">
            <div className="flex items-center gap-2 text-lg font-bold text-gray-700">
              <Building2 className="w-5 h-5" />
              <span>TechCorp</span>
            </div>
            <div className="flex items-center gap-2 text-lg font-bold text-gray-700">
              <Rocket className="w-5 h-5" />
              <span>StartupXYZ</span>
            </div>
            <div className="flex items-center gap-2 text-lg font-bold text-gray-700">
              <Globe className="w-5 h-5" />
              <span>DevStudio</span>
            </div>
            <div className="flex items-center gap-2 text-lg font-bold text-gray-700">
              <Code className="w-5 h-5" />
              <span>CodeLabs</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold mb-3">
              Features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Everything You Need for Better Code
            </h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              Powerful AI-driven features to help your team ship quality code faster
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="group bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
              <div className="bg-gradient-to-br from-green-500 to-emerald-500 w-10 h-10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Smart Code Analysis
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                AI-powered analysis detects bugs, security issues, and code smells before production.
              </p>
            </div>

            <div className="group bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
              <div className="bg-gradient-to-br from-red-500 to-orange-500 w-10 h-10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Security First
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Identify vulnerabilities automatically with built-in compliance checks and OWASP scanning.
              </p>
            </div>

            <div className="group bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
              <div className="bg-gradient-to-br from-purple-500 to-indigo-500 w-10 h-10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Lightning Fast
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Get comprehensive code reviews in seconds. Automated feedback accelerates your workflow.
              </p>
            </div>

            <div className="group bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 w-10 h-10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Team Collaboration
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Seamless GitHub integration. Keep your team aligned with consistent code quality standards.
              </p>
            </div>

            <div className="group bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
              <div className="bg-gradient-to-br from-pink-500 to-rose-500 w-10 h-10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Star className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Best Practices
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Get suggestions for cleaner code, better architecture, and improved performance.
              </p>
            </div>

            <div className="group bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
              <div className="bg-gradient-to-br from-yellow-500 to-orange-500 w-10 h-10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Analytics Dashboard
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Track code quality metrics and team performance with comprehensive analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold mb-3">
              How It Works
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Set Up in Minutes
            </h2>
            <p className="text-base text-gray-600">
              Three simple steps to transform your code review process
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 w-14 h-14 mx-auto rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg group-hover:scale-110 transition-transform">
                  1
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-blue-200 rounded-xl -z-10 blur-lg opacity-30"></div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-gray-200">
                <Github className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Connect GitHub</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Authenticate with GitHub OAuth in one click. We&apos;ll sync your repositories automatically.
                </p>
              </div>
            </div>

            <div className="text-center group">
              <div className="relative mb-6">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 w-14 h-14 mx-auto rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg group-hover:scale-110 transition-transform">
                  2
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-blue-200 rounded-xl -z-10 blur-lg opacity-30"></div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-gray-200">
                <GitBranch className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Select Repositories</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Choose which repos to monitor and configure review settings and webhooks.
                </p>
              </div>
            </div>

            <div className="text-center group">
              <div className="relative mb-6">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 w-14 h-14 mx-auto rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg group-hover:scale-110 transition-transform">
                  3
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-blue-200 rounded-xl -z-10 blur-lg opacity-30"></div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-gray-200">
                <Sparkles className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Start Reviewing</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  AI automatically reviews every PR with detailed feedback and security checks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold mb-3">
              Pricing
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Simple, Transparent Pricing
            </h2>
            <p className="text-base text-gray-600 mb-6">
              Choose the plan that fits your team&apos;s needs
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center gap-4 bg-gray-100 p-2 rounded-xl">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  billingCycle === "monthly"
                    ? "bg-white text-gray-900 shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("annual")}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  billingCycle === "annual"
                    ? "bg-white text-gray-900 shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Annual
                <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                onClick={() => setSelectedPlan(plan.name)}
                className={`group relative bg-white rounded-xl border-2 p-6 cursor-pointer ${
                  selectedPlan === plan.name
                    ? "border-blue-500 shadow-xl ring-2 ring-blue-200"
                    : "border-gray-200"
                } transition-all duration-300`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                  <p className="text-gray-600 text-xs mb-3">{plan.description}</p>
                  <div className="flex items-end justify-center gap-1">
                    {typeof plan.price === "number" ? (
                      <>
                        <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                        <span className="text-gray-600 text-sm mb-1">/{billingCycle === "monthly" ? "mo" : "yr"}</span>
                      </>
                    ) : (
                      <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    )}
                  </div>
                  {billingCycle === "annual" && typeof plan.price === "number" && plan.price > 0 && (
                    <p className="text-xs text-green-600 mt-1">
                      Billed ${plan.price * 12} annually
                    </p>
                  )}
                </div>

                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2">
                      {feature.included ? (
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={`text-xs ${feature.included ? "text-gray-700" : "text-gray-400"}`}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link href={plan.name === "Enterprise" ? "#" : "/signup"}>
                  <Button
                    className={`w-full py-2.5 rounded-lg font-semibold text-sm ${
                      selectedPlan === plan.name
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          {/* Trust Badges */}
          <div className="mt-12 flex items-center justify-center gap-6 flex-wrap">
            <div className="flex items-center gap-2 text-gray-600">
              <Lock className="w-4 h-4" />
              <span className="text-xs font-medium">SOC 2 Certified</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Shield className="w-4 h-4" />
              <span className="text-xs font-medium">Enterprise Security</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Award className="w-4 h-4" />
              <span className="text-xs font-medium">99.9% Uptime SLA</span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold mb-3">
              Testimonials
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Loved by Developers Worldwide
            </h2>
            <p className="text-base text-gray-600">
              See what our customers have to say about PR Reviewer
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-4 italic">
                  &quot;{testimonial.content}&quot;
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="text-sm font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-xs text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold mb-3">
              FAQ
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-base text-gray-600">
              Everything you need to know about PR Reviewer
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white !border !border-gray-200 rounded-lg px-4 hover:!border-blue-300 transition-colors cursor-pointer"
              >
                <AccordionTrigger className="text-base font-bold text-gray-900 hover:no-underline cursor-pointer">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-gray-600 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10"></div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Code Reviews?
          </h2>
          <p className="text-base text-blue-100 mb-8">
            Join thousands of developers shipping better code with AI-powered reviews.
            Start your free trial today, no credit card required.
          </p>
          {isAuthenticated ? (
            <Link href="/dashboard">
              <Button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-3 rounded-lg shadow-xl hover:shadow-2xl transition-all">
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <Link href="/signup">
              <Button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-3 rounded-lg shadow-xl hover:shadow-2xl transition-all">
                <Github className="mr-2 h-4 w-4" />
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
          {!isAuthenticated && (
            <p className="text-blue-100 mt-5 text-sm">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-gray-900 text-gray-300 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-1.5 rounded-lg">
                  <Code className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-white">PR Reviewer</span>
              </div>
              <p className="text-gray-400 text-xs mb-4 max-w-sm">
                AI-powered code review platform for modern development teams.
                Ship better code, faster.
              </p>
              <div className="flex gap-3">
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Github className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-white mb-3 text-sm">Product</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><Link href="#" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">API</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Changelog</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-3 text-sm">Company</h4>
              <ul className="space-y-2 text-xs">
                <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Press Kit</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-3 text-sm">Legal</h4>
              <ul className="space-y-2 text-xs">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Security</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Compliance</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 text-center">
            <p className="text-gray-400 text-xs">
              &copy; 2026 PR Reviewer. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
