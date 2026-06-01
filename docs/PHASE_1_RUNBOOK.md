# Phase 1 Runbook

Last updated: 2026-06-01

This runbook verifies the Phase 1 foundation for CyberMilo.

## Source Of Truth

Use this schema only:

```text
supabase_schema.sql
```

Do not apply `webapp/DATABASE_SCHEMA.sql`; it is now only a pointer to the root schema.

## Required Services

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- Supabase project configured with `supabase_schema.sql`

## Environment Files

Frontend:

```text
webapp/.env
```

Backend:

```text
backend/.env
```

The backend must have:

```text
SUPABASE_SERVICE_ROLE_KEY
```

The service-role key must never be placed in the frontend.

## Phase 1 Verification Commands

Install backend dependencies once:

```bash
cd backend
npm install
```

Seed demo data:

```bash
npm run seed:demo
```

Run backend:

```bash
npm run dev
```

Run smoke check in a second terminal:

```bash
cd backend
npm run smoke:phase1
```

Build frontend:

```bash
cd webapp
npm run build
```

## Demo Logins

```text
Super admin: superadmin@cybermilo.test / CyberMilo@123
School admin: admin@greenvalley.test / SchoolAdmin@123
```

## Browser Checks

Check these screens manually:

- `/login`
- `/admin` as super admin
- `/dashboard` as school admin
- `/students`
- `/attendance`
- `/fees`
- `/settings`

## Phase 1 Acceptance Criteria

- Frontend build passes.
- Backend syntax checks pass.
- Backend health returns `ok=true`.
- Demo seed succeeds.
- Smoke check succeeds.
- Super admin can log in and see HQ sidebar.
- School admin can log in and see school ERP sidebar.
- Dashboard has seeded demo data.
- No conflicting schema file remains as an alternate source of truth.

## Current Phase 1 Status

Phase 1 is complete when all verification commands above pass in the local environment.
