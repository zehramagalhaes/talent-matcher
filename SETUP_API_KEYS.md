# Gemini API key setup

This application uses Gemini only through server-side Next.js API routes. The browser calls the app's `/api/analyze` and `/api/models` endpoints; it does not receive the Gemini API key.

## Local development

1. Create a local environment file:

   ```bash
   cp .env.example .env.local
   ```

2. Add `GEMINI_API_KEY` to `.env.local`. Optionally add `GEMINI_API_KEY_ALT`.
3. Start the app:

   ```bash
   npm run dev
   ```

4. Visit `http://localhost:3000` and verify model discovery and analysis. Use synthetic resume and job text when checking the flow.

`GEMINI_API_KEY_ALT` is selected only if `GEMINI_API_KEY` is unset. It is not an automatic failover after API errors. Never use a `NEXT_PUBLIC_` prefix or commit `.env.local`.

## Configure Gemini credentials in Vercel

For Production and Preview deployments:

1. Open the Vercel project and select **Settings → Environment Variables**.
2. Add `GEMINI_API_KEY` with Secret visibility and select the applicable environment scopes.
3. Optionally add `GEMINI_API_KEY_ALT` as a Secret if the primary variable may be absent in a scope.
4. Save the variables and create a new deployment; existing deployments do not receive changed values.

The current GitHub Actions workflow only runs repository checks and a Next.js build. It does not deploy and does not need Gemini or Vercel credentials. See [DEPLOYMENT.md](./DEPLOYMENT.md) for Git-based Vercel deployment, the CLI alternative, required project settings, and verification steps. See [ENV_VARS.md](./ENV_VARS.md) for the variable reference.

## Safety

- Store production and preview API keys in Vercel's environment settings, not GitHub Actions, unless a future workflow explicitly needs the key at runtime.
- Do not put secret values in source code, documentation, screenshots, support logs, shell command arguments, or client-side variables.
- Resume and job-description text is sent to Google Gemini when the user requests analysis. Use synthetic data for deployment checks unless real-data processing is intended.
- The app does not store submitted text in a server-side database or file store. See [SECURITY_AND_PRIVACY.md](./SECURITY_AND_PRIVACY.md).
