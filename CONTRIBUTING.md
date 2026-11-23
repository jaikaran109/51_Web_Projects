# Contributing to 51 Web Projects

Thanks for taking the time to contribute! 🚀  
This guide explains the exact contribution format. Follow it for every **Issue** and **Pull Request (PR)**.

---

## 📌 Before You Start

- ⭐ Star the repository
- 📖 Read the [README.md](README.md)
- 🔍 Check existing [Issues](https://github.com/jaikaran109/51_Web_Projects/issues) and [PRs](https://github.com/jaikaran109/51_Web_Projects/pulls)
- 📁 Follow the repository structure and coding standards

---

## 🍴 Fork & Clone

```bash
# Fork the repo on GitHub, then:
git clone https://github.com/<your-github-username>/51_Web_Projects.git
cd 51_Web_Projects
```

---

## 🌿 Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

---

## ✨ Make Changes

You can contribute by:

- Fixing bugs
- Improving UI/UX
- Adding responsive designs
- Improving accessibility
- Optimizing code
- Updating documentation
- Adding new features

> 💡 Keep PRs focused on a **single issue/feature**.

---

## 📝 Commit Changes

Use clear, conventional commit messages:

```bash
git commit -m "Fix: navbar responsiveness issue"
git commit -m "Add: dark mode support"
git commit -m "Docs: update contributing guide"
```

---

## 🚀 Push & Open a PR

```bash
git push origin feature/your-feature-name
```

Then open a Pull Request against `main`.

Please read this file before opening a PR.

---

## 📋 Pull Request Format

Every PR should include:

### 1. PR Title
Use a clear prefix:

- `Fix:` for bug fixes
- `Add:` for new features
- `Refactor:` for code improvements
- `Docs:` for documentation updates
- `UI:` for UI/UX changes

Example:
```text
Fix: navbar responsiveness issue on mobile
```

### 2. PR Description
- **What**: Brief summary of changes
- **Why**: The issue or motivation
- **How**: How you fixed/implemented it
- **Screenshots**: Attach before/after screenshots (if UI changes)
- **Checklist**:
  - [ ] My code follows the project guidelines
  - [ ] I have tested my changes locally
  - [ ] I have updated documentation if needed
  - [ ] My changes do not break existing functionality

### 3. Attach a Screenshot
> 📌 **Screenshot required for UI/UX changes.** Attach a clear before/after screenshot in the PR description.

---

## 🐛 Reporting Issues

When creating an issue, include:

- Clear title
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)

Use issue templates: **Bug Report** or **Feature Request**.

---

## 🏷️ Labels

Issues may be marked with labels such as:

- `good first issue`
- `beginner`
- `bug`
- `documentation`
- `enhancement`
- `level 1`
- `level 2`
- `level 3`

---


## 🎨 Code Formatting with Prettier

We use [Prettier](https://prettier.io/) to maintain consistent code formatting across projects.

The repository includes a `.prettierrc.json` configuration with the following settings:

- Indentation: 2 spaces
- Tabs: Disabled
- Line endings: LF

### Check Formatting

From the repository root, run:

```bash
npx prettier --check path/to/your/file
```

### Format Files

To automatically format your changed files, run:

```bash
npx prettier --write path/to/your/file
```

Replace `path/to/your/file` with the path to the file you want to check or format.

Please format only the files you have changed before submitting a pull request.


## 🤝 Nexus Spring of Code (NSoC)

By participating in Nexus Spring of Code, you agree to follow our [Code of Conduct](CODE_OF_CONDUCT.md) and use the mandatory NSoC labels as described in this guide.

### 💯 Points System

| **Label** | **Points** | **Used for** |
| --- | --- | --- |
| nsoc26 | Mandatory tag | Every NSoC issue and PR |
| level1 | 3 points | Documentation, typo fixes and other small work |
| level2 | 5 points | UI and frontend work: layouts, components, styling and page-level changes |
| level3 | 10 points | Core logic, database changes and complex features |

**The nsoc26 tag is mandatory. Points are assigned strictly according to the Level label on the PR.**

Optional helpful labels: *good first issue, help wanted, bug, feature, docs*.

### 🏷️ Labels

Issues may be marked with labels such as:

- `nsoc26` - Mandatory NSoC tag
- `level1` - 3 points: Documentation, typo fixes and other small work
- `level2` - 5 points: UI and frontend work
- `level3` - 10 points: Core logic, database changes
- `good first issue` - Beginner-friendly issues
- `beginner` - Beginner-friendly tags
- `hacktoberfest` - Hacktoberfest participation

### 📋 Labelling Rules

- Every issue must have the nsoc26 label and exactly one Level label
- Admins decide the Level. Be honest and consistent with the definitions above
- Not every issue or PR is Level 3. Very small changes (for example 10-20 line edits) must not be labelled Level 2 or Level 3
- Add labels on time. Do not leave merged PRs unlabelled
- If nsoc26 is missing from a PR, ask the contributor to update it

### 📝 Before You Start

- ⭐ Star the repository
- 📖 Read the [README.md](README.md)
- 🔍 Check existing [Issues](https://github.com/jaikaran109/51_Web_Projects/issues) and [PRs](https://github.com/jaikaran109/51_Web_Projects/pulls)
- 📁 Follow the repository structure and coding standards

---

## ⭐ Thank You

Thank you for contributing to 51 Web Projects!  
Happy Coding! 🚀

