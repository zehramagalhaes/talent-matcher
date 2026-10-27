# Project overview

## Purpose and users

TalentMatcher helps a job candidate compare resume content with a job description, inspect evidence-based matches and gaps, and prepare a tailored resume. Recruiters are not a separately implemented user role. The repository contains no authentication or user account model.

## Current scope

The user can upload a PDF, DOCX, or TXT resume, enter a job description, choose an available Gemini text model, and request an analysis. The app shows match scores, a matching plan, strengths, gaps, keywords, section decisions, bridge suggestions, and compact and detailed resume versions. The user can switch report strategy, edit the inputs, and download PDF or DOCX output.

Resume extraction and export happen in the browser. Analysis and model discovery go through server-side Next.js API routes, which call Gemini. The app stores draft and report content in browser `sessionStorage` for the current tab; it does not implement an application database or server-side resume file store.

## Out of scope in the verified implementation

- Accounts, authentication, saved server-side resumes, or multi-device history.
- A job description upload/parser flow. The current form accepts entered job text.
- A separate recruiter persona, job-file generator, automatic hiring decision, or guarantee of ATS results.
- An independent backend service, queue, or persistent database.

See [features](FEATURES.md) for entry points and limitations, and [current state](CURRENT_STATE.md) for unresolved work.
