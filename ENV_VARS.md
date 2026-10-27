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

3. **For Vercel Deployment**
   - Set environment variables directly in Vercel project settings (Settings → Environment Variables)

---

## ⚠️ Security Notice: NEVER use `NEXT_PUBLIC_` for API keys

Variables prefixed with `NEXT_PUBLIC_` are **embedded in the browser JavaScript bundle** at build time. Anyone who opens DevTools on your deployed site can read them.

The Gemini API key is used exclusively in server-side API Routes (`/pages/api/*`). It **never needs to be exposed to the browser**. Always use `GEMINI_API_KEY` (no prefix).

---

## Environment Variables Reference

### Server-Side (Secret) Variables
These variables are only accessible in API Routes (`/pages/api/*`) and server-side code. They are never sent to the browser.

#### `GEMINI_API_KEY`
- **Type**: String (API Key)
- **Required**: Yes
- **Visibility**: Server-only — never exposed to the browser
- **Usage**: Google Generative AI API for resume analysis, called from `/pages/api/analyze.ts`
- **Where to Set**:
  - Local: `.env.local`
  - CI/CD: GitHub Secrets
  - Production: Vercel Project Settings → Environment Variables
- **How to Get**:
  1. Go to [https://aistudio.google.com](https://aistudio.google.com)
  2. Click **"Get API Key"**
  3. Create or select a project
  4. Copy the API key

#### `GEMINI_API_KEY_ALT`
- **Type**: String (API Key)
- **Required**: No (optional fallback)
- **Visibility**: Server-only
- **Usage**: Fallback Gemini API key if the primary is rate-limited or unavailable
- **Where to Set**: Same as `GEMINI_API_KEY`

### Deployment — CI/CD Only
These are used by GitHub Actions. Never set them in `.env` files.

#### `VERCEL_TOKEN`
- **Type**: Authentication Token
- **Required**: Yes (for automated Vercel deployment via GitHub Actions)
- **Visibility**: Secret — never expose
- **Where to Set**: GitHub Secrets only

#### `VERCEL_ORG_ID`
- **Type**: String (Organization ID)
- **Required**: Yes (for automated deployment)
- **Where to Set**: GitHub Secrets

#### `VERCEL_PROJECT_ID`
- **Type**: String (Project ID)
- **Required**: Yes (for automated deployment)
- **Where to Set**: GitHub Secrets

---

## Setting Up Each Environment

### Local Development

```bash
# 1. Copy example file
cp .env.example .env.local

# 2. Edit .env.local — add your key WITHOUT NEXT_PUBLIC_ prefix
# GEMINI_API_KEY=AIzaSy...

# 3. Start development server
npm run dev
```

**File**: `.env.local`
**Gitignore**: Yes (never commit)

### GitHub Actions (CI/CD)

Add these repository secrets (Settings → Secrets and variables → Actions):
- `GEMINI_API_KEY`
- `GEMINI_API_KEY_ALT` (optional)
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

### Vercel Production

1. Go to Vercel project → **Settings** → **Environment Variables**
2. Add `GEMINI_API_KEY` (and optionally `GEMINI_API_KEY_ALT`)
3. Select scopes: **Production**, **Preview**, **Development**
4. Click **Save** and redeploy

---

## Secure Practices

### ✅ DO

- ✅ Use `.env.local` for local development — it is git-ignored by default
- ✅ Use GitHub Secrets for CI/CD
- ✅ Use Vercel Environment Variables for production
- ✅ Rotate API keys quarterly
- ✅ Use different keys per environment when possible
- ✅ Monitor API key usage in [Google Cloud Console](https://console.cloud.google.com)

### ❌ DON'T

- ❌ Use `NEXT_PUBLIC_GEMINI_API_KEY` — this exposes the key in the browser bundle
- ❌ Commit `.env.local` or any `.env` file with real values
- ❌ Share API keys in Slack, Discord, emails, or GitHub Issues
- ❌ Log or print API keys to console
- ❌ Store secrets in code comments

---

## Troubleshooting

### Error: "API Key not configured"

**Checklist**:
1. Is `GEMINI_API_KEY` set in `.env.local`? (local dev)
2. Is `GEMINI_API_KEY` in Vercel Environment Variables? (production)
3. Did you restart the dev server after adding the variable?
4. Is the key valid? Test at [aistudio.google.com](https://aistudio.google.com)
5. Is the key rate-limited? Add `GEMINI_API_KEY_ALT` as fallback

**Fix for local development**:
```bash
echo "GEMINI_API_KEY=your_actual_key" >> .env.local
npm run dev
```

### Error: "Vercel deployment failed"

**Checklist**:
1. Are `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` set in GitHub Secrets?
2. Has the token expired? Rotate it at [vercel.com/account/tokens](https://vercel.com/account/tokens)
3. Are the IDs correct?

---

## Quick Reference Table

| Variable              | Type    | Server-only | Required | Local | GitHub Secrets | Vercel |
|-----------------------|---------|-------------|----------|-------|----------------|--------|
| `GEMINI_API_KEY`      | API Key | ✅ Yes      | Yes      | ✅    | ✅             | ✅     |
| `GEMINI_API_KEY_ALT`  | API Key | ✅ Yes      | No       | ✅    | ✅             | ✅     |
| `VERCEL_TOKEN`        | Token   | ✅ Yes      | Yes*     | ❌    | ✅             | ❌     |
| `VERCEL_ORG_ID`       | ID      | ✅ Yes      | Yes*     | ❌    | ✅             | ❌     |
| `VERCEL_PROJECT_ID`   | ID      | ✅ Yes      | Yes*     | ❌    | ✅             | ❌     |

*Only required for GitHub Actions deployment to Vercel

---

## Resources

- [Google AI Studio](https://aistudio.google.com)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
