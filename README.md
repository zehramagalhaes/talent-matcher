# 🌟 TalentMatcher

> **Where skills meet opportunities.**  
> AI-powered resume and job description compatibility analyzer.

---

## 📖 Overview

**TalentMatcher** is a web application built with **Next.js** and **Material UI** that helps candidates and recruiters evaluate the compatibility between resumes and job postings.  

Upload your **resume** and a **job description** (`.md` or `.html`), and TalentMatcher will:

- 📂 Extract relevant experiences and job requirements  
- 🧑‍💼 Generate a recruiter persona (`tech_recruiter.md`)  
- 📝 Create a structured job file (`job123.md`)  
- 🤖 Use the **Gemini API (agent anti gravity)** to analyze compatibility  
- 📊 Provide a detailed report with strengths, gaps, and improvement suggestions  

Designed with **SOLID principles** and **Clean Code**, TalentMatcher offers a scalable and maintainable architecture for future growth.

---

## ✨ Features

- **Resume Upload** → Supports `.pdf` and `.docx`  
- **Job Description Upload** → Supports `.md` and `.html`  
- **AI-Powered Analysis** → Gemini API integration for compatibility reports  
- **Modern UI** → Built with the latest **Material UI** components  
- **Clean Architecture** → Following SOLID and Clean Code guidelines  
- **Deployable on GitHub Pages** → Easy hosting and sharing  

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)  
- **UI Library**: [Material UI](https://mui.com/)  
- **Language**: TypeScript  
- **AI Integration**: Gemini API (anti-gravity agent)  
- **Form Validation**: react-hook-form + Zod  
- **Code Quality**: ESLint, Prettier, Husky  
- **Deployment**: Vercel + GitHub Actions  

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/zehramagalhaes/talentmatcher.git
cd talentmatcher
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure API Keys
Follow [**SETUP_API_KEYS.md**](./SETUP_API_KEYS.md) for detailed setup instructions.

Quick start:
```bash
cp .env.example .env.local
# Edit .env.local and add your Gemini API key
```

For complete API key reference, see [**ENV_VARS.md**](./ENV_VARS.md).

### 4. Run the app
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📚 Documentation

### Setup & Configuration
- [**SETUP_API_KEYS.md**](./SETUP_API_KEYS.md) - Step-by-step API key configuration guide
- [**ENV_VARS.md**](./ENV_VARS.md) - Complete environment variables reference
- [**.env.example**](./.env.example) - Environment variables template

### Development
- [**BRANCH_PROTECTION_RULES.md**](./.github/BRANCH_PROTECTION_RULES.md) - Git workflow and merge strategy
- [**CHANGELOG.md**](./CHANGELOG.md) - Project changelog and version history
- [**Pull Request Template**](./.github/pull_request_template.md) - PR guidelines with changelog section

### Issue Templates
- [**API Keys Setup Issue Template**](./.github/ISSUE_TEMPLATE/api-keys-setup.md) - GitHub issue for tracking secret configuration

---

## 💻 Development Workflow

### Local Development
1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes and run linting: `npm run lint:fix`
3. Commit your changes: `git commit -m "feat: description"`
4. Push to remote: `git push origin feature/your-feature`
5. Open a pull request on GitHub

### Code Quality
- **Linting**: `npm run lint` (or `npm run lint:fix` to auto-fix)
- **Formatting**: `npm run format` (or use `npm run lint:fix`)
- **Build**: `npm run build`

### Protected Branches
- Commits to `main`, `develop`, and `production` are blocked locally
- All PRs require status checks (ESLint, Prettier, Build) to pass
- PRs use **Squash and Merge** strategy by default
- Branch must be up to date before merging

See [**BRANCH_PROTECTION_RULES.md**](./.github/BRANCH_PROTECTION_RULES.md) for full details.

---

## 🔐 Security

### API Keys Management
- Never commit `.env.local` or any `.env.*` files
- Use GitHub Secrets for CI/CD pipelines
- Rotate API keys quarterly
- Different keys for dev, staging, and production

See [**ENV_VARS.md**](./ENV_VARS.md) for security best practices.

---

## 📦 Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm start                # Start production server

# Code Quality
npm run lint             # Run ESLint checks
npm run lint:fix         # Auto-fix ESLint and Prettier issues
npm run format           # Format code with Prettier
npm run format:check     # Check if code is formatted correctly

# Git Hooks (Husky)
npm run prepare          # Install Husky git hooks
```

## 🤝 Contributing

Before you start, please:

1. Read [**BRANCH_PROTECTION_RULES.md**](./.github/BRANCH_PROTECTION_RULES.md) for workflow guidelines
2. Follow the [**Pull Request Template**](./.github/pull_request_template.md)
3. Ensure all checks pass: `npm run lint:fix && npm run build`
4. Update [**CHANGELOG.md**](./CHANGELOG.md) with your changes

### Report Issues

Use the appropriate issue template:
- [🔐 API Keys Setup](./GitHub/ISSUE_TEMPLATE/api-keys-setup.md) for configuration issues

---

## 📜 License
This project is licensed under the MIT License.
Feel free to use, modify, and distribute.

## 🌟 Acknowledgments
- Built with ❤️ using Next.js and Material UI
- Powered by Gemini API  
- Inspired by the mission to connect talent with opportunity
