# Environment Variables & Secrets Management

This document explains all environment variables used in the talent-matcher application and how to configure them properly.

## Quick Start

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

## Environment Variables Reference

### Frontend - Public Variables
These variables are accessible in the browser and frontend code.

#### NEXT_PUBLIC_GEMINI_API_KEY
- **Type**: String (API Key)
- **Required**: Yes
- **Visibility**: Public (safe - restricted to Gemini API)
- **Usage**: Google Generative AI API for resume analysis
- **Where to Set**:
  - Local: `.env.local`
  - CI/CD: GitHub Secrets
  - Production: Vercel Secrets
- **How to Get**:
  1. Go to [https://ai.google.dev](https://ai.google.dev)
  2. Sign in with Google account
  3. Click "Get API Key" → "Create API key in new Google Cloud project"
  4. Copy the API key
- **Example**: `AIzaSyBDsdkg5BaXO0lMBVJuBg7iaU7YBVy4pE4`

#### NEXT_PUBLIC_ENVIRONMENT
- **Type**: String
- **Required**: No (defaults to 'development')
- **Visibility**: Public
- **Values**: `development`, `staging`, `production`
- **Usage**: Feature flags and environment-specific behavior
- **Example**: `NEXT_PUBLIC_ENVIRONMENT=production`

### Backend - Secret Variables
These variables are only available on the server (backend) and should never leak to the frontend.

#### GEMINI_API_KEY_ALT
- **Type**: String (API Key)
- **Required**: No (optional fallback)
- **Visibility**: Secret (keep private)
- **Usage**: Fallback Gemini API key if primary fails or is rate-limited
- **Where to Set**: 
  - Local: `.env.local`
  - CI/CD: GitHub Secrets
  - Production: Vercel Secrets
- **Purpose**: Redundancy and reliability
- **Example**: `AIzaSy...` (another valid Gemini API key)

### Deployment - CI/CD Only
These variables are used only by GitHub Actions and Vercel deployment pipelines. They should NEVER be set locally or committed.

#### VERCEL_TOKEN
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

#### VERCEL_ORG_ID
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

#### VERCEL_PROJECT_ID
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

#### NEXT_PUBLIC_GEMINI_API_KEY (in CI/CD)
- **Type**: String (API Key)
- **Required**: Yes
- **Visibility**: Public (only for build step)
- **Usage**: Build-time environment variable for Next.js
- **Where to Set**: GitHub Secrets
- **Note**: Same as frontend variable, injected during build

## Variable Source Priority

Variables are resolved in this order (first found wins):

1. `.env.local` (Local development only, gitignored)
2. `.env.development` (If explicitly created, gitignored)
3. `.env` (Not recommended - should be in .gitignore)
4. GitHub Secrets (CI/CD only)
5. Vercel Environment Variables (Production deployment)
6. System environment variables

## Setting Up Each Environment

### Local Development

```bash
# 1. Copy example file
cp .env.example .env.local

# 2. Edit with your keys
cat .env.local
# NEXT_PUBLIC_GEMINI_API_KEY=AIzaSy...
# GEMINI_API_KEY_ALT=AIzaSy... (optional)

# 3. Start development server
npm run dev

# 4. Test by uploading a resume
```

**File**: `.env.local`  
**Gitignore**: Yes (never commit)  
**Required**: NEXT_PUBLIC_GEMINI_API_KEY

### GitHub Actions (CI/CD)

```bash
# 1. Go to GitHub repository settings
# Settings → Secrets and variables → Actions

# 2. Add these repository secrets:
# - NEXT_PUBLIC_GEMINI_API_KEY
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

### Vercel Production

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

## Secure Practices

### ✅ DO

- ✅ Use `.env.local` for local development
- ✅ Use GitHub Secrets for CI/CD sensitive data
- ✅ Use Vercel Secrets for production-only variables
- ✅ Rotate API keys quarterly
- ✅ Use different keys for different environments
- ✅ Enable branch protection to prevent secret leaks
- ✅ Monitor API key usage in provider dashboards
- ✅ Expire tokens with set dates when possible
- ✅ Limit API key scopes to minimum necessary permissions

### ❌ DON'T

- ❌ Commit `.env.local`, `.env.development`, or `.env.production`
- ❌ Share API keys in Slack, Discord, or emails
- ❌ Use the same API key across all environments
- ❌ Expose secrets in commit messages
- ❌ Log or print API keys to console
- ❌ Paste secrets in GitHub Issues or Pull Requests
- ❌ Store secrets in code comments
- ❌ Push secrets to any repository branch

## Checking for Leaked Secrets

Before committing, scan for accidental secret commits:

```bash
# Search git history for API key patterns
git log --all --oneline | grep -i "key\|token\|secret"

# Check for common secret patterns
git log -p | grep -i "api.?key\|gemini.?key" | head -20

# Use GitGuardian (if integrated)
# It scans for secrets during CI/CD
```

## Troubleshooting

### Error: "API Key not configured"
```
❌ Error: [500] API Key not configured
```

**Checklist**:
1. Is `NEXT_PUBLIC_GEMINI_API_KEY` set in `.env.local`? (local dev)
2. Is `NEXT_PUBLIC_GEMINI_API_KEY` in GitHub Secrets? (CI/CD)
3. Did you restart the dev server after adding the variable?
4. Is the key valid? Test at [https://ai.google.dev](https://ai.google.dev)
5. Is the key rate-limited? Add fallback `GEMINI_API_KEY_ALT`

**Solution**:
```bash
# Local development
echo "NEXT_PUBLIC_GEMINI_API_KEY=your_actual_key" >> .env.local
npm run dev

# CI/CD - Add to GitHub Secrets, then re-run workflow
```

### Error: "Vercel deployment failed"
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

### Warning: "next-env.d.ts includes NEXT_PUBLIC_* variables"

This is normal. Next.js auto-generates types for public environment variables.

**No action needed** - it's a feature, not a bug.

### Error in Next.js Build: "undefined" variables
```
Error: Cannot read property 'xxx' of undefined
```

**Cause**: Trying to access a private variable (`GEMINI_API_KEY_ALT`) in frontend code.

**Solution**:
- Private variables can only be accessed in `/pages/api/*` (server-side)
- Use `process.env.GEMINI_API_KEY_ALT` only in server code
- For frontend, use `process.env.NEXT_PUBLIC_*` variables

## Resources

- [Google Generative AI Docs](https://ai.google.dev/docs)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [GitGuardian Secret Detection](https://www.gitguardian.com/)
- [GitHub Advisory Database](https://github.com/advisories)

## Quick Reference Table

| Variable | Type | Public | Required | Local | GitHub Secrets | Vercel |
|----------|------|--------|----------|-------|----------------|--------|
| NEXT_PUBLIC_GEMINI_API_KEY | API Key | Yes | Yes | ✅ | ✅ | ✅ |
| GEMINI_API_KEY_ALT | API Key | No | No | ✅ | ✅ | ✅ |
| VERCEL_TOKEN | Token | No | Yes* | ❌ | ✅ | ❌ |
| VERCEL_ORG_ID | ID | Yes | Yes* | ❌ | ✅ | ❌ |
| VERCEL_PROJECT_ID | ID | Yes | Yes* | ❌ | ✅ | ❌ |

*Only required for GitHub Actions deployment to Vercel
