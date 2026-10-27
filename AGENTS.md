# Agent entry point

Before substantial work, read [docs/README.md](docs/README.md), then the relevant project documents and source files. Treat source code as authoritative when it conflicts with documentation, and update the affected documentation after meaningful changes.

Follow [docs/ENGINEERING_DIRECTIVES.md](docs/ENGINEERING_DIRECTIVES.md) and [docs/AI_WORKFLOW.md](docs/AI_WORKFLOW.md). For significant changes, complete the documented retrieve → understand → plan → implement → verify → update knowledge → consistency review → handoff lifecycle; use a proportionate version for trivial changes. Preserve the documented architecture unless a justified change is approved. Record only verified improvements, report actual check results and unresolved work, and never present plans or unverified behavior as complete. Run `npm run docs:check` after documentation changes.
