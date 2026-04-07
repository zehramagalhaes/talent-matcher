# Deployment

## Production build

```bash
npm run build
npm start
```

This starts both the frontend and backend together in production mode, with API docs disabled by default.

## Production backend only

```bash
npm run start:api
```

## Production frontend only

```bash
npm run start:app
```

## Vercel Deployment

TalentMatcher is optimized for Vercel deployment.

1. **Connect Repository**: Link your GitHub repository to a new Vercel project.
2. **Environment Variables**: Add your `GEMINI_API_KEY` and optionally `API_BASE_URL`.
3. **Root API**: The Express backend is served via `api/index.ts`.
4. **Rewrites**: Next.js automatically proxies `/api` requests to the destination defined in `API_BASE_URL`.

## CI / GitHub Actions

The repository includes a validation workflow in `.github/workflows/deploy.yml` that runs:

- `npm ci`
- `npm run lint`
- `npm run format:check`
- `npm run build`

## Environment variables

For deployment, review the required environment variables in [ENV_VARS.md](../ENV_VARS.md).

## Notes

- API docs are development-only and not exposed in production.
- The backend must be reachable at the `API_BASE_URL` (proxied via Next.js) for the app to work correctly.
- In common Vercel setups, the backend is co-located and served under the same domain.
