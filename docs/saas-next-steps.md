# CyberMilo SaaS Next Steps

Use this file to continue the SaaS build later without needing to reconstruct the plan.

## Completed So Far

- SaaS feature and plan registry for frontend/backend.
- Feature gates for enabled modules.
- Usage tracking and Super Admin usage board.
- Billing/trial fields, billing gate, plan limits, and over-limit warnings.
- Tenant user management API and UI.
- Role-based frontend routing and sidebar permissions.
- Role-aware Supabase RLS write policies.
- Audit logging and Super Admin audit feed.
- Guided tenant provisioning flow.
- Institution admin first-login checklist.
- Super Admin tenant health score, filters, and tenant detail panel.

## Next Steps

### 1. Add Actions Inside Tenant Detail

Goal: Super Admin should manage one tenant from the detail panel without scrolling to other sections.

Add inside the tenant detail panel:

- Change plan.
- Update subscription status.
- Toggle modules.
- Invite user.
- Enable/disable tenant users.
- Link to filtered audit events for that tenant.

Files likely involved:

- `webapp/src/pages/Admin/AdminConsolePage.jsx`
- `webapp/src/lib/adminApi.js`
- `webapp/src/lib/usersApi.js`

Verification:

- Run `npm run build` in `webapp`.
- Test selecting a tenant and performing each action.

### 2. Add Tenant Notes and Follow-Up Tasks

Goal: Super Admin can record support notes and follow-ups per tenant.

Suggested data shape:

- Add `tenant_notes` table or store lightweight notes in `institutions.settings.support_notes`.
- Each note should include author, body, priority, due date, status, created_at.

Recommended approach:

- Prefer a new `tenant_notes` table for auditability and filtering.
- Add backend endpoints under `/api/admin/tenant-notes`.
- Show notes inside the tenant detail panel.

### 3. Add Onboarding Progress to Super Admin

Goal: Super Admin can see which tenants are stuck during setup.

Add to tenant health/detail:

- Onboarding percent.
- Missing setup tasks.
- Last setup activity.
- Whether checklist was dismissed.

Useful signals:

- Institution profile complete.
- First admin created.
- Students added.
- Attendance recorded.
- Fee payment recorded.
- Announcement sent.

### 4. Add Tenant Impersonation or Assisted Login

Goal: Super Admin can support tenants faster.

Safer options:

- Add "support mode" that shows tenant data in Super Admin console without logging in as the tenant.
- Avoid full impersonation at first unless strong audit logging and permissions are in place.

Required:

- Audit every support access.
- Show a visible "Support Mode" banner.
- Restrict destructive actions.

### 5. Move More Writes Behind Backend APIs

Goal: Reduce direct Supabase writes from frontend pages.

Priority modules:

- Students
- Fees
- Attendance
- Exams
- Admissions
- Transport
- Communication

Approach:

- Add backend routes per module.
- Keep RLS in place as backup protection.
- Make frontend call backend APIs for write actions.

### 6. Add Billing Provider Integration

Goal: Replace manual subscription status with real payment/subscription events.

Options:

- Razorpay for India-focused billing.
- Stripe if international billing is needed.

Needed:

- Checkout/session creation.
- Webhook verification.
- Subscription lifecycle updates.
- Invoice/payment history in Super Admin.
- Tenant billing page.

### 7. Add Notifications

Goal: Make account risks visible without manually checking the console.

Notifications to add:

- Trial ending soon.
- Trial expired.
- Past due.
- Over user/student limits.
- No activity for 7+ days.
- Tenant setup incomplete.

Possible delivery:

- In-app notification table.
- Email later.
- WhatsApp/SMS later if enabled.

### 8. Add Reporting and Export

Goal: Super Admin can export tenant, usage, billing, and health data.

Add:

- CSV export for institutions.
- CSV export for audit feed.
- Usage report by tenant and feature.
- Monthly SaaS health report.

### 9. Improve Mobile and Visual QA

Goal: Make the Super Admin console comfortable on smaller screens.

Check:

- Admin Console table overflow.
- Tenant detail panel spacing.
- Guided provisioning form.
- Dashboard onboarding checklist.
- Settings users table.

Verification:

- Run app locally.
- Test desktop and mobile viewport.
- Use Playwright screenshots if available.

### 10. Create Seed/Test Data

Goal: Make SaaS testing repeatable.

Add seed data for:

- Healthy tenant.
- Risk tenant.
- Trial expired tenant.
- Over-limit tenant.
- Tenant with usage events.
- Tenant with audit events.

Files likely involved:

- `backend/scripts/seed-demo-data.js`
- `supabase_schema.sql`

## Useful Commands

```bash
cd webapp
npm run build
```

```bash
cd backend
node --check src/routes/admin.js
node --check src/routes/users.js
node --check src/routes/usage.js
node --check src/server.js
```

## Important Reminder

Whenever `supabase_schema.sql` changes, apply it to the Supabase database before expecting production behavior to match the local code.
