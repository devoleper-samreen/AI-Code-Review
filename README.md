# AI Code Review

An intelligent code review platform that uses **Google Gemini AI** to automatically analyze pull requests and provide smart feedback on bugs, security issues, and code quality improvements.

## 🎯 Problem Statement

Manual code reviews are time-consuming and can miss critical issues. Developers need:
- Quick feedback on pull requests
- Automated detection of bugs and security vulnerabilities
- Context-aware suggestions for code improvements
- Consistent code quality checks across projects

## 💡 Solution

AI Code Review automates the code review process by:
- Analyzing pull requests using AI and vector embeddings for context
- Detecting bugs, security issues, and performance problems
- Providing actionable feedback directly on GitHub PRs
- Learning from your codebase to give relevant suggestions

## ✨ Features

- **AI-Powered Reviews**: Uses Google Gemini AI for intelligent code analysis
- **Context-Aware**: Vector embeddings understand your codebase context
- **GitHub Integration**: One-click login and automatic PR reviews via webhooks
- **Real-time Processing**: Background workers process reviews asynchronously
- **Analytics Dashboard**: Track review history and code quality metrics
- **Auto Comments**: Posts review feedback directly on GitHub PRs

## 🛠️ Tech Stack

### Frontend
- Next.js 15
- React 19
- Tailwind CSS
- Radix UI

### Backend
- Node.js + Express
- PostgreSQL (Neon)
- Prisma ORM
- BullMQ + Redis (Upstash)
- Qdrant Vector Database
- Google Gemini AI
- Passport.js (GitHub OAuth)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Redis instance
- Google Gemini API key
- GitHub OAuth App

### Installation

**Clone the repository**
```bash
git clone https://github.com/yourusername/AI-Code-Review.git
```


## 📖 How It Works

1. **Connect Repository**: Login with GitHub and connect your repository
2. **Create PR**: Open a pull request in your connected repository
3. **AI Analysis**: AI analyzes the PR using:
   - Code diff analysis
   - Vector search for similar code patterns
   - Context from your entire codebase
4. **Get Feedback**: Automated review comment posted on GitHub PR with:
   - Bug detections
   - Security vulnerabilities
   - Performance optimizations
   - Best practice suggestions


## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---