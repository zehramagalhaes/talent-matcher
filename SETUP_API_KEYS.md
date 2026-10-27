# API Keys & Secrets Setup Guide

**Last Updated**: October 2026

## Overview

This guide walks through setting up all required API keys and secrets for the talent-matcher application.

### What You'll Configure

1. **Google Gemini API Key** — For resume analysis (required)
2. **Fallback Gemini API Key** — Optional redundancy
3. **Vercel Deployment Tokens** — For automated deployments (required)

### Time Required

- Local setup: ~5 minutes
- GitHub Secrets: ~5 minutes
- Verification: ~5 minutes

---

## ⚠️ Important: Never use `NEXT_PUBLIC_` for the Gemini key

Variables named `NEXT_PUBLIC_*` are embedded in the browser JavaScript bundle and are visible to anyone who opens DevTools. The Gemini API key is used exclusively in server-side code (`/pages/api/`) and must **never** be exposed to the browser.

Always use `GEMINI_API_KEY` (no prefix).

---

## Step 1: Get Google Gemini API Key

### 1.1 Create Your API Key

1. Go to [https://aistudio.google.com](https://aistudio.google.com)
2. Click **"Get API Key"** in the top navigation
3. Choose **"Create API key in new project"** or select an existing project
4. Copy the API key

### 1.2 Test the Key (Optional)

```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent" \
  -H 'Content-Type: application/json' \
  -H 'X-goog-api-key: YOUR_API_KEY_HERE' \
  -X POST \
  -d '{"contents": [{"parts": [{"text": "Say hello!"}]}]}'
# Should return JSON with a generated response
```

---

## Step 2: Set Up Local Development

### 2.1 Create Local Environment File

```bash
cp .env.example .env.local
```

### 2.2 Add Your API Key

Edit `.env.local`:

```env
# Server-side only — NOT NEXT_PUBLIC_
GEMINI_API_KEY=your_api_key_here

# Optional fallback
GEMINI_API_KEY_ALT=your_fallback_key_here
```

### 2.3 Test Locally

```bash
npm run dev
# Open http://localhost:3000
# Upload a resume and verify the analysis works
```

### 2.4 Verify the Key Is Not Exposed to the Browser

```bash
# After running the build, search the output for your key pattern
npm run build
grep -r "AIzaSy" .next/static/ && echo "⚠️ Key found in bundle!" || echo "✅ Key not in bundle"
```

---

## Step 3: Configure GitHub Secrets

### 3.1 Go to Repository Settings

1. GitHub repository → **Settings**
2. **Secrets and variables** → **Actions**

### 3.2 Add Gemini API Key

1. Click **"New repository secret"**
   - **Name**: `GEMINI_API_KEY`
   - **Value**: (paste your Gemini API key)
2. Click **"Add secret"**

### 3.3 Add Fallback API Key (Optional)

1. Click **"New repository secret"**
   - **Name**: `GEMINI_API_KEY_ALT`
   - **Value**: (paste a second Gemini API key)
2. Click **"Add secret"**

### 3.4 Set Up Vercel Tokens

#### Get Vercel Token

1. Go to [https://vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Click **"Create"**
3. **Name**: `github-actions`
4. **Expiration**: 1 year (rotate annually)
5. Copy immediately — it won't be shown again

#### Get Vercel Project IDs

```bash
# From your project's vercel.json, or:
vercel project list
```

#### Add to GitHub Secrets

Add these three secrets:
- `VERCEL_TOKEN` — your Vercel authentication token
- `VERCEL_ORG_ID` — your Vercel organization/team ID
- `VERCEL_PROJECT_ID` — your Vercel project ID

### 3.5 Verify Secrets

Your GitHub Secrets should now include:
- ✅ `GEMINI_API_KEY`
- ✅ `GEMINI_API_KEY_ALT` (optional)
- ✅ `VERCEL_TOKEN`
- ✅ `VERCEL_ORG_ID`
- ✅ `VERCEL_PROJECT_ID`

---

## Step 4: Configure Vercel Production

### Option A: Vercel Dashboard (Recommended)

1. Go to your Vercel project → **Settings** → **Environment Variables**
2. Add:
   - `GEMINI_API_KEY` = your key (select: Production, Preview, Development)
   - `GEMINI_API_KEY_ALT` = fallback key (optional)
3. Click **Save**
4. Redeploy your project

### Option B: Vercel CLI

```bash
vercel env add GEMINI_API_KEY production
# Paste your key when prompted
```

---

## Step 5: Test CI/CD Pipeline

1. Push a small change to a feature branch
2. Go to **GitHub → Actions** tab
3. Watch the workflow run — verify no secret-related errors
4. Check the deployed URL on Vercel

---

## Troubleshooting

### Error: "API Key not configured" or "Service unavailable"

**Checklist**:
1. Is `GEMINI_API_KEY` set in `.env.local`? (local dev)
2. Is `GEMINI_API_KEY` in Vercel Environment Variables? (production)
3. Did you restart `npm run dev` after adding the variable?
4. Is the key valid? Test with the curl command in Step 1.2
5. Is the key rate-limited? Add `GEMINI_API_KEY_ALT`

```bash
# Verify your local .env.local has the correct variable name
grep "GEMINI_API_KEY" .env.local
# Should print: GEMINI_API_KEY=AIzaSy...
# Should NOT print: NEXT_PUBLIC_GEMINI_API_KEY=...
```

### Error: "Vercel deployment failed"

**Checklist**:
1. All three Vercel secrets set: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
2. Token hasn't expired
3. IDs are correct

---

## Security Reminders

### ✅ DO

- ✅ Use `GEMINI_API_KEY` (server-side, no prefix)
- ✅ Store keys in `.env.local` for local development
- ✅ Use GitHub Secrets for CI/CD
- ✅ Use Vercel Environment Variables for production
- ✅ Rotate API keys quarterly

### ❌ DON'T

- ❌ Use `NEXT_PUBLIC_GEMINI_API_KEY` — this exposes the key in the browser
- ❌ Commit `.env.local` to the repository
- ❌ Share API keys in chat, email, or GitHub Issues
- ❌ Log keys to the console

---

## Useful Commands

```bash
# Check current GitHub secrets (shows names only, not values)
gh secret list

# Remove an old secret
gh secret delete NEXT_PUBLIC_GEMINI_API_KEY

# View recent workflow runs
gh run list

# Test the build locally
npm run build
```

---

## Support & Resources

- **Google AI Studio**: https://aistudio.google.com
- **Vercel Docs**: https://vercel.com/docs
- **GitHub Secrets**: https://docs.github.com/en/actions/security-guides/encrypted-secrets
- **Detailed Reference**: See [ENV_VARS.md](./ENV_VARS.md)
