# Contributing Guide

## 🧭 Overview
Thank you for contributing! This guide outlines coding standards and workflow for working on the project.

---

## 1. Development Workflow

### Step 1: Branching
Use feature-based branches:
```
git checkout -b feat/booking-api
```

### Step 2: Commit Guidelines
Use clear commit messages:
- `[feat] add booking webhook verification`
- `[fix] RLS policy issue in events table`
- `[docs] update README`

### Step 3: Pull Requests
1. Push your branch to origin.
2. Open a PR to `develop`.
3. Request review before merge.

---

## 2. Coding Standards
- TypeScript strictly typed (`strict: true`)
- Use ESLint + Prettier
- Avoid inline SQL; store queries under `/db/migrations`
- Keep functions pure and modular

---

## 3. Testing
Run unit and integration tests before pushing:
```bash
npm run test
npm run lint
npm run type-check
```

---

## 4. Environment Variables
Copy `.env.example` → `.env.local` and fill out credentials.

---

## 5. Deployment
Deployments are automatic on merge to `main` (Vercel). Ensure all checks pass before merging.

---

## 6. Issue & Feature Requests
Use GitHub Issues for:
- 🐛 Bugs
- 💡 Feature ideas
- 🧱 Documentation updates

Thank you for maintaining quality and collaboration!
