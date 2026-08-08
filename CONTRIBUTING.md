# 🤝 Contributing to Web Based Mini Projects

First off, thank you for considering contributing to this project! 🎉 Your help makes this collection better for everyone learning web development.

This document provides guidelines and instructions for contributing. Following these helps streamline the process for everyone involved.

---

## 📋 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [Before You Start](#-before-you-start)
- [How Can I Contribute?](#-how-can-i-contribute)
- [Project Structure](#-project-structure)
- [Development Guidelines](#-development-guidelines)
- [Adding a New Project](#-adding-a-new-project)
- [Commit Convention](#-commit-convention)
- [Pull Request Process](#-pull-request-process)
- [Code Review Checklist](#-code-review-checklist)
- [Getting Help](#-getting-help)
- [Recognition](#-recognition)

---

## 📜 Code of Conduct

This project and everyone participating in it is governed by our standards of respect and collaboration. By participating, you are expected to uphold these standards:

- **Be respectful** - Different viewpoints and experiences are valuable
- **Be constructive** - Offer helpful feedback, not criticism
- **Be collaborative** - Help others learn and grow
- **Be inclusive** - Welcome contributors of all skill levels
- **Be patient** - Not everyone has the same experience level

---

## 🚦 Before You Start

### Check Existing Work

1. **Browse the [Projects Table](./README.md#-projects)** to see what's already built
2. **Search [open issues](https://github.com/arash-jj/web-based-mini-projects/issues)** for ongoing discussions
3. **Check [open PRs](https://github.com/arash-jj/web-based-mini-projects/pulls)** to avoid duplicate work

### Open an Issue First

Before submitting a pull request for a new project, please open an issue to discuss your idea. This prevents wasted effort if the project doesn't align with our goals.

**Issue Template:**
Project Name: Your Project Name
Category: Game | UI/UX | Utility
Difficulty: Beginner | Intermediate | Advanced
Description: Brief description of what the project does
Learning Outcomes: What skills will this teach?
Tech Stack: HTML/CSS/JS | TypeScript | React | etc.

---

## 🎯 How Can I Contribute?

### Types of Contributions

| Type | Description | Impact |
|------|-------------|--------|
| 🆕 **New Project** | Add a new mini project | ⭐ High |
| 🐛 **Bug Fixes** | Fix bugs in existing projects | ⭐ High |
| ✨ **Features** | Add features to existing projects | ⭐ Medium |
| 📝 **Documentation** | Improve READMEs, comments, guides | ⭐ Medium |
| 🎨 **UI/UX Improvements** | Better styling, responsiveness | ⭐ Medium |
| ⚡ **Performance** | Optimize code, reduce load times | ⭐ Low-Medium |
| 🔧 **Refactoring** | Clean up code, improve structure | ⭐ Low |
| 🧪 **Testing** | Add tests and fix edge cases | ⭐ Low |

### Priority Areas

We especially welcome contributions in these areas:

- **TypeScript conversions** of existing JavaScript projects
- **React/Next.js versions** of vanilla JS projects
- **Accessibility improvements** across all projects
- **Mobile responsiveness** enhancements
- **New beginner-friendly projects** to help newcomers

---

## 📁 Project Structure

Understanding the repository structure helps you contribute effectively:

```markdonw
web-based-mini-projects/
├── README.md # Main documentation
├── CONTRIBUTING.md # This file
├── LICENSE # MIT License
│
├── projects/ # All projects live here
│ ├── Flappy-Bird/
│ │ ├── index.html # Entry point
│ │ ├── style.css # Styles (or css/)
│ │ ├── script.js # Logic (or js/)
│ │ └── README.md # Project documentation
│ │
│ ├── Calculator/
│ │ ├── index.html
│ │ ├── styles/
│ │ ├── scripts/
│ │ └── README.md
│ │
│ └── your-new-project/ # Your project here
│ ├── index.html
│ ├── style.css
│ ├── script.js
│ └── README.md
│
├── assets/ # Shared assets (if any)
│ └── images/
```
---

## 📏 Development Guidelines

### Code Quality Standards

#### HTML Guidelines
```html
<!-- ✅ DO - Use semantic HTML -->
<header>
  <nav>
    <ul>
      <li><a href="#home">Home</a></li>
    </ul>
  </nav>
</header>

<!-- ❌ DON'T - Div soup -->
<div class="header">
  <div class="nav">
    <div class="link">Home</div>
  </div>
</div>
```

#### CSS Guidelines
```css
/* ✅ DO - Use meaningful class names */
.game-container { }
.score-display { }
.restart-button { }

/* ❌ DON'T - Generic, meaningless names */
.box { }
.thing { }
.btn1 { }
```
#### JavaScript Guidelines
```js
// ✅ DO - Clear naming, short functions
function calculateFinalScore(baseScore, multiplier) {
  const bonus = calculateBonus(baseScore);
  return (baseScore + bonus) * multiplier;
}

// ✅ DO - Comment complex logic
// Calculate collision using AABB (Axis-Aligned Bounding Box)
function checkCollision(rect1, rect2) {
  return rect1.x < rect2.x + rect2.width &&
         rect1.x + rect1.width > rect2.x &&
         rect1.y < rect2.y + rect2.height &&
         rect1.y + rect1.height > rect2.y;
}

// ❌ DON'T - Vague names, long functions, no comments
function calc(b, m) {
  let x = b * 0.1;
  if(b > 100) x = b * 0.15;
  return (b + x) * m;
}
```

## 🛒 Project Requirements
Every project must:

| # | Requirement | Description |
|---|----------------|--------------------------|
| 1 |✅ index.html | Entry point that works when opened directly
| 2 |✅ if npm packages |	keep it simple for HTML/CSS/JS projects
| 3 |✅ Responsive design | Works on mobile, tablet, and desktop
| 4 |✅ Cross-browser | Tested on Chrome, Firefox, and Safari
| 5 |✅ README.md | Documentation following project template
| 6 |✅ Self-contained | All assets within the project folder
| 7 |✅ Clean console | No console errors in normal operation

### Optional But Encouraged
- 🌙 Dark mode support
- ⌨️ Keyboard accessibility
- 🎨 CSS custom properties for theming
- 📱 Touch-friendly interactions
- 💾 Local storage for saving progress

---

## ➕ Adding a New Project
Step-by-Step Process

1. Fork and Clone
```bash
# Fork the repository on GitHub, then:
git clone https://github.com/YOUR-USERNAME/web-based-mini-projects.git
cd web-based-mini-projects
```
2. Create a Branch
```bash
git checkout -b project/your-project-name
# or
git checkout -b fix/bug-description
# or
git checkout -b feature/feature-description
```
3. Create Your Project
```bash
cd projects
mkdir your-project-name
cd your-project-name
```
4. Build Your Project Files
Minimum required files:
```markdown
your-project-name/
├── index.html
├── style.css
├── script.js
└── README.md
```

5. Write Your Project README
Use this template:
```markdown
# Project Name

> A brief one-line description

## 🎮 [or 🎨 or 🔧] About

Detailed description of the project, what it does, and why it's useful for learning.

## ✨ Features

- Feature 1
- Feature 2
- Feature 3

## 🎯 What You'll Learn

- Skill/Concept 1
- Skill/Concept 2
- Skill/Concept 3

## 🎮 How to Play / 💻 How to Use

1. Step 1
2. Step 2
3. Step 3

## 🎨 Customization

Tips for modifying colors, difficulty, or features.

## 📁 Project Structure


project-name/
├── index.html    # Main HTML structure
├── style.css     # Styling and animations
├── script.js     # Game logic / functionality
└── README.md     # This file


## 🚀 Run Locally

Open \`index.html\` in your browser. No installation required!

## 📝 License

MIT License
```
6. Update Main README.md
Add your project to the appropriate table in the Projects section:
```markdown
| # | **Your Project Name** | Category | Difficulty | ✅ | [→](projects/your-project-name) |
```
Add to the Learning Path section:
```markdown
### 🟢/🟡/🔴 Level
...
X. **Your Project Name** - What they'll learn
```
7. Commit Your Changes
```bash
git add .
git commit -m "feat: add [Project Name]"
```
8. Push and Create PR 
```bash
git push origin project/your-project-name
```

## 📝 Commit Convention

| # | Prefix | Usage |
|---|----------------|--------------------------|
| 1 |✅ feat: | New project or feature
| 2 |✅ fix: | Bug fixes
| 3 |✅ sytle: | Code style, formatting changes
| 4 |✅ refactor: |	Code restructuring
| 5 |✅ pref: | Performance improvements
| 6 |✅ chore: |	Maintenance tasks
| 7 |✅ improve: | Enhancements to existing projects

### Examples: 
```bash
git commit -m "feat: add Weather App project"
git commit -m "fix: correct score reset in Snake game"
git commit -m "docs: update contributing guidelines"
git commit -m "improve: add dark mode to Calculator"
```

## 🔄 Pull Request Process

### PR Title Fromat
```markdown
feat: Add [Project Name]
fix: Fix [Brief Description]
improve: Add [Feature] to [Project Name]
```

### PR Description Template
```text
## 📝 Description
Brief description of your changes

## 🎯 Type of Change
- [ ] New project
- [ ] Bug fix
- [ ] Feature addition
- [ ] Documentation
- [ ] Other: ____

## 🎮 Project Details (for new projects)
- **Category:** Game / UI-UX / Utility
- **Difficulty:** Beginner / Intermediate / Advanced
- **Tech Stack:** HTML/CSS/JS / TypeScript / React / etc.

## ✅ Checklist
- [ ] Tested in Chrome, Firefox, and Safari
- [ ] Responsive on mobile and desktop
- [ ] No console errors
- [ ] README.md included for new projects
- [ ] Main README.md updated with project entry
- [ ] Code follows style guidelines
- [ ] Self-contained project folder

## 📸 Screenshots
(Add before/after screenshots if applicable)

## 🔗 Related Issues
Closes #issue-number
```
## ✅ Code Review Checklist
Reviewers will check for:
| # | Check | Details |
|---|----------------|--------------------------------------------------|
| 1 | 📁 **Structure** | Project follows folder conventions |
| 2 | 📖 **README** | Complete and follows template |
| 3 | 🎨 **Styling** | Responsive, clean CSS, no inline styles |
| 4 | 🧠 **Logic** | Clean, commented, error-free JavaScript |
| 5 | 🏷️ **Semantics** | Proper HTML5 semantic elements |
| 6 | ♿ **Accessibility** | Basic a11y (alt tags, aria labels, keyboard nav) |
| 7 | 📵 **Dependencies** | No external dependencies (for vanilla JS projects) |
| 8 | 🚫 **Console** | No errors or leftover console.logs |
| 9 | 📊 **Main README** | Updated with project entry |

## 🆘 Getting Help

Need help with your contribution?

- Ask questions in your issue or PR comments
- Check existing projects for reference
- Read the Learning Path for project complexity guidance

## 🌟 Recognition
All contributors will be recognized!

- Your name appears in the project's commit history
- Your project stays in the collection for others to learn from
- You're helping thousands of developers improve their skills

## Review Process
1. Automated Checks - Ensure no obvious issues
2. Maintainer Review - A maintainer will review your PR
3. Feedback - Address any requested changes
4. Approval - PR gets approved and merged
5. Response time is typically within 3-5 days. Be patient and open to feedback!

<div align="center">
Thank you for contributing! 🎉

Every project you add helps someone learn web development

**[⬆ Back to top](#-Contributing-to-Web-Based-Mini-Projects)**

</div> 
