# Engineering decisions

This is the record of decisions supported by current code and the available task history. Older decision dates and alternative evaluations were not preserved; they are not inferred here.

## D-001 — Keep the Next.js Pages Router and Vercel runtime

- **Status:** Implemented and verified.
- **Decision:** Use native `src/pages/api/*` routes with Vercel's Next.js runtime; keep privileged calls inside these server routes.
- **Rationale:** The app already uses Next.js Pages Router and Vercel. Native routes satisfy server-side Gemini calls without a separate service.
- **Trade-offs:** Serverless instances are ephemeral; in-memory state cannot enforce global quotas.
- **Evidence:** `src/pages/api/analyze.ts`, `src/pages/api/models.ts`, CI workflow, and successful production build.
- **Rejected for current scope:** Separate FastAPI service, database, and queue; no demonstrated need.

## D-002 — Preserve complete source text and parse conservatively

- **Status:** Implemented and verified.
- **Decision:** Keep original extracted text and recognizable section groups; unresolved fields remain explicitly unresolved.
- **Rationale:** Avoid losing facts or fabricating structure when documents have inconsistent formats.
- **Trade-offs:** Employer, title, date, duty, and achievement arrays are not yet populated by deterministic extraction.
- **Evidence:** `src/utils/fileUtils.ts`, `src/api/resume/sourceSchema.ts`, and `tests/resumeIngestion.test.mjs`.

## D-003 — Generate one structured report with source evidence

- **Status:** Implemented and verified.
- **Decision:** Use one Gemini generation with detailed workflow instructions, a response schema, and server-side Zod/evidence validation.
- **Rationale:** Keep model cost, latency, and deployment complexity bounded while requiring transparent evidence.
- **Trade-offs:** Stages are represented in a single model call; the validator checks cited exact substrings and selected field relationships, not every factual output field.
- **Evidence:** `src/api/prompt.ts`, `src/api/analyze/geminiResponseSchema.ts`, `src/api/analyze/schema.ts`, `src/api/analyze/responseValidation.ts`, and `tests/analyzePipeline.test.mjs`.

## D-004 — Keep documents in tab-scoped browser storage; do not persist them server-side

- **Status:** Implemented and verified.
- **Decision:** Store resume text, job text, and report state in `sessionStorage`; migrate legacy localStorage entries on access and remove their persistent copy.
- **Rationale:** Preserve report/edit flows while limiting retention beyond the active tab.
- **Trade-offs:** Data is not encrypted; closing a tab normally loses the draft; device or extension access remains a risk.
- **Evidence:** `src/utils/sessionData.ts`, UI call sites, and `SECURITY_AND_PRIVACY.md`.

## D-005 — Use minimal best-effort in-memory request limits

- **Status:** Implemented and verified.
- **Decision:** Limit analysis and model-discovery requests per client key in each serverless process; do not add shared infrastructure.
- **Rationale:** Add a low-complexity abuse barrier without a database or paid service.
- **Trade-offs:** Limits are not global, persistent, or an authentication control.
- **Evidence:** `src/api/security/rateLimit.ts`, API route call sites, and `tests/apiSecurity.test.mjs`.

## D-006 — Validate repository knowledge with a small Node script and manual impact review

- **Status:** Implemented and verified.
- **Decision:** Add a dependency-free `docs:check` command to CI for required documentation files, local links, improvement-record structure, status labels, and root agent references. Keep doc-impact detection manual.
- **Rationale:** These structural checks are reliable and useful; deciding whether a source change makes prose stale cannot be inferred reliably from file changes alone.
- **Trade-offs:** The script cannot guarantee that every meaningful implementation change updated the right documentation. Agents must complete the checklist in `docs/AI_WORKFLOW.md`.
- **Evidence:** `scripts/validate-docs.mjs`, `package.json`, `.github/workflows/deploy.yml`, and the documentation impact checklist.

## D-007 — Keep Vercel deployment separate from GitHub Actions validation

- **Status:** Implemented and verified.
- **Decision:** Document Vercel's native Next.js/Git integration as the recommended path and the Vercel CLI as a manual alternative. Keep the repository's GitHub Actions workflow limited to validation and build checks; do not add Vercel deployment tokens or Gemini keys to the current CI job.
- **Rationale:** The app is a standard Next.js Pages Router project with no `vercel.json`, and the current workflow does not invoke a deployment tool. Vercel can detect the framework and use the package build script.
- **Trade-offs:** Vercel account-side repository connection, production branch, environment scopes, domain, and plan settings are not version-controlled or verifiable from this repository.
- **Evidence:** `package.json`, `.github/workflows/deploy.yml`, `src/pages/api/analyze.ts`, and [DEPLOYMENT.md](../DEPLOYMENT.md).
