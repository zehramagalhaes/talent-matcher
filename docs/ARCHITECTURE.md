# Architecture

## Runtime and stack

- Next.js 15 Pages Router with TypeScript and React 19.
- Material UI for interface components; React Intl and `src/locales/translations.ts` for user-facing English and Portuguese translations.
- npm scripts and lockfile for dependency management.
- Vercel-compatible Next.js deployment. The repository has no `vercel.json`; Next.js produces server functions for the API routes.
- Deployment instructions and verified repository/CI boundaries are maintained in [DEPLOYMENT.md](../DEPLOYMENT.md).
- Gemini integration uses `@google/generative-ai` from server-side code. Zod validates request, source, and response data.

The actual dependency versions and commands are in [package.json](../package.json); framework configuration is in [next.config.ts](../next.config.ts).

## Major modules

| Concern                  | Location                                                                                                                             | Responsibility                                                                            |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| Home/input flow          | `src/pages/index.tsx`, `src/components/forms/UploadForm.tsx`                                                                         | Model selection, local resume parsing, job text entry, edit flow, submission              |
| Resume extraction        | `src/utils/fileUtils.ts`, `src/api/resume/sourceSchema.ts`                                                                           | PDF/DOCX/TXT extraction, original text preservation, conservative section grouping        |
| Browser-to-API client    | `src/api/analyze/analyzeApi.ts`, `src/api/models/gemini/geminiModelsApi.ts`, `src/api/baseApi.ts`                                    | Same-origin requests to the app API                                                       |
| Analysis endpoint        | `src/pages/api/analyze.ts`                                                                                                           | Request limits, rate limit, Gemini call, response validation, safe errors                 |
| Prompt and contracts     | `src/api/prompt.ts`, `src/api/analyze/schema.ts`, `src/api/analyze/geminiResponseSchema.ts`, `src/api/analyze/responseValidation.ts` | Trusted instructions, structured output contract, evidence checks, provider error mapping |
| Model discovery          | `src/pages/api/models.ts`, `src/api/models/gemini/`                                                                                  | Server-side model listing and supported-model filtering                                   |
| Report flow              | `src/hooks/useReport.ts`, `src/pages/report.tsx`, `src/components/reports/resume/`                                                   | Hydration, report rendering, strategy choice, retry and edit actions                      |
| Resume export            | `src/utils/generate/`, `src/components/reports/resume/`                                                                              | Client-side PDF/DOCX generation and download                                              |
| Browser preferences/data | `src/utils/sessionData.ts`, `src/context/`                                                                                           | Tab-scoped sensitive report data and persistent theme/model preferences                   |

## Request and data flow

1. The browser reads the selected file and extracts text. It retains complete extracted text and a conservative structure with evidence spans; it does not send the original binary file to the API.
2. The client posts resume text, job text, selected model, and UI locale to `/api/analyze`.
3. The API checks method, content type, body byte limit, schema, field lengths, model ID, and an in-memory per-instance rate limit.
4. The server builds one Gemini request containing trusted system instructions and delimited untrusted documents. Gemini returns structured JSON.
5. Zod validates the report. Evidence validation checks exact resume substrings for resume-summary evidence, experience evidence, skill evidence, and matching-plan evidence. Invalid output is rejected.
6. The client keeps input and result in `sessionStorage` to support report hydration and editing. The report screen renders the result and can generate local PDF/DOCX downloads.

Model discovery follows a separate same-origin GET to `/api/models`; the server calls Google's model-list endpoint with the API key in a request header.

## Boundaries and deployment constraints

- Gemini credentials stay in server environment variables; no Gemini provider key is part of the browser API payload.
- Uploaded documents and job text are untrusted data; neither controls trusted prompt instructions.
- No CORS policy is configured because the app uses same-origin routes.
- Analysis uses a 50-second provider timeout and a 60-second Next API route maximum duration. The deployment plan must permit that duration.
- In-memory rate limiting is per serverless instance and is not a shared quota or authentication system.
- Binary parsing occurs in browser memory, with accepted extensions/signatures and a 5 MiB size ceiling. There is no server-side upload or persistent file storage.

See [security and privacy](../SECURITY_AND_PRIVACY.md) for operational details and caveats.
