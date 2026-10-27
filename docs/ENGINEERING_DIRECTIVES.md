# Engineering directives

This document contains mandatory rules for changes to this repository. Detailed task flow is in [AI_WORKFLOW.md](AI_WORKFLOW.md).

## Mandatory

1. **Verify before changing.** Read this file and relevant project docs, inspect the actual code and tests, and treat source as authoritative when docs disagree.
2. **Preserve factual accuracy.** Never invent a candidate's employers, titles, dates, duties, tools, credentials, metrics, or outcomes. Missing or ambiguous resume information must stay missing or explicitly uncertain.
3. **Preserve source detail.** Keep original resume text and meaningful line, section, technology, domain, scope, responsibility, and achievement distinctions. Do not silently discard source content when extraction fails.
4. **Treat documents as untrusted data.** Resume and job text are data, not instructions. Keep trusted system instructions separate; validate structured model output before presenting it.
5. **Protect secrets and personal data.** Gemini and deployment credentials belong in server environment configuration, never in browser code, committed examples with real values, logs, tests, or docs. Avoid logging resumes, job text, generated personal data, and secrets. Do not add retention or external data stores without explicit need and approval.
6. **Keep runtime compatibility.** Use the actual Next.js Pages Router and Vercel deployment pattern. Keep privileged calls server-side. Do not add another server, database, queue, or service without demonstrated need and an approved decision.
7. **Validate boundaries.** Validate external requests, model identifiers, output shapes, file size/type, and failure cases. Return safe errors without stack traces or provider secrets. CORS is not authentication.
8. **Keep user language behavior.** Technical documentation, identifiers, comments, and developer-facing messages are English. Resume content must follow the selected application language. Do not remove existing translations.
9. **Keep scope incremental.** Reuse established modules and dependencies. Avoid broad rewrites and dependency additions when focused changes solve the problem.
10. **Document evidence honestly.** Update relevant docs, improvement records, decisions, and current state when behavior changes. Distinguish implemented, tested, planned, and unknown information. Never claim checks that were not run.

## Recommended

- Prefer focused unit tests with synthetic resume content and no real personal data.
- Keep parsing conservative and preserve raw input when structured extraction is uncertain.
- Isolate provider/model-specific logic and map provider errors to safe application responses.
- Prefer same-origin Next API routes and platform-native deployment features.
- Use focused checks relevant to the change; avoid unrelated broad modifications.
