# API Keys & Secrets Setup Guide

**Status**: ⏳ TODO - Configure GitHub Secrets  
**Created**: February 2, 2026  
**Last Updated**: February 2, 2026

## Overview

This guide walks through setting up all required API keys and secrets for the talent-matcher application.

### What You'll Configure

1. **Google Gemini API Key** - For resume analysis (required)
2. **Fallback Gemini API Key** - Optional redundancy
3. **Vercel Deployment Tokens** - For automated deployments (required)

### Time Required

- Local setup: ~5 minutes
- GitHub Secrets: ~5 minutes
- Verification: ~5 minutes
- **Total: 15 minutes**

---

## Step 1: Get Google Gemini API Key

### 1.1 Create/Access Google Cloud Project

1. Go to [https://ai.google.dev](https://ai.google.dev)
2. Click **"Get API Key"** (top right)
3. Choose **"Create API key in new Google Cloud project"** or select existing project
4. Accept terms if prompted

### 1.2 Copy Your API Key

1. You'll see your API key displayed
2. Click **"Copy"** button
3. Save it temporarily (you'll use it in the next step)

### 1.3 Test the Key (Optional)

```bash
# Test if the API key works
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

# Should return JSON response with generated text
```

### 1.4 Monitor API Usage (Optional)

1. Go to [https://console.cloud.google.com](https://console.cloud.google.com)
2. Select your project
3. Navigate to **APIs & Services** → **Credentials**
4. Click your API key to see usage quotas

---

## Step 2: Set Up Local Development

### 2.1 Create Local Environment File

```bash
# From project root
cp .env.example .env.local
```

### 2.2 Add Your API Key

```bash
# Edit .env.local
nano .env.local
```

```env
# Replace with your actual key
NEXT_PUBLIC_GEMINI_API_KEY=AIzaSyBDsdkg5BaXO0lMBVJuBg7iaU7YBVy4pE4
```

### 2.3 Test Locally

```bash
# Start development server
npm run dev

# Open browser to http://localhost:3000
# Try uploading a resume - it should work without errors
```

### 2.4 Verify Setup

```bash
# Check that .env.local is NOT tracked by git
git status | grep .env.local

# Should show nothing (file is in .gitignore)
```

---

## Step 3: Configure GitHub Secrets

### 3.1 Go to Repository Settings

1. Go to your GitHub repository
2. Click **Settings** (top menu)
3. Click **Secrets and variables** → **Actions**

### 3.2 Add Gemini API Key

1. Click **"New repository secret"**
   - **Name**: `NEXT_PUBLIC_GEMINI_API_KEY`
   - **Value**: (paste your Gemini API key)
2. Click **"Add secret"**

### 3.3 Add Fallback API Key (Optional)

For additional reliability, add a second API key:

1. Click **"New repository secret"**
   - **Name**: `GEMINI_API_KEY_ALT`
   - **Value**: (paste another Gemini API key if you have one)
2. Click **"Add secret"**

*Note: You can get another key by repeating Step 1 with a different Google account*

### 3.4 Set Up Vercel Tokens

#### Get Vercel Token

1. Go to [https://vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Click **"Create"** button
3. **Name**: `github-actions`
4. **Expiration**: 90 days or Never (recommend yearly rotation)
5. Click **"Create Token"**
6. **Copy immediately** (won't be shown again)

#### Get Vercel Project IDs

```bash
# Option 1: Check your vercel.json
cat vercel.json

# Option 2: From dashboard
# https://vercel.com/[YOUR_ORG]/[YOUR_PROJECT]/settings/general
```

Find:
- **ORG ID**: From Vercel dashboard URL or team settings
- **PROJECT ID**: From project settings page

#### Add to GitHub Secrets

1. Click **"New repository secret"**
   - **Name**: `VERCEL_TOKEN`
   - **Value**: (paste your Vercel token)
2. Click **"Add secret"**

3. Click **"New repository secret"**
   - **Name**: `VERCEL_ORG_ID`
   - **Value**: (paste your organization ID)
4. Click **"Add secret"**

5. Click **"New repository secret"**
   - **Name**: `VERCEL_PROJECT_ID`
   - **Value**: (paste your project ID)
6. Click **"Add secret"**

### 3.5 Verify Secrets

Your GitHub Secrets should now list:
- ✅ `NEXT_PUBLIC_GEMINI_API_KEY`
- ✅ `GEMINI_API_KEY_ALT` (optional)
- ✅ `VERCEL_TOKEN`
- ✅ `VERCEL_ORG_ID`
- ✅ `VERCEL_PROJECT_ID`

---

## Step 4: Test CI/CD Pipeline

### 4.1 Trigger GitHub Actions

1. Make a small change to your code
2. Push to a non-protected branch: `git push origin feature/test-secrets`
3. Go to **GitHub** → **Actions** tab
4. Watch the workflow run
5. Verify it completes without secret-related errors

### 4.2 Check Vercel Deployment

1. Go to [https://vercel.com](https://vercel.com)
2. Select your project
3. Go to **Deployments** tab
4. Verify latest deployment succeeded
5. Click deployment URL to test the app

### 4.3 Test Resume Upload

1. Open your deployed app
2. Upload a sample resume
3. Enter a job description
4. Submit the form
5. Verify analysis completes without API key errors

---

## Step 5: Set Up Vercel Environment Variables (Optional)

If you want to manage secrets directly in Vercel instead of syncing from GitHub:

### 5.1 Add to Vercel

1. Go to your Vercel project
2. Click **Settings** → **Environment Variables**
3. Add each variable:
   ```
   NEXT_PUBLIC_GEMINI_API_KEY = [your_key]
   GEMINI_API_KEY_ALT = [optional_fallback]
   ```
4. Select scopes: Production, Preview, Development (as needed)
5. Click **Save**

### 5.2 Sync from GitHub (Recommended)

Vercel can automatically sync secrets from GitHub:

1. In Vercel project settings
2. Look for **GitHub Integration** section
3. Enable **"Automatically expose system environment variables"**
4. Secrets from GitHub Actions are automatically available

---

## Troubleshooting

### Error: "API Key not configured"

**Check**:
1. Is `NEXT_PUBLIC_GEMINI_API_KEY` in GitHub Secrets?
2. Did you re-run the workflow after adding the secret?
3. Is the key valid? Test at [ai.google.dev](https://ai.google.dev)
4. Is the key rate-limited? Add `GEMINI_API_KEY_ALT`

**Fix**:
```bash
# For local development, verify .env.local
cat .env.local | grep NEXT_PUBLIC_GEMINI_API_KEY

# For GitHub Actions, check workflow logs
# Settings → Actions → Latest workflow → View logs
```

### Error: "Vercel deployment failed"

**Check**:
1. All three Vercel secrets are set: TOKEN, ORG_ID, PROJECT_ID
2. IDs are correct (copy from Vercel settings)
3. Token hasn't expired

**Fix**:
```bash
# Verify locally
vercel whoami
vercel project list

# Update GitHub Secrets if needed
# Re-run workflow from Actions tab
```

### Secrets Not Available in Build

**Check**:
1. Is the secret name correct? (case-sensitive)
2. Did you restart the dev server after adding `.env.local`?
3. Is it a `NEXT_PUBLIC_*` variable? (must start with NEXT_PUBLIC_)

**Fix**:
```bash
# Restart dev server
npm run dev

# Check that Next.js picked up the variable
# Look for line: "Using environment variables from .env.local"
```

---

## Security Reminders

### ✅ DO

- ✅ Rotate API keys quarterly
- ✅ Use different keys for dev/staging/prod
- ✅ Monitor usage in provider dashboards
- ✅ Enable branch protection rules
- ✅ Review GitHub Actions logs for secrets handling

### ❌ DON'T

- ❌ Commit `.env.local` or `.env.production`
- ❌ Share API keys in chat/email/issues
- ❌ Log secrets to console
- ❌ Use same key across all environments
- ❌ Share credentials in documentation

---

## Next Steps

1. **Create GitHub Issue** for tracking this setup
   - Go to Issues → Create issue
   - Select "🔐 API Keys & Secrets Setup" template
   - Fill in completion checklist

2. **Test All Features**
   - Local: Upload resume and test analysis
   - Staging: Create test PR and verify deployment
   - Production: Test with real data

3. **Monitor API Usage**
   - Google Cloud: [console.cloud.google.com](https://console.cloud.google.com)
   - Vercel: [vercel.com](https://vercel.com) → project settings
   - Set up alerts for quota limits

4. **Document Your Setup** (if custom)
   - Create any additional notes for your team
   - Update README if there are variations

---

## Useful Commands

```bash
# Check current secrets (won't show values)
gh secret list

# Remove a secret if needed
gh secret delete NEXT_PUBLIC_GEMINI_API_KEY

# View workflow runs
gh run list

# View specific workflow logs
gh run view [run_id] --log

# Test build locally
npm run build
```

---

## Support & Resources

- **Google Generative AI**: https://ai.google.dev
- **Vercel Docs**: https://vercel.com/docs
- **GitHub Secrets**: https://docs.github.com/en/actions/security-guides/encrypted-secrets
- **Project Docs**: See [ENV_VARS.md](./ENV_VARS.md) for detailed variable reference

---

**Setup Complete!** 🎉

Your API keys are now configured and ready for development and deployment.

Questions? Check [ENV_VARS.md](./ENV_VARS.md) for troubleshooting.
