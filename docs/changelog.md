# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Global toast notification system with context provider
- Material UI professional form styling for resume and job description input
- react-hook-form and zod validation for form inputs
- useGenerateReport hook with Anti-Gravity Agent analysis
- Branch protection rules in Husky pre-commit hook
- GitHub Actions workflow for Vercel deployment
- ESLint and Prettier configuration for code quality
- Pull request template with changelog section

### Changed
- Refactored /api/analyze.ts with structured error handling
- Updated lint:fix script to auto-fix both ESLint and Prettier issues
- Gemini API integration updated to use gemini-2.0-flash model
- Form submission logic moved to useGenerateReport hook
- Theme context now uses useState initializer for localStorage

### Fixed
- setResumeFile reference error in UploadForm component
- ToastContext dependency ordering issue
- ThemeContext setState in effect warning
- ESLint module not found error
- API key fallback logic for Gemini API

### Security
- API key fallback implementation with environment variables

## [0.1.0] - 2026-02-02

### Added
- Initial project setup with Next.js
- Material UI component library integration
- Resume parser component
- Job description viewer component
- Report viewer component
- Error handling card component
- Basic styling with theme context

### Changed
- Initial version

---

## How to Update This Changelog

When creating a pull request, update this file with your changes:

1. Add your changes under the **[Unreleased]** section
2. Use the categories: Added, Changed, Fixed, Removed, Security, Breaking Changes, Performance
3. Keep the changes in reverse chronological order (most recent first)
4. When releasing, create a new version section with the date

### Changelog Categories

- **Added** - New features or functionality
- **Changed** - Changes to existing functionality
- **Fixed** - Bug fixes
- **Removed** - Removed features or code
- **Security** - Security-related changes or fixes
- **Breaking Changes** - Any breaking changes that affect users or developers
- **Performance** - Performance improvements or trade-offs
- **Deprecated** - Features that are deprecated but still functional

### Example Entry

```markdown
### Added
- New authentication system with OAuth2 support
- Profile page with user settings

### Changed
- Updated API endpoint from /v1 to /v2
- Improved loading performance by 40%

### Fixed
- Fixed crash when uploading large files
- Corrected typo in error message

### Breaking Changes
- Removed legacy XML export format (use JSON instead)
```

### Version Numbering

This project uses [Semantic Versioning](https://semver.org/):

- **MAJOR** version when you make incompatible API changes
- **MINOR** version when you add functionality in a backwards compatible manner
- **PATCH** version when you make backwards compatible bug fixes
- **0.x.y** during initial development (breaking changes increment minor version)

Example: `1.2.3`
- 1 = MAJOR version
- 2 = MINOR version
- 3 = PATCH version
