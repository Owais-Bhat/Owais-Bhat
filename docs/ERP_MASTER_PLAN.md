# Premium Multi-Institution ERP (Node + Supabase) — Master Plan

> **Note (2026-07-12):** this plan originally specified a FastAPI/Python backend.
> The implemented backend is **Express/Node** (`backend/`); the tech sections
> below have been updated to match reality.

## 1) Product Vision
Build a premium, white-label, multi-tenant education ERP that supports schools, colleges, coaching institutes, and universities across web and mobile with role-aware dashboards and real-time communication.

## 2) Technology Architecture
- **Backend API**: Express (Node.js)
- **Database/Auth/Storage**: Supabase (PostgreSQL + Auth + Storage)
- **Authorization**: Role + Permission + Row Level Security (RLS)
- **Realtime/Queue**: Supabase Realtime + Celery/Redis for jobs
- **Web App**: React/Next.js admin panel (responsive)
- **Mobile Apps**: React Native (Student/Parent/Teacher)
- **Observability**: OpenTelemetry + structured logs

## 3) Multi-Tenant Model
- Tenant = Institution/Branch
- `tenant_id` appears in all business tables
- Every query filtered by `tenant_id`
- Super Admin has cross-tenant access with audited actions

## 4) Access Model
- Super Admin
- Organization Owner / Director / Principal
- Branch Admin
- Reception/Enquiry
- Accountant
- HR
- Teacher
- Student
- Parent
- Librarian / Warden / Transport Manager

Permission strategy:
- Role templates + custom permission matrix per tenant
- Module-level + record-level checks
- Action audit logs for sensitive operations

## 5) Domain Modules
1. Super Admin / Multi-Branch
2. Admission & Enquiry CRM
3. Student Management
4. Attendance (manual/QR/RFID/biometric/face-ready)
5. Fees & Accounts
6. Academics
7. Timetable
8. Exam & Result
9. LMS / Online Learning
10. Coaching-Specific
11. University-Specific
12. Communication
13. Parent App
14. Student App
15. Teacher App
16. Transport
17. Hostel
18. Library
19. HR & Payroll
20. Inventory & Assets
21. Reports & Analytics
22. Advanced / AI Features
23. Web + Mobile + PWA
24. Security & Compliance

## 6) Suggested Build Sequence (Execution Plan)
### Phase 0 — Foundation (Weeks 1–2)
- Project setup (Express + Supabase)
- Auth, user profile, tenant model, role/permission engine
- Design system tokens + responsive shell
- Audit logging + file storage + backup jobs

### Phase 1 — Core Operations (Weeks 3–8)
- Admission CRM + Student lifecycle
- Attendance + timetable basics
- Fees, invoices, receipts, online payment integration
- Communication center (SMS/Email/WhatsApp templates)

### Phase 2 — Academic Depth (Weeks 9–14)
- Subjects/courses/chapters/lesson plans
- Exams, grading, report cards, certificates
- Parent, teacher, student mobile experiences

### Phase 3 — Institution Extensions (Weeks 15–20)
- Transport, hostel, library, inventory, payroll
- Coaching and university-specific workflows
- Accreditation/NAAC/NBA records

### Phase 4 — Intelligence & Premium Features (Weeks 21+)
- AI insights (dropout, weak subject, fee risk)
- Face/voice integrations via pluggable connectors
- Custom report builder and workflow automation

## 7) Initial Supabase Schema Blueprint
Core tables to create first:
- `tenants`, `branches`, `users_profile`
- `roles`, `permissions`, `role_permissions`, `user_roles`
- `leads`, `admissions`, `students`, `guardians`
- `classes`, `sections`, `subjects`, `batches`, `enrollments`
- `attendance_sessions`, `attendance_records`
- `fee_heads`, `fee_plans`, `invoices`, `invoice_items`, `payments`, `refunds`
- `notifications`, `message_logs`
- `audit_logs`

All rows include:
- `id uuid primary key`
- `tenant_id uuid not null`
- `created_at`, `updated_at`
- `created_by`, `updated_by` when relevant

## 8) UI/UX Requirements (Dribbble-aligned)
- Clean card-based dashboard
- Left sidebar + top command/search bar
- Responsive behavior:
  - Mobile: bottom nav + collapsible modules
  - Tablet: hybrid nav
  - Desktop: full sidebar and data grids
- Data table standards:
  - sticky headers
  - server-side filter/sort
  - saved views
- Accessibility: keyboard navigation + AA contrast baseline

## 9) Security Controls
- Supabase RLS on every tenant-scoped table
- 2FA/OTP login option
- IP/device session tracking
- encryption in transit + at rest
- signed URLs for secure documents
- daily backups + restore drills

## 10) KPI Dashboard Starter
- Admissions funnel conversion
- Attendance compliance
- Fee collection rate
- Outstanding dues aging
- Teacher workload and class coverage
- Branch profitability

## 11) Delivery Strategy
- Ship vertical slices by role (Reception, Admin, Teacher, Parent)
- Run pilot with one branch first
- Expand with feature flags per module
- White-label config per tenant (logo/theme/domain)
