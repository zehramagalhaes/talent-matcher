---
name: "🔐 API Keys & Secrets Setup"
about: Configure GitHub repository secrets for API keys and deployment tokens
title: "Setup: Configure GitHub Secrets for [Environment]"
labels: ["setup", "documentation"]
assignees: []
---

## Description
This ticket tracks the configuration of GitHub repository secrets required for the application to function properly in CI/CD pipelines and production deployments.

## Required Secrets

### 1. Gemini API Configuration
- [ ] **NEXT_PUBLIC_GEMINI_API_KEY** - Primary Google Gemini API key
  - **Visibility**: Public (safe for frontend use)
  - **Get key**: https://ai.google.dev
  - **Cost**: Free tier available
  - **Required for**: Resume analysis and report generation

- [ ] **GEMINI_API_KEY_ALT** - Fallback Gemini API key (optional)
  - **Visibility**: Public (safe for frontend use)
  - **Purpose**: Redundancy if primary key is rate-limited or fails
  - **Required for**: Improved reliability

### 2. Vercel Deployment Configuration
- [ ] **VERCEL_TOKEN** - Vercel API authentication token
  - **Visibility**: Secret (keep private)
  - **Get token**: https://vercel.com/account/tokens
  - **Scope**: Full access to project
  - **Required for**: GitHub Actions to Vercel deployment

- [ ] **VERCEL_ORG_ID** - Vercel organization/team ID
  - **Visibility**: Can be public
  - **Get ID**: From Vercel dashboard URL or project settings
  - **Required for**: Targeting correct organization in deployment

- [ ] **VERCEL_PROJECT_ID** - Vercel project ID
  - **Visibility**: Can be public
  - **Get ID**: From Vercel dashboard or `vercel.json`
  - **Required for**: Targeting correct project in deployment

## Setup Instructions

### For Repository Maintainers

1. **Go to GitHub Repository Settings**
   - Navigate to Settings → Secrets and variables → Actions

2. **Add Each Secret**
   ```
   Click "New repository secret"
   - Name: [SECRET_NAME]
   - Value: [your_actual_secret_value]
   - Click "Add secret"
   ```

3. **Verify Secrets Are Set**
   - All required secrets should appear in the list
   - ✅ NEXT_PUBLIC_GEMINI_API_KEY
   - ✅ GEMINI_API_KEY_ALT (optional)
   - ✅ VERCEL_TOKEN
   - ✅ VERCEL_ORG_ID
   - ✅ VERCEL_PROJECT_ID

### For Developers

1. **Local Development Setup**
   ```bash
   # Copy environment template
   cp .env.example .env.local
   
   # Edit .env.local with your actual keys
   nano .env.local
   ```

2. **Never Commit Secrets**
   ```bash
   # .env.local is in .gitignore - it's safe
   # Do NOT commit actual keys to the repository
   ```

3. **Test Locally**
   ```bash
   npm run dev
   # Test resume analysis to verify API key works
   ```

## Security Best Practices

- ✅ Use different API keys for dev, staging, and production
- ✅ Rotate API keys regularly (quarterly recommended)
- ✅ Monitor API key usage in Google Cloud and Vercel dashboards
- ✅ Limit API key scope to only necessary permissions
- ✅ Never share API keys in commits, PRs, or documentation
- ✅ Use GitHub Secrets for all sensitive data
- ✅ Enable branch protection to prevent accidental secret leaks

## Verification Checklist

- [ ] All required GitHub Secrets are configured
- [ ] GitHub Actions workflow completes successfully
- [ ] Vercel deployment pipeline works end-to-end
- [ ] Resume analysis feature works with API key
- [ ] No API key errors in application logs
- [ ] No secrets appear in git history (`git log | grep -i "api\|secret\|token"`)

## Troubleshooting

### "API Key not configured" Error
```
❌ Error: [500] API Key not configured
```
**Solution**: Check that `NEXT_PUBLIC_GEMINI_API_KEY` is set in GitHub Secrets and workflow passes it to build step.

### Vercel Deployment Fails
```
Error: vercel-action failed
```
**Solution**: Verify VERCEL_TOKEN, VERCEL_ORG_ID, and VERCEL_PROJECT_ID are correctly set in GitHub Secrets.

### Local Development Issues
```
Error: process.env.NEXT_PUBLIC_GEMINI_API_KEY is undefined
```
**Solution**: Create `.env.local` file and add your API key:
```bash
echo "NEXT_PUBLIC_GEMINI_API_KEY=your_key_here" >> .env.local
```

## Related Documentation

- [Google Generative AI API](https://ai.google.dev)
- [Vercel Deployment](https://vercel.com/docs)
- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [.env.example](.env.example) - Example environment configuration

## Timeline

- [ ] API keys obtained from providers
- [ ] GitHub Secrets configured
- [ ] CI/CD pipeline tested
- [ ] Production deployment verified
- [ ] Documentation updated

---

**Note**: This is a one-time setup task. Secrets are automatically available to all GitHub Actions workflows after configuration.
