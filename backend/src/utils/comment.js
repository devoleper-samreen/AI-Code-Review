export function formatFeedbackForComment(feedback) {
  let comment = `## 🤖 PR Reviewer Feedback\n\n`;

  // 🔴 Bugs
  if (feedback.bugs?.length) {
    comment += `### 🔴 Bugs\n`;
    feedback.bugs.forEach((bug) => {
      comment += `- **${bug.title}** _(Severity: ${bug.severity})_\n  ${bug.details}\n`;
    });
    comment += `\n`;
  } else {
    comment += `### 🔴 Bugs\n- ✅ No bugs found\n\n`;
  }

  // ⚡ Optimizations
  if (feedback.optimizations?.length) {
    comment += `### ⚡ Optimizations\n`;
    feedback.optimizations.forEach((opt) => {
      comment += `- **${opt.title}** → ${opt.details}\n`;
    });
    comment += `\n`;
  } else {
    comment += `### ⚡ Optimizations\n- ✅ No optimizations suggested\n\n`;
  }

  // 🔒 Security
  if (feedback.security_issues?.length) {
    comment += `### 🔒 Security Issues\n`;
    feedback.security_issues.forEach((sec) => {
      comment += `- **${sec.title}** _(Severity: ${sec.severity})_\n  ${sec.details}\n`;
    });
    comment += `\n`;
  } else {
    comment += `### 🔒 Security Issues\n- ✅ No security issues\n\n`;
  }

  // 💡 General Feedback
  if (feedback.general_feedback?.length) {
    comment += `### 💡 General Feedback\n- ${feedback.general_feedback.join(
      "\n- "
    )}\n\n`;
  }

  return comment;
}
