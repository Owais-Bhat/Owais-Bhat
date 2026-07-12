# CyberMilo — Multi-Tenant Education ERP (SaaS)

CyberMilo is a multi-tenant SaaS education ERP for schools, colleges, universities,
and coaching centers. Each institution runs in its own tenant with plan-based
feature gating, role-aware dashboards, and an AI assistance layer.

## Repository Structure

| Path | What it is |
|------|-----------|
| `webapp/` | React 18 + Vite web application (the product UI) |
| `backend/` | Express (Node.js) admin/API service — SaaS console, tenant + user management, usage |
| `supabase_schema.sql` | Full database schema with RLS policies — run in the Supabase SQL editor |
| `docs/` | Master plan, roadmaps, phase tracker, SaaS next steps |
| `assets/` | CyberMilo brand assets (icon, logo, splash) for the future mobile app |

> The former root-level React Native app was an unused shopping-template
> scaffold and was removed on 2026-07-12 (recoverable from git history).
> `app.json` + `assets/` are kept ready for a real CyberMilo mobile app.

## Stack

- **Frontend:** React 18, Vite 5, Tailwind CSS 4, Recharts, Framer Motion
- **Backend:** Express (Node.js)
- **Database / Auth / Realtime / Storage:** Supabase (PostgreSQL with RLS)
- **AI:** OpenRouter (multi-model LLM access)

## Quick Start

### Web app
```bash
cd webapp
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
1. Copy `webapp/.env.example` to `webapp/.env` and set:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_OPENROUTER_API_KEY`
   - `VITE_OPENROUTER_MODEL`
2. Apply `supabase_schema.sql` in the Supabase SQL editor (idempotent — safe to re-run).
3. In Supabase → Authentication → URL Configuration, add `<your-app-url>/reset-password`
   to the Redirect URLs list (required for the password reset flow).

Never commit credentials. If any were exposed, rotate them in the provider dashboards.

## Key Docs

- Product blueprint: `CYBERMILO_DOCUMENTATION.md`
- Master plan: `docs/ERP_MASTER_PLAN.md`
- Production roadmap: `docs/PRODUCTION_ROADMAP.md` and `docs/FEATURE_ROADMAP_2026.md`
- SaaS build continuation: `docs/saas-next-steps.md`
- Phase tracker: `docs/PHASE_WISE_COMPLETION.md`

## Knowledge Graph

`graphify-out/` contains a navigable knowledge graph of this codebase
(`graph.html` for the interactive view, `GRAPH_REPORT.md` for the audit).
Rebuild with `/graphify --update` after significant changes.
