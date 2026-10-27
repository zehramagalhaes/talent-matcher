# Improvement log

Entries are in known sequence, not dated. The repository does not preserve reliable dates or a complete implementation history for the improvements below. Earlier audit/planning work is not described as implementation.

## Resume ingestion and fidelity

- **Status:** Implemented and verified
- **Date:** Unknown; repository history does not establish the implementation date.
- **Problem:** Parsing and tailored output could lose details or treat absent facts as available.
- **Expected outcome:** Preserve source wording and track uncertainty rather than filling gaps by guesswork.
- **Implementation summary:** Added supported local PDF/DOCX/TXT extraction with size/signature checks, retained extracted text, conservative section grouping, a Zod source schema, and unresolved-field tracking.
- **Affected features/components:** Resume upload, text extraction, and source structure.
- **Files/modules:** `src/utils/fileUtils.ts`, `src/api/resume/sourceSchema.ts`, `src/components/forms/UploadForm.tsx`, `tests/resumeIngestion.test.mjs`.
- **Decisions and trade-offs:** Conservative grouping avoids claiming structured facts that were not confidently extracted; employment fact fields remain unresolved.
- **Verification:** Synthetic ingestion tests in `tests/resumeIngestion.test.mjs` passed in the recorded implementation session; source inspection confirms the current implementation.
- **Actual results:** The recorded suite covered source preservation, supported/unsupported/empty inputs, file size, and mismatched signatures. No OCR or broad real-document fixture suite was run.
- **Known limitations:** No OCR; employer, title, date, responsibility, and achievement fact arrays remain empty/unresolved. Historical before/after results are unavailable.
- **Follow-up:** Implement evidence-backed employment fact extraction and add representative synthetic fixtures; see [current state](CURRENT_STATE.md).
- **Related documentation/decisions:** [Architecture](ARCHITECTURE.md), [features](FEATURES.md), [decision D-002](DECISIONS.md#d-002--preserve-complete-source-text-and-parse-conservatively).

## Analysis and prompt quality

- **Status:** Implemented and verified
- **Date:** Unknown; repository history does not establish the implementation date.
- **Problem:** Generated content could be generic, omit source details, or contain unsupported claims.
- **Expected outcome:** Produce specific and natural tailoring supported by source evidence while distinguishing missing qualifications.
- **Implementation summary:** Added trusted instructions for factual fidelity, detail preservation, natural language, JD alignment, and ordered analysis. A single Gemini call returns compact/detailed versions and a matching plan; the server validates schema and selected evidence references.
- **Affected features/components:** Prompt construction, model output contract, report validation, and synthetic quality cases.
- **Files/modules:** `src/api/prompt.ts`, `src/api/analyze/schema.ts`, `src/api/analyze/geminiResponseSchema.ts`, `src/api/analyze/responseValidation.ts`, `tests/analyzePipeline.test.mjs`.
- **Decisions and trade-offs:** Keep one generation to bound cost and latency; staged reasoning is specified within that call rather than separate model requests.
- **Verification:** Synthetic pipeline and prompt tests in `tests/analyzePipeline.test.mjs` passed in the recorded implementation session.
- **Actual results:** Tests cover evidence-preserving examples, malformed output, unsupported citations, and prompt separation. No measured output-quality benchmark or real-user evaluation was run.
- **Known limitations:** Exact citation checks do not establish support for every output field. Historical before/after examples are unavailable and must not be reconstructed.
- **Follow-up:** Extend evidence validation to every factual output field and consider a repeatable quality evaluation using synthetic data; see [current state](CURRENT_STATE.md).
- **Related documentation/decisions:** [Architecture](ARCHITECTURE.md), [features](FEATURES.md), [decision D-003](DECISIONS.md#d-003--generate-one-structured-report-with-source-evidence).

## Server-side request security and privacy

- **Status:** Implemented and verified
- **Date:** Unknown; repository history does not establish the implementation date.
- **Problem:** Bound analysis requests, keep provider credentials server-side, avoid verbose errors, limit abuse, and reduce persistent retention of resume data.
- **Expected outcome:** Preserve the existing Next.js/Vercel flows while enforcing bounded, validated requests and safer handling of sensitive text.
- **Implementation summary:** Added bounded raw JSON parsing, strict Zod validation, method/content checks, supported model IDs, generic errors, provider timeouts, per-instance rate limits, API-key header for model discovery, tab-scoped storage with legacy migration, and a 60-second analysis route duration.
- **Affected features/components:** Analysis, model discovery, upload, report hydration, and edit flows.
- **Files/modules:** `src/pages/api/analyze.ts`, `src/pages/api/models.ts`, `src/api/analyze/requestSchema.ts`, `src/api/security/`, `src/utils/sessionData.ts`, UI flow call sites, `SECURITY_AND_PRIVACY.md`, `tests/apiSecurity.test.mjs`.
- **Decisions and trade-offs:** Use native Pages API routes and best-effort per-instance limits; do not add a database or shared rate-limit service without demonstrated need.
- **Verification:** `npm test`, `npm run type-check`, focused ESLint, and `npm run build` passed in the implementation session. No live Gemini request was made.
- **Actual results:** 14 tests passed; type checking, focused lint, and production build succeeded. Security tests use synthetic inputs.
- **Known limitations:** Rate limits are not global or authentication; session storage is not encrypted; model/Gemini integration has no live-provider test.
- **Follow-up:** Add handler-level tests and evaluate shared abuse protection only if measured need warrants it; see [current state](CURRENT_STATE.md).
- **Related documentation/decisions:** [Security and privacy](../SECURITY_AND_PRIVACY.md), [architecture](ARCHITECTURE.md), [decisions D-001, D-004, and D-005](DECISIONS.md).

## Persistent knowledge maintenance

- **Status:** Implemented and verified
- **Date:** 2026-10-27 (current task date; commit date not asserted)
- **Problem:** Agents needed a repeatable way to retrieve current project context, record verified improvements, and preserve handoff information across sessions.
- **Expected outcome:** Keep implementation facts and decisions version-controlled, discoverable, and distinguishable from proposals without implying model retraining.
- **Implementation summary:** Established the root agent workflow, lifecycle and handoff guidance, standardized improvement records, and a lightweight documentation validator integrated into npm scripts and CI.
- **Affected features/components:** Repository documentation and engineering workflow only; application runtime behavior is unchanged.
- **Files/modules:** `AGENTS.md`, `docs/`, `scripts/validate-docs.mjs`, `package.json`, `.github/workflows/deploy.yml`.
- **Decisions and trade-offs:** Use Node already available to the project; automate stable structural checks and retain a manual checklist for source-to-doc impact.
- **Verification:** `npm run docs:check`; `npx prettier --check 'docs/**/*.md' AGENTS.md README.md LINTING_SETUP.md package.json .github/workflows/deploy.yml scripts/validate-docs.mjs`.
- **Actual results:** Documentation validation passed for 12 Markdown files and 4 improvement records. Prettier reported all matched files formatted.
- **Known limitations:** The validator cannot detect omitted documentation updates based on changed source files or verify the truth of technical prose.
- **Follow-up:** Complete the documented manual impact checklist for each meaningful source change; the validator cannot infer documentation omissions.
- **Related documentation/decisions:** [Documentation index](README.md), [AI workflow](AI_WORKFLOW.md), [decision D-006](DECISIONS.md#d-006--validate-repository-knowledge-with-a-small-node-script-and-manual-impact-review).

## Vercel deployment guidance and CI boundary

- **Status:** Implemented and verified
- **Date:** 2026-10-27 (current task date; commit date not asserted)
- **Problem:** Existing setup docs required Vercel secrets in GitHub Actions and described a GitHub workflow that did not actually deploy. The key fallback description also implied automatic retry not implemented in code.
- **Expected outcome:** Give maintainers Vercel setup steps that match this Next.js app and distinguish platform deployment from repository CI.
- **Implementation summary:** Added a Vercel deployment guide, corrected environment and key-setup docs, clarified README and security guidance, and removed unused Gemini credentials from the CI build job.
- **Affected features/components:** Deployment documentation and CI build configuration; application runtime behavior is unchanged.
- **Files/modules:** `DEPLOYMENT.md`, `SETUP_API_KEYS.md`, `ENV_VARS.md`, `LINTING_SETUP.md`, `README.md`, `SECURITY_AND_PRIVACY.md`, `docs/`, `.github/workflows/deploy.yml`.
- **Decisions and trade-offs:** Recommend Vercel Git integration for automatic branch deployments and document CLI as a manual option. Do not add a separate GitHub Actions deployment pipeline or Vercel tokens without an explicit need.
- **Verification:** `npm run docs:check`; `npx prettier --check 'docs/**/*.md' AGENTS.md README.md LINTING_SETUP.md ENV_VARS.md SETUP_API_KEYS.md SECURITY_AND_PRIVACY.md DEPLOYMENT.md package.json .github/workflows/deploy.yml scripts/validate-docs.mjs`; `npm run build`.
- **Actual results:** Documentation validation passed for 18 Markdown files and 5 improvement records. Prettier reported all matched files formatted. The production build succeeded and emitted both API routes as dynamic endpoints.
- **Known limitations:** Vercel dashboard settings and deployed runtime are not accessible from this repository; the guide cannot confirm an existing project link or account plan.
- **Follow-up:** Verify the actual Vercel project's root directory, Production Branch, secret scopes, Node version, and 60-second function allowance in the dashboard.
- **Related documentation/decisions:** [Deployment guide](../DEPLOYMENT.md), [architecture](ARCHITECTURE.md), [decision D-007](DECISIONS.md#d-007--keep-vercel-deployment-separate-from-github-actions-validation).
