# CyberMilo — Multi-Tenant Education ERP (SaaS)

CyberMilo is a multi-tenant SaaS education ERP for schools, colleges, universities,
and coaching centers. Each institution runs in its own tenant with plan-based
feature gating, role-aware dashboards, and an AI assistance layer.

## Repository Structure

| Path | What it is |
|------|-----------|
| `src/`, `index.html`, `vite.config.js` | The React 18 + Vite web application (the product UI) — lives at repo root so hosting platforms that build from the root (e.g. Hostinger) find `package.json` directly |
| `backend/` | Express (Node.js) admin/API service — SaaS console, tenant + user management, usage |
| `mysql_schema.sql` | MySQL/MariaDB schema (converted from the Supabase schema) for hosts without Postgres |
| `supabase_schema.sql` | Full Postgres database schema with RLS policies — run in the Supabase SQL editor |
| `docs/` | Master plan, roadmaps, phase tracker, SaaS next steps, webapp reference docs |
| `assets/` | CyberMilo brand assets (icon, logo, splash) for the future mobile app |

> The former root-level React Native app was an unused shopping-template
> scaffold, removed on 2026-07-12 (recoverable from git history). The webapp
> itself was moved from `webapp/` to the repo root on 2026-07-12 so that
> hosting platforms with a fixed build root (Hostinger's Web App product
> locks "Root directory" to `./` and cannot be reconfigured) can build it
> without a proxy `package.json`.

## Stack

- **Frontend:** React 18, Vite 5, Tailwind CSS 4, Recharts, Framer Motion
- **Backend:** Express (Node.js)
- **Database / Auth / Realtime / Storage:** Supabase (PostgreSQL with RLS)
- **AI:** OpenRouter (multi-model LLM access)

## Quick Start

### Web app (repo root)
```bash
npm install
npm run dev
```

### Backend API
```bash
cd backend
npm install
npm run dev
```

### Environment
1. Copy `.env.example` to `.env` and set:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_OPENROUTER_API_KEY`
   - `VITE_OPENROUTER_MODEL`
2. Apply `supabase_schema.sql` in the Supabase SQL editor (idempotent — safe to re-run).
3. In Supabase → Authentication → URL Configuration, add `<your-app-url>/reset-password`
   to the Redirect URLs list (required for the password reset flow).

Never commit credentials. If any were exposed, rotate them in the provider dashboards.

## Key Docs

- Master plan: `docs/ERP_MASTER_PLAN.md`
- Production roadmap: `docs/PRODUCTION_ROADMAP.md` and `docs/FEATURE_ROADMAP_2026.md`
- SaaS build continuation: `docs/saas-next-steps.md`
- Phase tracker: `docs/PHASE_WISE_COMPLETION.md`

## Knowledge Graph

`graphify-out/` contains a navigable knowledge graph of this codebase
(`graph.html` for the interactive view, `GRAPH_REPORT.md` for the audit).
Rebuild with `/graphify --update` after significant changes.
