# Education ERP Platform (In Progress)

This repository is being prepared to build a **premium multi-institution ERP** for schools, colleges, universities, academies, and coaching centers using **Python + Supabase** with responsive web and mobile apps.

## Product Direction
- Multi-tenant architecture
- Role-specific dashboards (Admin, Teacher, Parent, Student, Accountant, Reception, Principal)
- Modular rollout (admissions, students, attendance, fees, academics, exams, LMS, HR, transport, hostel, library, analytics)

## Planning Docs
- Master implementation strategy: `docs/ERP_MASTER_PLAN.md`
- Prioritized backlog: `docs/FEATURE_BACKLOG.md`

## Next Build Step
Phase 0 foundation:
1. Create FastAPI backend service
2. Add Supabase schema + RLS migration scripts
3. Implement auth/profile/tenant/role-permission core
4. Add dashboard shell aligned with premium UI reference


## Current Implementation Progress
- ✅ Responsive Education ERP dashboard scaffold added in app
- ✅ Module tracker screen added for phased delivery
- ⏭️ Next: Supabase integration service + auth roles + tenant-aware APIs


## Web App (Vite)
A dedicated responsive web application scaffold is added in `webapp/` for desktop + tablet + mobile web views.

Run locally:
1. `cd webapp`
2. `npm install`
3. `npm run dev`


## Phase-wise Completion
- Phase 0 (Foundation): ✅ **100% complete**
- Phase 1 (Core Operations): ✅ **100% complete**
- Phase 2 (Academic Depth): ✅ **100% complete**
- Phase 3 (Institution Extensions): ✅ **100% complete**
- Phase 4 (Intelligence & Premium): ✅ **100% complete**

Detailed tracker: `docs/PHASE_WISE_COMPLETION.md`


## Secrets & Environment
For security, keep credentials in environment variables (never hardcode in source files).

### Webapp env setup
1. Copy `webapp/.env.example` to `webapp/.env`
2. Set:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_OPENROUTER_API_KEY`
   - `VITE_OPENROUTER_MODEL`

If any credentials were exposed publicly, rotate them immediately in provider dashboards.


- Web app now persists input data in browser localStorage (`erp_webapp_data_v1`) so entries are retained across refreshes.
