# Project knowledge base

This directory is the maintained technical source of truth for TalentMatcher. Source code remains authoritative for runtime behavior; documentation must be corrected when it drifts.

Run `npm run docs:check` to verify required knowledge-base files, local Markdown links, improvement-log fields and status labels, and root agent references. It cannot determine whether a code change omitted a needed documentation update; complete the manual impact checklist in [AI workflow](AI_WORKFLOW.md).

## Start here

1. [Project overview](PROJECT_OVERVIEW.md) — purpose, audience, and scope.
2. [Architecture](ARCHITECTURE.md) — runtime, modules, data flow, and boundaries.
3. [Features](FEATURES.md) — feature inventory, entry points, dependencies, and failure cases.
4. [Engineering directives](ENGINEERING_DIRECTIVES.md) — mandatory standards and recommendations.
5. [AI workflow](AI_WORKFLOW.md) — inspect, implement, verify, and hand off changes.

## Reference and status

- [Decisions](DECISIONS.md) — architecture choices and trade-offs.
- [Improvement log](IMPROVEMENT_LOG.md) — verified changes and their evidence.
- [Current state](CURRENT_STATE.md) — implementation status, limitations, and priorities.
- [Improvement record template](templates/IMPROVEMENT_RECORD.md) — format for future log entries.

## Existing repository references

- [README](../README.md) — product summary and local setup.
- [Environment variables](../ENV_VARS.md) — credential names and setup guidance; do not put values in docs.
- [Vercel deployment](../DEPLOYMENT.md) — current project setup, Git integration and CLI deployment steps.
- [Security and privacy](../SECURITY_AND_PRIVACY.md) — request limits, retention, and deployment notes.
- [Linting setup](../LINTING_SETUP.md) — existing linting and formatting guidance; validate claims against `package.json` and CI.
- [Changelog](../CHANGELOG.md) — retained legacy release history. Its older entries are not treated as proof of current implementation.
- [CI workflow](../.github/workflows/deploy.yml) — repository validation/build only; it does not deploy to Vercel.

## Status vocabulary

- **Implemented and verified**: present in source and supported by a named check or direct code inspection.
- **Implemented, verification incomplete**: present in source, but no adequate check has been run or recorded.
- **Planned**: proposed work not present in the source.
- **Blocked**: progress depends on an external change or decision.
- **Deprecated**: retained temporarily but no longer intended for use.

Historical notes without repository evidence are labeled **historical detail unknown**. Dates are omitted where they cannot be established.
