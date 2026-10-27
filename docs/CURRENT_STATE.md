# Current state

Status reflects source inspection and the checks recorded in the latest implementation session. Re-run relevant checks after later changes.

## Implemented and verified

- Resume extraction supports PDF, DOCX, and TXT, with a 5 MiB file limit and basic format checks. Synthetic tests cover preservation, unsupported/empty documents, size, and signature mismatch.
- Resume source structure retains the original text and identifiable sections; Zod validates its shape.
- Gemini analysis and model discovery run in Next API routes. Request validation, bounded JSON parsing, provider timeouts, safe errors, model filtering, and per-instance rate limiting are implemented.
- The prompt treats documents as untrusted data and asks for evidence-grounded, natural resume tailoring. Response shape and selected resume evidence are checked server-side.
- Report, edit, strategy selection, PDF/DOCX exports, UI English/Portuguese translations, and tab-scoped sensitive-data storage are present.
- In the last recorded backend-security implementation session, 14 tests passed, type checking and focused ESLint passed, and the production build succeeded. These results are not a guarantee for future commits.

## Implemented, verification incomplete

- API handlers and model discovery have no mocked handler-level integration tests; existing tests focus on schemas, pure helpers, prompts, and extraction.
- PDF/DOCX parsing and PDF/DOCX exports lack broad fixture-based integration tests. Tests use synthetic text and do not cover real documents.
- No live Gemini call or ongoing quality evaluation has been run as part of the recorded checks.
- The broad repository-wide format status is not recorded as green. Do not infer it from focused ESLint or build success.

## Known limitations and technical debt

- Resume parsing does not yet extract employer, job title, dates, responsibilities, and achievements into their corresponding fact arrays; those remain unresolved.
- Scanned PDFs have no OCR path. Basic signatures are not malware scanning.
- Model output evidence validation covers summary evidence, skills, experience, and the matching plan, but not all profile/contact, education, and certification claims. It verifies cited substrings, not semantic entailment.
- Gemini analysis remains a single generation call rather than separately persisted job-analysis/matching/rewrite stages.
- Per-instance in-memory rate limits can reset or differ across Vercel instances and are not authentication.
- Resume/job text is sent to Gemini during analysis; browser session storage is accessible to scripts/extensions running in the page context and is not encrypted.
- Existing top-level setup documents and changelog contain older or potentially stale claims. The docs index identifies the current authoritative documents; source code remains the behavior authority.
- `npm run docs:check` validates required knowledge-base files, local Markdown links, improvement-record fields/status vocabulary, and root agent references. Whether a specific source change required a doc update remains a manual review.
- Vercel deployment steps are documented in `DEPLOYMENT.md`. The repository's GitHub Actions workflow validates and builds but does not deploy; the account's Git connection, production branch, domains, environment settings, and plan are not verifiable from this codebase.

## Next priorities

1. Add deterministic or model-assisted extraction for employment facts while retaining traceable source evidence and explicit uncertainty.
2. Expand validation or tests to cover every factual output field, especially education, certifications, contact details, and headings.
3. Add handler-level tests for malformed/oversized requests, method handling, safe errors, and rate limit responses without live Gemini credentials.
4. Consider a shared rate-limit service only if measured abuse warrants it and after a deployment/privacy decision.

These are planned priorities, not completed work.
