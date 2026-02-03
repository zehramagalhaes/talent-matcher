# Branch Protection Rules

This document outlines the branch protection rules configured for this repository.

## Protected Branches
- `main` - Production branch
- `develop` - Development branch
- `production` - Production release branch

## Rules Configuration

### 1. Require Pull Request Reviews
- **Minimum reviewers**: 1
- **Dismiss stale pull request approvals**: Enabled
- **Require review from code owners**: Enabled (if CODEOWNERS file exists)

### 2. Require Status Checks to Pass
- ESLint validation (`lint`)
- Prettier formatting (`format-check`)
- Build validation (`build`)
- All other CI/CD checks must pass before merging

### 3. Require Branches to be Up to Date
- Before merging, the branch must be up to date with the base branch
- Use **Rebase** or **Rebase and Merge** strategy to update

### 4. Merge Strategy
- **Default merge strategy**: Squash and Merge
- This consolidates all commits into a single commit on the base branch
- Keeps the git history clean and linear
- Commit message should clearly describe the feature/fix

### 5. Conflict Resolution
- PRs with merge conflicts cannot be merged
- Resolve conflicts by:
  1. Fetching the latest base branch: `git fetch origin`
  2. Rebase your branch: `git rebase origin/main` (or develop)
  3. Resolve conflicts in your editor
  4. Force push your changes: `git push origin feature/your-branch -f`

## How to Configure in GitHub UI

1. Go to Settings → Branches
2. Add/Edit branch protection rule for each protected branch
3. Enable the following:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Require code reviews before merging (1 approval)
   - ✅ Dismiss stale pull request approvals
   - ✅ Allow auto-merge (Squash and Merge only)
   - ✅ Restrict who can push to matching branches (if desired)

## Local Git Configuration

To enforce squash merge locally, you can set:

```bash
git config --global pull.rebase true
git config branch.autosetuprebase always
```

## Pre-commit Hook Protection

The `.husky/pre-commit` hook prevents direct commits to protected branches. If you accidentally try to commit to `main` or `develop`, you'll see:

```
❌ Error: You cannot commit directly to the 'main' branch.
Please create a feature branch and submit a pull request instead.
```

## Workflow

1. Create a feature branch from `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit:
   ```bash
   git add .
   git commit -m "feat: description of your changes"
   ```

3. Keep your branch updated with base branch:
   ```bash
   git fetch origin
   git rebase origin/develop
   ```

4. Push to remote:
   ```bash
   git push origin feature/your-feature-name
   ```

5. Open a Pull Request on GitHub

6. Ensure all checks pass and get at least 1 approval

7. Merge using **Squash and Merge** (default strategy)

## Status Checks

The following automated checks must pass before merging:

- **ESLint**: Code quality validation
- **Prettier**: Code formatting validation
- **Build**: NextJS build validation
- **Vercel**: Deployment preview

All checks are configured in `.github/workflows/deploy.yml`.
