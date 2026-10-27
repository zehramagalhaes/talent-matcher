# AI-assisted engineering workflow

This is a repository knowledge-maintenance workflow. It preserves engineering context in version-controlled documentation; it does not retrain Gemini or modify model weights.

## Significant change lifecycle

1. **Retrieve context:** Read root [AGENTS.md](../AGENTS.md), this index, applicable directives, decisions, feature/architecture docs, and previous improvement entries. Inspect related source, tests, scripts, and deployment configuration.
2. **Understand the request:** Identify the problem, intended outcome, constraints, acceptance criteria, applicable directives/decisions, and docs that could become stale. Separate facts from assumptions and proposals.
3. **Plan the scope:** Name likely affected modules, risks, dependencies, and required checks. Keep changes incremental; avoid unrelated refactoring.
4. **Implement:** Follow the approved architecture and directives. Preserve existing behavior unless the request requires a change. Do not silently change trusted instructions or security rules.
5. **Verify:** Run the checks relevant to the change. Record exact commands and actual results, including failures and untested areas.
6. **Update project knowledge:** Update features for behavior changes; architecture for data-flow or boundary changes; directives only for an intentional, justified rule change; decisions for consequential choices; the improvement log for meaningful verified changes; and current state when status, limitations, or priorities change.
7. **Review consistency:** Compare docs with final source. Correct stale claims, verify local references using `npm run docs:check`, and ensure no secrets, real resume text, or unnecessary personal data entered the repo.
8. **Hand off:** Summarize objective/constraints, changed files, implementation status, checks and results, decisions, unresolved problems, next action, and docs to read before continuing.

For trivial changes, use a proportionate workflow: inspect the affected code, run a relevant check, update a doc only if it would otherwise become inaccurate, and provide a concise handoff. Do not conduct a full architecture review for a small isolated fix.

## Improvement record policy

Use [the improvement record template](templates/IMPROVEMENT_RECORD.md) as the field standard. Add significant changes to the chronological [improvement log](IMPROVEMENT_LOG.md); create a separate record only if the change needs substantial standalone long-term context. Do not copy prompts or conversations. Preserve reusable requirements, implemented decisions, evidence, trade-offs, and limitations instead. Use unknown when history is not established.

## Documentation impact checklist

Automation cannot reliably infer whether a source change makes a feature description, architecture statement, decision, or current-state note stale. Before handoff, explicitly consider:

- [ ] Feature behavior or responsibility changed: update `FEATURES.md`.
- [ ] Technical boundary or data flow changed: update `ARCHITECTURE.md`.
- [ ] A mandatory rule intentionally changed: update `ENGINEERING_DIRECTIVES.md` with rationale and approval/context.
- [ ] A consequential choice was made: update `DECISIONS.md`.
- [ ] A meaningful improvement is verified: add an entry to `IMPROVEMENT_LOG.md`.
- [ ] Status, limitations, or priorities changed: update `CURRENT_STATE.md`.
- [ ] Local documentation references and required files pass `npm run docs:check`.

Only check items that apply; do not add redundant entries just to satisfy a checklist.

## Session continuity handoff

At task completion or before context is lost, provide a concise handoff with:

- Objective and constraints.
- Files changed and implementation status.
- Checks run and exact results; failed or skipped checks remain explicit.
- Decisions and trade-offs.
- Unresolved problems and the next recommended action.
- Relevant docs to read before continuing.

Store durable project knowledge in the repository. Do not store credentials, real resume contents, or unnecessary personal information in handoffs. The next session must be able to continue from the repo without access to this conversation.

## Documentation status labels

Use **Implemented and verified**, **Implemented, verification incomplete**, **Planned**, **Blocked**, or **Deprecated**, as defined in the [documentation index](README.md).
