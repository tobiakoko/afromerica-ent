# Afromerica Entertainment website

Afromerica Entertainment's web platform

---

## Project Implementation Roadmap — Quick Start

Welcome to the project! This document summarizes how to set up, run, and contribute following the **System Architecture** roadmap.

### 🚀 Overview
This repository powers a full-stack web platform built with **Next.js**, **Supabase**, **Paystack**, and **Resend**. It includes content management, bookings, payments, and voting systems with real-time features and admin dashboards.

---

### 🧩 Getting Started

#### 1. Prerequisites
- Node.js 18+
- Docker Desktop (for local Supabase)
- Supabase project (for production)
- Paystack API keys (optional)
- Vercel (for deployment)

#### 2. Quick Start
```bash
# Clone and install
git clone <repo-url>
cd afromerica-ent
npm install

# Set up environment
cp .env.example .env.local

# Start local Supabase
npx supabase start

# Update .env.local with Supabase credentials from output above
# Then start development server
npm run dev
```

Access app at `http://localhost:3000`

#### 3. Database Setup

The project uses Supabase for authentication and database:

```bash
# Start local database
npx supabase start

# View database in Supabase Studio
open http://localhost:54323

# Reset database (if needed)
npx supabase db reset
```

---

### ⚙️ Roadmap Phases

| Phase | Focus | Key Deliverables |
|-------|--------|------------------|
| 0 | Preparation | Repo structure, toolchain setup |
| 1 | Database & Auth | Supabase schema + RLS |
| 2 | API Skeleton | Shared types, middleware, validation |
| 3 | Public Site | Public pages + ISR hooks |
| 4 | Booking & Payments | Cart + Paystack + Webhook |
| 5 | Voting Systems | Showcase event logic |
| 6 | Admin Dashboard | RBAC, CRUD features |
| 7 | Email & Realtime | Resend + Supabase Realtime |
| 8 | Testing & QA | Unit, integration, E2E tests |
| 9 | CI/CD & Deploy | Vercel pipelines |
| 10 | Monitoring | Sentry, rate limiting, backups |

---

### 🧠 Folder Structure
```
app/                  # Next.js routes (public + admin)
  ├── (public)/      # Public pages
  ├── (dashboard)/   # User dashboard
  └── api/           # API routes
features/            # Feature modules
  ├── events/        # Event management
  ├── bookings/      # Booking system
  ├── voting/        # Voting systems
  └── artists/       # Artist profiles
lib/                 # Core libraries
  ├── auth/          # Authentication
  └── email/         # Email service
utils/supabase/      # Supabase utilities
  ├── client.ts      # Browser client
  ├── server.ts      # Server client
  ├── middleware.ts  # Auth middleware
  └── helpers.ts     # Helper functions
supabase/            # Supabase configuration
  ├── migrations/    # Database migrations
  ├── seed.sql       # Seed data
  └── config.toml    # Local config
db/                  # Legacy SQL schema
types/               # TypeScript types
docs/                # Documentation
```
---

### 💬 Communication
- Use pull requests for changes
- Prefix commits with feature tags: `[feat]`, `[fix]`, `[docs]`, `[test]`

### 🪄 Maintainers
Lead Developer: Daniel Akoko  
Repo Maintainer: Daniel Akoko
