# Setup Guide

This guide covers everything you need to set up TalentMatcher for local development and deployment.

## Prerequisites

- Node.js (version 18 or higher)
- npm or yarn
- Git

## 1. Getting Started

### Clone the repository

```bash
git clone https://github.com/zehramagalhaes/talentmatcher.git
cd talentmatcher
```

### Install dependencies

```bash
npm install
```

### Configure local environment

Copy the example env file and add your secrets:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your keys.

### Run the application

#### Run frontend and backend together

```bash
npm run dev
```

#### Run frontend and backend together with local API docs

```bash
npm run dev:docs
```

#### Run backend only

```bash
npm run dev:api
```

#### Run frontend only

```bash
npm run dev:app
```

## 2. API Keys Setup

TalentMatcher uses the Gemini API for AI-powered analysis. If you run locally, you need a Gemini API key from Google Gemini AI Studio.

### Step 1: Get a Gemini API key

1. Go to [https://ai.google.dev](https://ai.google.dev)
2. Click **"Get API Key"** in the top-right corner
3. Choose **"Create API key in new Google Cloud project"** or select an existing project
4. Accept terms and complete the setup

### Step 2: Copy your API key

1. Your API key will appear on screen
2. Click **Copy**
3. Save it temporarily for the next step

### Step 3: Test the key (optional)

```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent" \
  -H 'Content-Type: application/json' \
  -H 'X-goog-api-key: YOUR_API_KEY_HERE' \
  -X POST \
  -d '{
    "contents": [{
      "parts": [{
        "text": "Say hello!"
      }]
    }]
  }'
```

If the key is valid, you should receive a JSON response with generated text.

### Step 4: Set up local environment

From the project root:

```bash
cp .env.example .env.local
```

Open `.env.local` and add your key:

```env
GEMINI_API_KEY=your_actual_gemini_api_key
```

Optionally add a fallback:

```env
GEMINI_API_KEY_ALT=your_second_gemini_api_key
```

### Step 5: Run locally

```bash
npm run dev
```

If you want local API docs as well:

```bash
npm run dev:docs
```

> The backend must be running for the docs and API endpoints to work.

### Step 6: Keep secrets safe

- Do not commit `.env.local`
- Confirm `.env.local` is ignored by git
- Use GitHub Secrets for deployment

### Deployment secrets (optional)

Add these secrets in GitHub if you deploy with GitHub Actions/Vercel:

- `GEMINI_API_KEY`
- `GEMINI_API_KEY_ALT` (optional)
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## 3. Environment Variables

This section explains all environment variables used in the talent-matcher application and how to configure them properly.

### Quick Start

1. **For Local Development**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API keys
   ```

2. **For GitHub Actions/CI-CD**
   - Set secrets in GitHub repository settings (Settings → Secrets and variables → Actions)
   - These are automatically injected into the build process

3. **For Vercel Deployment**
   - Secrets are synced from GitHub Actions
   - Also configurable directly in Vercel project settings

### Environment Variables Reference

#### Frontend - Public Variables
These variables are accessible in the browser and frontend code.

- **Usage**: Frontend fetch base URL. Defaults to `/api` in production (proxied).
- **Example**: `http://localhost:3001/api`
- **Default**: `/api` (production) or `http://localhost:3001/api` (development)

##### API_BASE_URL
- **Type**: String (URL)
- **Required**: No
- **Visibility**: Backend/Server-only
- **Usage**: Destination for Next.js API rewrites (proxy).
- **Example**: `https://your-backend.herokuapp.com`
- **Default**: `http://localhost:3001`

##### NEXT_PUBLIC_ENVIRONMENT
- **Type**: String
- **Required**: No (defaults to 'development')
- **Visibility**: Public
- **Values**: `development`, `staging`, `production`
- **Usage**: Feature flags and environment-specific behavior
- **Example**: `NEXT_PUBLIC_ENVIRONMENT=production`

#### Backend - Secret Variables
These variables are only available on the server (backend) and should never leak to the frontend.

##### GEMINI_API_KEY
- **Type**: String (API Key)
- **Required**: Yes
- **Visibility**: Secret (keep private)
- **Usage**: Primary Gemini API key for backend analysis and model lookup
- **Where to Set**:
  - Local: `.env.local`
  - CI/CD: GitHub Secrets
  - Production: Vercel Secrets
- **Example**: `AIzaSy...`

##### GEMINI_API_KEY_ALT
- **Type**: String (API Key)
- **Required**: No (optional fallback)
- **Visibility**: Secret (keep private)
- **Usage**: Secondary Gemini API key if the primary key is unavailable
- **Where to Set**:
  - Local: `.env.local`
  - CI/CD: GitHub Secrets
  - Production: Vercel Secrets
- **Example**: `AIzaSy...` (another valid Gemini API key)

#### Deployment - CI/CD Only
These variables are used only by GitHub Actions and Vercel deployment pipelines. They should NEVER be set locally or committed.

##### VERCEL_TOKEN
- **Type**: String (Authentication Token)
- **Required**: Yes (for Vercel deployment via GitHub Actions)
- **Visibility**: Secret (NEVER expose)
- **Usage**: Authenticate GitHub Actions with Vercel API
- **Where to Set**: GitHub Secrets only
- **Scope**: Full access to organization/account
- **How to Get**:
  1. Go to [https://vercel.com/account/tokens](https://vercel.com/account/tokens)
  2. Click "Create" → Enter token name: "github-actions"
  3. Set expiration: Never or yearly
  4. Click "Create Token"
  5. Copy immediately (won't be shown again)
- **Used In**: `.github/workflows/deploy.yml`

##### VERCEL_ORG_ID
- **Type**: String (Organization/Team ID)
- **Required**: Yes (for Vercel deployment)
- **Visibility**: Can be public
- **Usage**: Identify which Vercel organization to deploy to
- **Where to Set**: GitHub Secrets (or Vercel project settings)
- **How to Get**:
  1. Option A - From Vercel Dashboard URL: `vercel.com/[ORG_ID]`
  2. Option B - In project settings: "Team" section shows ID
  3. Option C - Run `vercel teams list`
- **Used In**: `.github/workflows/deploy.yml`

##### VERCEL_PROJECT_ID
- **Type**: String (Project ID)
- **Required**: Yes (for Vercel deployment)
- **Visibility**: Can be public
- **Usage**: Identify which Vercel project to deploy to
- **Where to Set**: GitHub Secrets (or Vercel project settings)
- **How to Get**:
  1. In Vercel project dashboard → Settings → General
  2. Look for "Project ID" field
  3. Or check your `vercel.json` file: `"projectId": "xxx"`
- **Used In**: `.github/workflows/deploy.yml`

##### GEMINI_API_KEY (in CI/CD)
- **Type**: String (API Key)
- **Required**: Yes
- **Visibility**: Secret
- **Usage**: Build-time environment variable for Next.js
- **Where to Set**: GitHub Secrets
- **Note**: Same as frontend variable, injected during build

### Variable Source Priority

Variables are resolved in this order (first found wins):

1. `.env.local` (Local development only, gitignored)
2. `.env.development` (If explicitly created, gitignored)
3. `.env` (Not recommended - should be in .gitignore)
4. GitHub Secrets (CI/CD only)
5. Vercel Environment Variables (Production deployment)
6. System environment variables

### Setting Up Each Environment

#### Local Development

```bash
# 1. Copy example file
cp .env.example .env.local

# 2. Edit with your keys
cat .env.local
# NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
# GEMINI_API_KEY=your_actual_key
# GEMINI_API_KEY_ALT=your_optional_fallback

# 3. Start development server
npm run dev

# 4. Test by uploading a resume
```

**File**: `.env.local`  
**Gitignore**: Yes (never commit)  
**Required**: GEMINI_API_KEY

#### GitHub Actions (CI/CD)

```bash
# 1. Go to GitHub repository settings
# Settings → Secrets and variables → Actions

# 2. Add these repository secrets:
# - GEMINI_API_KEY
# - GEMINI_API_KEY_ALT (optional)
# - VERCEL_TOKEN
# - VERCEL_ORG_ID
# - VERCEL_PROJECT_ID

# 3. Workflow automatically uses secrets
# See: .github/workflows/deploy.yml
```

**Location**: GitHub Repository Secrets  
**Access**: Automatic in `.github/workflows/*.yml`  
**Required for Deployment**: Yes

#### Vercel Production

```bash
# Option 1: Through Vercel Dashboard
# 1. Go to Vercel project → Settings → Environment Variables
# 2. Add each variable
# 3. Select scopes: Production, Preview, Development

# Option 2: Automatically from GitHub Secrets (recommended)
# 1. Connect GitHub repository in Vercel
# 2. Enable "Automatically expose system environment variables"
# 3. Secrets sync from GitHub Actions
```

**Location**: Vercel Project Settings or GitHub Secrets (synced)  
**Scopes**: Production, Preview, Development  
**Required for Deployment**: Yes

### Secure Practices

#### ✅ DO

- ✅ Use `.env.local` for local development
- ✅ Use GitHub Secrets for CI/CD sensitive data
- ✅ Use Vercel Secrets for production-only variables
- ✅ Rotate API keys quarterly
- ✅ Use different keys for different environments
- ✅ Enable branch protection to prevent secret leaks
- ✅ Monitor API key usage in provider dashboards
- ✅ Expire tokens with set dates when possible
- ✅ Limit API key scopes to minimum necessary permissions

#### ❌ DON'T

- ❌ Commit `.env.local`, `.env.development`, or `.env.production`
- ❌ Share API keys in Slack, Discord, or emails
- ❌ Use the same API key across all environments
- ❌ Expose secrets in commit messages
- ❌ Log or print API keys to console
- ❌ Paste secrets in GitHub Issues or Pull Requests
- ❌ Store secrets in code comments
- ❌ Push secrets to any repository branch

### Checking for Leaked Secrets

Before committing, scan for accidental secret commits:

```bash
# Search git history for API key patterns
git log --all --oneline | grep -i "key\|token\|secret"

# Check for common secret patterns
git log -p | grep -i "api.?key\|gemini.?key" | head -20

# Use GitGuardian (if integrated)
# It scans for secrets during CI/CD
```

### Troubleshooting

#### Error: "API Key not configured"
```
❌ Error: [500] API Key not configured
```

**Checklist**:
1. Is `GEMINI_API_KEY` set in `.env.local`? (local dev)
2. Is `GEMINI_API_KEY` in GitHub Secrets? (CI/CD)
3. Did you restart the dev server after adding the variable?
4. Is the key valid? Test at [https://ai.google.dev](https://ai.google.dev)
5. Is the key rate-limited? Add fallback `GEMINI_API_KEY_ALT`

**Solution**:
```bash
# Local development
echo "GEMINI_API_KEY=your_actual_key" >> .env.local
npm run dev

# CI/CD - Add to GitHub Secrets, then re-run workflow
```

#### Error: "Vercel deployment failed"
```
❌ Error: vercel-action failed
```

**Checklist**:
1. Is `VERCEL_TOKEN` set in GitHub Secrets?
2. Is `VERCEL_ORG_ID` correct?
3. Is `VERCEL_PROJECT_ID` correct?
4. Did you create the Vercel project first?
5. Do you have permission to deploy?

**Solution**:
```bash
# Verify Vercel credentials locally
vercel whoami
vercel project list

# Update GitHub Secrets if IDs changed
# Re-run GitHub Actions workflow
```

#### Warning: "next-env.d.ts includes NEXT_PUBLIC_* variables"

This is normal. Next.js auto-generates types for public environment variables.

**No action needed** - it's a feature, not a bug.

#### Error in Next.js Build: "undefined" variables
```
Error: Cannot read property 'xxx' of undefined
```

**Cause**: Trying to access a private variable (`GEMINI_API_KEY_ALT`) in frontend code.

**Solution**:
- Private variables can only be accessed in `/pages/api/*` (server-side)
- Use `process.env.GEMINI_API_KEY_ALT` only in server code
- For frontend, use `process.env.NEXT_PUBLIC_*` variables

### Resources

- [Google Generative AI Docs](https://ai.google.dev/docs)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [GitGuardian Secret Detection](https://www.gitguardian.com/)
- [GitHub Advisory Database](https://github.com/advisories)

### Quick Reference Table

| Variable | Type | Public | Required | Local | GitHub Secrets | Vercel |
|----------|------|--------|----------|-------|----------------|--------|
| NEXT_PUBLIC_API_BASE_URL | URL | Yes | No | ✅ | ✅ | ✅ |
| API_BASE_URL | URL | No | No | ✅ | ✅ | ✅ |
| GEMINI_API_KEY | API Key | No | Yes | ✅ | ✅ | ✅ |
| GEMINI_API_KEY_ALT | API Key | No | No | ✅ | ✅ | ✅ |
| VERCEL_TOKEN | Token | No | Yes* | ❌ | ✅ | ❌ |
| VERCEL_ORG_ID | ID | Yes | Yes* | ❌ | ✅ | ❌ |
| VERCEL_PROJECT_ID | ID | Yes | Yes* | ❌ | ✅ | ❌ |

*Only required for GitHub Actions deployment to Vercel

## 4. Linting Setup

ESLint, Prettier, and Husky are configured for code quality.

### What's Been Configured

#### ESLint (.eslintrc.mjs)
- Next.js core web vitals rules
- TypeScript support
- React hooks validation
- No unused variables rule
- Limited `any` type warnings

```bash
npm run lint      # Run linting
npm run lint:fix  # Auto-fix linting errors
```

#### Prettier (.prettierrc.json)
- 100 character line width
- 2-space indentation
- Single quotes disabled (use double quotes)
- Semicolons enabled
- Trailing commas (ES5 mode)

```bash
npm run format        # Format all files
npm run format:check  # Check without changes
```

#### Husky (.husky/pre-commit)
- Automatically runs before each commit
- Executes `lint-staged` to check staged files
- Prevents commits with linting errors

#### Lint-staged (package.json)
- Runs ESLint on `.ts` and `.tsx` files
- Runs Prettier on `.ts`, `.tsx`, `.json`, and `.md` files
- Only checks staged files for performance

### Current Status

✓ **0 errors** - All linting errors fixed
✓ **13 warnings** - Mostly `any` type warnings (acceptable)
✓ **Formatting** - All files formatted correctly
✓ **Git hooks** - Pre-commit hook ready

#### Warnings Breakdown
- 3x `Unexpected any` in error handling (acceptable for error types)
- 1x React Hook Form compatibility (library limitation, not a bug)
- Rest are TypeScript `any` types in API error handlers

### Git Setup for Vercel Deployment

#### Required GitHub Secrets
Set these in your repository settings (Settings → Secrets and variables → Actions):

```
VERCEL_TOKEN          - Your Vercel API token
VERCEL_ORG_ID         - Your Vercel organization ID
VERCEL_PROJECT_ID     - Your Vercel project ID
GEMINI_API_KEY        - Your Gemini API key
```

#### GitHub Actions Workflow
- File: `.github/workflows/deploy.yml`
- Triggers on: push to `main` and `develop` branches
- Runs ESLint, Prettier check, builds, and deploys to Vercel

### Usage

#### Before Committing
```bash
# Manually run checks
npm run lint
npm run format

# Git will automatically run these on commit via Husky
git add .
git commit -m "Your message"  # ← Husky runs lint-staged here
```

#### Fixing Issues
```bash
# Auto-fix linting issues
npm run lint:fix

# Format code
npm run format
```

### Next Steps

1. **Connect to Vercel** (if not already done):
   - Push to GitHub
   - Link repository to Vercel project
   - Add the required GitHub secrets

2. **Customize Rules** (optional):
   - Modify `.eslintrc.mjs` for stricter/looser rules
   - Adjust `.prettierrc.json` for formatting preferences

3. **Team Agreement**:
   - Ensure team members run `npm install` to get Husky hooks
   - Share rule expectations with team

### Troubleshooting

**Q: Husky pre-commit hook isn't running?**
A: Run `npm install` to install git hooks

**Q: Want to skip pre-commit checks?**
A: Use `git commit --no-verify` (not recommended)

**Q: ESLint failing in CI but passing locally?**
A: Ensure you ran `npm install` to get latest ESLint version