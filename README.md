# 🌟 TalentMatcher

> **Where skills meet opportunities.**  
> AI-powered resume and job description compatibility analyzer.

---

## 📖 Overview

**TalentMatcher** is a Next.js web application that compares a candidate's resume with a job description. It extracts text from a PDF, DOCX, or TXT resume, sends the text and entered job description to a server-side Gemini API route, and presents a report with a matching plan, strengths, gaps, and compact and detailed tailored resume versions.

The application includes a report/edit flow and client-side PDF and DOCX downloads. Resume and job content are held in the current browser tab; see [Security and privacy](./SECURITY_AND_PRIVACY.md) for retention and external processing details.

---

## ✨ Features

- **Resume Upload** → Supports `.pdf`, `.docx`, and `.txt` (5 MiB maximum)
- **Job Description** → Entered as text in the form
- **AI-Powered Analysis** → Gemini-backed matching plan, strengths, gaps, and tailored resume versions
- **Resume Export** → Client-side PDF and DOCX downloads
- **UI** → Next.js, TypeScript, Material UI, and English/Portuguese translations

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **UI Library**: [Material UI](https://mui.com/)
- **Language**: TypeScript
- **AI Integration**: Google Gemini API through server-side Next.js API routes
- **Form Validation**: react-hook-form + Zod
- **Code Quality**: ESLint, Prettier, Husky
- **Deployment**: Vercel Next.js deployment; GitHub Actions validates changes but does not deploy

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

The maintained project knowledge base is indexed in [docs/README.md](./docs/README.md). Start there for architecture, features, agent directives, decisions, current status, and verified improvements.

### Setup & Configuration

- [**SETUP_API_KEYS.md**](./SETUP_API_KEYS.md) - Step-by-step API key configuration guide
- [**ENV_VARS.md**](./ENV_VARS.md) - Complete environment variables reference
- [**DEPLOYMENT.md**](./DEPLOYMENT.md) - Vercel project setup, Git-based deployment, CLI option, and checks
- [**.env.example**](./.env.example) - Environment variables template

### Development

- [**CHANGELOG.md**](./CHANGELOG.md) - Retained project history; older entries may not describe current source
- [**LINTING_SETUP.md**](./LINTING_SETUP.md) - Existing lint/format notes; confirm current scripts in `package.json`

---

## 💻 Development Workflow

### Local Development

1. Read [AGENTS.md](./AGENTS.md) and the relevant docs under [docs/](./docs/README.md).
2. Create a feature branch and make a scoped change.
3. Run applicable checks (`npm test`, `npm run type-check`, `npm run lint`, and/or `npm run build`).
4. Update the relevant docs and changelog when appropriate, then open a pull request.

### Code Quality

- **Linting**: `npm run lint` (or `npm run lint:fix` to auto-fix)
- **Tests**: `npm test`
- **Type checking**: `npm run type-check`
- **Formatting**: `npm run format` (or use `npm run lint:fix`)
- **Build**: `npm run build`

The current CI checks are defined in [.github/workflows/deploy.yml](./.github/workflows/deploy.yml). Repository branch protection settings are external to this source tree and are not asserted here.

---

## 🔐 Security

### API Keys Management

- Never commit `.env.local` or any `.env.*` files
- Use Vercel project environment settings for Gemini API keys
- The current GitHub Actions checks do not require Gemini or Vercel secrets
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
npm run docs:check       # Validate the project knowledge base

# Tests and types
npm test                 # Run Node test suite
npm run type-check       # Run TypeScript checking
```

## 🤝 Contributing

Before you start, please:

1. Read [AGENTS.md](./AGENTS.md) and [docs/ENGINEERING_DIRECTIVES.md](./docs/ENGINEERING_DIRECTIVES.md).
2. Run relevant tests and checks from `package.json` and CI.
3. Update the docs knowledge base for meaningful behavior, decisions, or status changes.

## 📜 License

This project is licensed under the MIT License.
Feel free to use, modify, and distribute.

## 🌟 Acknowledgments

- Built with ❤️ using Next.js and Material UI
- Powered by Gemini API
- Inspired by the mission to connect talent with opportunity
