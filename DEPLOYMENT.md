# Vercel deployment

This guide reflects the repository implementation. Vercel account settings and any existing project connection are outside this repository and must be verified in the Vercel dashboard.

## Current repository setup

- The application is Next.js 15 with the Pages Router, TypeScript, and the app root at the repository root.
- `package.json` defines `npm run build` as `next build`; the repository includes `package-lock.json` and the GitHub workflow runs Node.js 24.
- There is no `vercel.json`. Vercel's Next.js framework detection and default build/output settings are intended; do not configure a static export or override the Next.js output directory.
- API routes are `src/pages/api/analyze.ts` and `src/pages/api/models.ts`. The analysis route sets `maxDuration: 60` and a 50-second Gemini request timeout.
- `.github/workflows/deploy.yml` runs validation and a production build. It does not deploy to Vercel. It requires no Vercel token, project ID, org ID, or Gemini key.

## Recommended: connect the Git repository to Vercel

1. In Vercel, choose **Add New → Project** and import the Git repository containing this app.
2. Keep the Root Directory at the repository root. Confirm the Framework Preset is **Next.js** and let Vercel detect the build, install, and output settings. The package build script is `npm run build`; do not select a static export.
3. In **Settings → Build and Deployment**, select Node.js **24.x** to match the repository's CI runtime.
4. In **Settings → Environment Variables**, add `GEMINI_API_KEY` as a Secret for Production and Preview. Add `GEMINI_API_KEY_ALT` only if the application needs the optional secondary key. Development scope is optional; local setup can instead use `.env.local`.
5. Save the variables and deploy. Environment variable changes apply to new deployments, so trigger a new deployment after changing them.
6. Confirm the Vercel project's configured Production Branch. Vercel's Git integration creates deployments from connected Git references; the production branch setting in Vercel determines what is promoted to production. The GitHub workflow's `main`/`develop` triggers are CI triggers and do not set the Vercel Production Branch.
7. Test a Preview deployment before relying on Production. Check the homepage and `GET /api/models`. If testing analysis, use synthetic resume/job text and remember the endpoint sends that text to Gemini.

Vercel's Next.js detection and Git deployment behavior are described in its [Git deployment guide](https://vercel.com/docs/git) and [build configuration guide](https://vercel.com/docs/builds/configure-a-build). The [Node.js runtime versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions) page documents the available versions.

## Alternative: deploy manually with the Vercel CLI

Use this path when you do not want Git-based deployment automation:

```bash
npm install --global vercel
vercel login
vercel link
vercel deploy
```

The first `vercel deploy` creates a Preview deployment. After verifying it, deploy to Production with:

```bash
vercel deploy --prod
```

Configure `GEMINI_API_KEY` and, if needed, `GEMINI_API_KEY_ALT` in the Vercel project settings for the relevant environments. The CLI can also manage variables; use its interactive prompt and Secret visibility for API keys. Do not put secret values in shell command arguments or source control. See the official [CLI deployment guide](https://vercel.com/docs/projects/deploy-from-cli) and [environment variable CLI reference](https://vercel.com/docs/cli/env).

## Function duration requirement

The analysis API route has a 60-second maximum duration to allow its 50-second upstream timeout plus overhead. Confirm the Vercel plan and project function settings support at least 60 seconds. Vercel duration defaults and maximums vary by plan and compute configuration; check the current [function duration documentation](https://vercel.com/docs/functions/configuring-functions/duration) before changing this limit.

## CI is separate from deployment

The GitHub Actions workflow validates docs, lint, formatting, types, tests, conflict status, and a Next.js build. It does not install or invoke the Vercel CLI or upload a deployment. Git-based Vercel deployments, when configured for the project, are triggered by Vercel's Git integration independently of this workflow. This repository does not require `VERCEL_TOKEN`, `VERCEL_ORG_ID`, or `VERCEL_PROJECT_ID` for its current CI workflow.

## Troubleshooting checklist

- **Analysis reports service not configured:** check `GEMINI_API_KEY` in the Vercel environment used by that deployment and redeploy after changes.
- **Model list unavailable:** check the same server-side key and inspect that deployment's function logs. Do not add resume/job payload logging.
- **Function invocation timeout:** verify the configured maximum permits the route's 60-second duration and the account plan supports it.
- **Preview works but production fails:** compare Production and Preview environment variable scopes and redeploy the affected environment.
- **Git push does not deploy:** verify the repository connection, tracked branches, ignored build settings, and Production Branch in Vercel. Passing GitHub Actions checks alone does not deploy the app.

For credential names and local setup, see [ENV_VARS.md](./ENV_VARS.md) and [SETUP_API_KEYS.md](./SETUP_API_KEYS.md). For data handling, see [SECURITY_AND_PRIVACY.md](./SECURITY_AND_PRIVACY.md).
