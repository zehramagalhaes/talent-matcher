# Development Guide

This guide covers the architecture, data flow, and backend API of TalentMatcher.

## Architecture

This section explains the current project structure and how the frontend and backend are organized.

### What the app does

TalentMatcher compares a resume against a job description and returns an AI-generated compatibility report.

The backend sends the resume and job description to Google Gemini and validates the JSON response before returning analysis data to the frontend.

### Frontend

The frontend is built with Next.js and lives under `src/`.

Key folders:

- `src/pages/` — Next.js page routes. The main app is on `index.tsx`, and the report page is `report.tsx`.
- `src/components/` — reusable UI components grouped by feature.
- `src/hooks/` — hooks for report generation, translation, and resume state management.
- `src/context/` — global context providers (Theme, Toast, Intl, and `AppContext`).
- `src/utils/` — helper functions for API calls, file parsing, language handling, and URLs.
- `src/locales/` — translation data used by the UI.

### Backend

The backend is an Express service under `api/src/` (also accessible via `api/index.ts` for Vercel).

Key folders:

- `api/src/server.ts` — entry point. Loads env variables, configures middleware, registers TSOA routes, and conditionally serves Swagger UI.
- `api/src/controllers/` — request handlers for API endpoints such as `analyze`.
- `api/src/schemas/` — request/response schema validation.
- `api/src/utils/` — utilities such as prompt building and response handling.
- `api/generated/` — TSOA-generated files (`routes.ts`, `swagger.json`). These files are generated, not handwritten.

### Data flow

1. The user submits resume text and a job description.
2. The frontend saves input data locally and calls the backend `/api/analyze` endpoint.
3. The backend builds a strict AI prompt and sends it to Gemini.
4. The backend parses and validates the JSON response.
5. The frontend displays the returned report.

## Backend API

This section describes the TalentMatcher backend API and how it is organized.

### Backend startup

From the project root:

```bash
npm run dev:api
```

For development with local API docs:

```bash
npm run dev:docs
```

For production:

```bash
npm start
```

> The backend must be running for API endpoints and docs to work.

### API endpoints

#### POST /api/analyze
- analyzes resume compatibility with a job description
- requires `resumeText` and `jobDescription`
- optional fields: `language`, `selectedModel`

#### GET /api/models
- retrieves available Gemini AI models

#### GET /debug
- returns recent API request logs

#### GET /health
- returns backend health status

#### GET /api-docs
- serves Swagger UI documentation in development

#### GET /swagger.json
- raw OpenAPI JSON spec

### Backend architecture

- `api/src/server.ts` - Express server entry point (Registers TSOA routes)
- `api/index.ts` - Vercel serverless function entry point
- `api/src/controllers/` - TSOA controllers and request handlers
- `api/src/schemas/` - request/response validation schemas
- `api/src/utils/` - backend helper utilities, including prompt generation
- `api/generated/` - generated TSOA routes and OpenAPI spec