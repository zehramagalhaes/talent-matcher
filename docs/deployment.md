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
- The backend must be started for the app to work correctly.
