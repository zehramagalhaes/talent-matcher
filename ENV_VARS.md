# Environment variables and secrets

## Application runtime variables

The Next.js API routes read Gemini credentials on the server. Keep these values out of `NEXT_PUBLIC_*` variables, browser code, logs, and committed files.

| Name                 | Required                                  | Used by                                               | Behavior                                                                                                                                    |
| -------------------- | ----------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `GEMINI_API_KEY`     | Yes for live analysis and model discovery | `src/pages/api/analyze.ts`, `src/pages/api/models.ts` | Primary Gemini API key. Configure it in `.env.local` for local development and in Vercel's Production/Preview environments for deployments. |
| `GEMINI_API_KEY_ALT` | Optional                                  | Same API routes                                       | Used only when `GEMINI_API_KEY` is unset. It is not an automatic retry/failover key if the primary key returns an error.                    |

The current GitHub Actions workflow runs validation/build only and does not need Gemini credentials or Vercel deployment credentials. No `VERCEL_TOKEN`, `VERCEL_ORG_ID`, or `VERCEL_PROJECT_ID` values are required by that workflow.

## Local development

1. Copy `.env.example` to `.env.local`.
2. Set `GEMINI_API_KEY` in `.env.local`; set the optional alternate only if needed.
3. Run `npm run dev`.

`.env*` files are ignored by Git. Never paste secret values into docs, issue reports, shell commands that may enter command history, or client-side environment variables.

## Vercel environments

Set `GEMINI_API_KEY` as a Secret in the Vercel project settings for Production and Preview. Use a separate test key for Preview when appropriate. Set `GEMINI_API_KEY_ALT` only when necessary; the implementation uses it only if the primary variable is absent.

Environment changes apply to new deployments, so redeploy after changing a variable. Local development can use `.env.local`; optionally use `vercel env pull .env.local` for the linked project's Development environment. Keep the generated file out of version control.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for the full Vercel setup and deployment flow. For automation through a separately created custom GitHub Actions workflow, configure Vercel CLI credentials only if that new workflow actually invokes the CLI; this repository's workflow does not.

## Troubleshooting

- **Analysis service not configured:** confirm `GEMINI_API_KEY` exists in the environment used by the current deployment and redeploy.
- **Model discovery unavailable:** confirm the key is available in Vercel's runtime environment and inspect the deployment's function error logs without logging request contents.
- **A changed key is not active:** create a new deployment; existing deployments do not receive updated environment values.

## Further reading

- [Vercel environment variables](https://vercel.com/docs/environment-variables)
- [Vercel environment management CLI](https://vercel.com/docs/cli/env)
- [Next.js environment variables](https://nextjs.org/docs/pages/guides/environment-variables)
