# CyberMilo Production Roadmap

Last updated: 2026-05-31

This roadmap tracks the path from the current CyberMilo prototype/foundation to a production SaaS school ERP.

## Current Status

| Area | Status | Notes |
| --- | --- | --- |
| Frontend app shell | In progress | Vite React app, protected routes, layout, sidebar, dashboard, auth screens |
| UI redesign | In progress | New design system started; remaining pages still need polish |
| Supabase schema | In progress | Main schema exists, but `supabase_schema.sql` and `webapp/DATABASE_SCHEMA.sql` should be reconciled |
| Auth | In progress | Login/register exists; production invitation/reset/account lifecycle needs hardening |
| SaaS admin | Started | `/admin` page and secure backend admin API added |
| Core ERP modules | Partial | Students, attendance, fees, exams, admissions, transport, LMS, communication screens exist but need production-depth workflow testing |
| AI features | Partial | AI pages exist; need saved outputs, guardrails, audit history, and real workflow integration |
| Deployment | Not started | Needs frontend/backend hosting, env separation, monitoring |
| Real data migration | Not started | Needs importer/seed scripts and validation |

## Completion Estimate

| Target | Estimate |
| --- | --- |
| Demo-ready MVP | 3-7 days |
| Production beta | 4-6 weeks |
| Solid SaaS launch | 8-12 weeks |
| Market-differentiated product | 3-6 months |

## Phase 1: Foundation Stabilization

**Estimated time:** 3-5 days

**Goal:** Make the current codebase stable, consistent, and testable.

### Tasks

- Finalize one source-of-truth database schema.
- Configure frontend `.env`.
- Configure backend `.env`.
- Create first `super_admin`.
- Test login, logout, register, protected routes.
- Remove or redirect every dead route.
- Fix remaining UI contrast, spacing, icon, and responsive issues.
- Add demo/seed data for development.
- Document setup steps.

### Deliverables

- Stable local app on `localhost:5173`.
- Stable backend API on `localhost:5000`.
- Working login and dashboard.
- Working `/admin` route for `super_admin`.
- Clean setup instructions.

### Acceptance Criteria

- `npm run build` passes in `webapp`.
- Backend starts with `npm run dev`.
- No visible broken routes in sidebar or dashboard actions.
- Login/register inputs render correctly.
- A `super_admin` can open `/admin`.

## Phase 2: SaaS Admin Platform

**Estimated time:** 1 week

**Goal:** Allow the CyberMilo platform owner to manage school accounts.

### Tasks

- Complete Admin Console UI.
- Create institution from `/admin`.
- Create first institution admin.
- Invite institution users.
- Change subscription plan.
- Suspend/unsuspend institution.
- Show account health and usage.
- Add admin activity logs.
- Add backend validation for admin API payloads.
- Add audit trail for all admin API actions.

### Deliverables

- Production-oriented SaaS admin panel.
- Secure backend service-role operations.
- Institution account lifecycle.

### Acceptance Criteria

- Browser never receives `SUPABASE_SERVICE_ROLE_KEY`.
- Only active `super_admin` users can call `/api/admin/*`.
- Institution creation creates:
  - `institutions` record
  - Supabase auth user
  - linked `user_profiles` row
- Suspension disables institution users.

## Phase 3: Core ERP Operations

**Estimated time:** 2-3 weeks

**Goal:** Make the main school workflows usable for daily operations.

### Modules

- Students
- Classes
- Teachers
- Attendance
- Fees
- Exams
- Admissions

### Tasks

- Complete CRUD for each module.
- Add strong validation.
- Add empty/loading/error states.
- Add search, filters, sorting, and pagination.
- Add CSV import/export.
- Add bulk student import.
- Add attendance marking workflow.
- Add fee structures and fee payment records.
- Add receipts.
- Add exam creation and result entry.
- Add admissions pipeline states.

### Deliverables

- School admin can run daily operations.
- Staff can manage real student data.
- Basic operational reports exist.

### Acceptance Criteria

- CRUD works against Supabase for all core entities.
- Tenant data is isolated by `institution_id`.
- Forms reject invalid required data.
- Dashboard numbers match database records.

## Phase 4: Communication And Parent Layer

**Estimated time:** 1-2 weeks

**Goal:** Connect school staff with parents and students.

### Tasks

- Build announcement workflow.
- Build parent messaging workflow.
- Add message history per student.
- Add notification templates.
- Add email integration.
- Add WhatsApp/SMS provider integration.
- Add communication permissions by role.

### Deliverables

- Staff can send parent updates.
- Communication history is traceable.
- Important events can notify parents.

### Acceptance Criteria

- Messages are stored in database.
- Parent contact info is pulled from student records.
- Failed sends are visible.
- Templates can be reused.

## Phase 5: Reports And Documents

**Estimated time:** 1-2 weeks

**Goal:** Support official school paperwork and reporting.

### Tasks

- Fee receipt PDF.
- Student profile PDF.
- Attendance report.
- Exam report card.
- Admission form export.
- CSV/PDF exports.
- Printable views.
- Report filters by class, section, date, and student.

### Deliverables

- Schools can generate usable documents.
- Reports can be shared or printed.

### Acceptance Criteria

- PDFs include institution identity.
- Currency/date formatting is consistent.
- Report totals match source data.

## Phase 6: AI Differentiation

**Estimated time:** 2-3 weeks

**Goal:** Make CyberMilo feel smarter than a generic ERP.

### Features

- Student 360 AI summary.
- Fee recovery assistant.
- Parent message generator.
- Attendance risk alerts.
- Performance insights.
- Career path suggestions.
- Admin daily brief.

### Tasks

- Save AI outputs to database.
- Add AI prompt/version audit trail.
- Add staff review before sending AI-generated messages.
- Add institution-level AI settings.
- Add safety rules for sensitive student/fee content.

### Deliverables

- AI features tied to real ERP workflows.
- AI assists staff without taking unsafe actions automatically.

### Acceptance Criteria

- AI output can be reviewed before use.
- AI actions are logged.
- AI does not expose data across tenants.

## Phase 7: Security And Production Hardening

**Estimated time:** 1-2 weeks

**Goal:** Make the system safe for real schools.

### Tasks

- Review all RLS policies.
- Create role permission matrix.
- Harden backend auth.
- Add request validation.
- Add rate limiting.
- Add server-side logs.
- Add error monitoring.
- Add database backup strategy.
- Add environment separation:
  - local
  - staging
  - production
- Add audit logs for important actions.

### Deliverables

- Production-safe auth and data access model.
- Clear operational security setup.

### Acceptance Criteria

- Tenant users cannot read another tenant's data.
- Service-role key exists only on backend/deployment server.
- Suspended users cannot operate.
- Admin actions are traceable.

## Phase 8: Deployment

**Estimated time:** 3-5 days

**Goal:** Launch CyberMilo online.

### Tasks

- Deploy frontend.
- Deploy backend.
- Configure production Supabase.
- Configure domain and SSL.
- Configure environment variables.
- Add monitoring.
- Add health checks.
- Smoke test all critical flows.

### Deliverables

- Live frontend URL.
- Live backend API.
- Production database.
- Admin credentials.

### Acceptance Criteria

- Login works in production.
- `/admin` works for `super_admin`.
- Dashboard loads real data.
- Backend `/health` returns OK.

## Phase 9: Pilot School

**Estimated time:** 2-4 weeks

**Goal:** Validate CyberMilo with real school users and real data.

### Tasks

- Collect school data.
- Clean and map data.
- Import students/classes/teachers/fees.
- Train admins and staff.
- Run daily attendance/fees workflows.
- Collect feedback.
- Fix workflow gaps.
- Improve UX based on real usage.

### Deliverables

- Real pilot school running CyberMilo.
- Feedback-backed production improvements.

### Acceptance Criteria

- School can complete daily attendance.
- Fee records and totals are correct.
- Staff can find students quickly.
- Admin can onboard users.
- No critical data-isolation bugs.

## Recommended Build Order

1. Foundation stabilization
2. SaaS admin
3. Students/classes/teachers
4. Attendance
5. Fees
6. Exams and reports
7. Communication
8. AI
9. Security hardening
10. Deployment
11. Pilot school

## Production Risk Register

| Risk | Severity | Mitigation |
| --- | --- | --- |
| Service-role key exposed in frontend | Critical | Keep all service-role actions in backend only |
| RLS gaps | Critical | Review policies before production |
| Fee/accounting bugs | High | Add tests and reconciliation reports |
| Messy real data | High | Build importer and validation reports |
| No audit logs | High | Add activity logs for admin and financial actions |
| AI sends wrong message | Medium | Require human review before send |
| UI inconsistency | Medium | Finish design system migration |
| Missing parent communication | Medium | Add WhatsApp/SMS/email integration |

## Definition Of Production Ready

CyberMilo is production-ready when:

- Auth, roles, and tenant isolation are verified.
- Core ERP modules work with real data.
- Admin Console manages institutions securely.
- Fee, attendance, and exam records are accurate.
- Reports and receipts can be generated.
- Admin actions are audited.
- Frontend and backend are deployed with separate production env vars.
- A pilot school can use the system for daily operations without developer help.
