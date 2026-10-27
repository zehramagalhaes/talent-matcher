# Security and privacy

## Request handling

Resume analysis and model discovery run through the Next.js Pages API routes at `/api/analyze` and `/api/models`. Gemini credentials are read only from server environment variables. Analysis accepts JSON only, validates a strict request schema, limits resume and job description lengths, restricts model identifiers to supported Gemini text generation models, and has a 256 KB request body limit. Uploaded binary files are parsed in the browser and are not posted to the API; accepted file formats are PDF, DOCX, and TXT up to 5 MB.

Resume and job-description text are untrusted data. The analysis prompt keeps trusted instructions separate from delimited input, and the response is schema and evidence validated before it is returned. API errors are intentionally generic and do not include stack traces or submitted text. Do not add request-body logging or analytics containing resume content.

## Retention and third-party processing

The browser keeps resume text, job text, and the generated report in `sessionStorage` for the current tab so the edit and report flows work. A one-time migration moves existing saved drafts from `localStorage` to the current tab and removes the persistent copy. Closing the tab normally clears session data; users can clear it sooner by starting a fresh report. Browser extensions and access to the user's device remain outside the application's control.

When the user submits an analysis, the resume and job description are sent to Google's Gemini API for processing. The app does not write them to a database or application-managed file store. Operators should review Google's current API data handling terms and configure Vercel log retention and access appropriately.

## Deployment and limits

Set `GEMINI_API_KEY` in local development and Vercel server-side environment settings. `GEMINI_API_KEY_ALT` is an optional fallback. Never use a `NEXT_PUBLIC_` prefix for either credential. No CORS allowlist is configured because the frontend uses same-origin API routes; CORS is not authentication.

The API routes apply an in-memory, per-instance rate limit (analysis: 5 requests per 15 minutes; model discovery: 30 per minute), keyed by Vercel's client IP forwarding header. The transient key is retained only in the running instance until its rate window expires. Serverless instances can restart or scale independently, so this is a best-effort abuse limit, not a global quota or authentication mechanism. If abuse requires a stronger shared limit, configure a Vercel platform protection feature before adding external infrastructure. The analysis API route sets a 60-second maximum duration around a 50-second Gemini timeout; deployment plans must support at least 60 seconds. Vercel's duration defaults and limits depend on project plan and whether Fluid Compute is enabled.
