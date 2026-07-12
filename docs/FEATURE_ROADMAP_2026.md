# CyberMilo — Full Production Feature Roadmap

Written July 2026. This builds on `saas-next-steps.md` (SaaS/tenant work) and covers the
product features needed to make CyberMilo a complete, sellable education ERP for Indian
schools, colleges, and coaching centers.

Legend: 🔴 launch-blocking · 🟡 strong differentiator · 🟢 nice to have

---

## 1. Production Hardening (do these before selling) 🔴

- **Password reset flow** — the "Forgot password?" link currently shows a "not enabled"
  toast. Wire Supabase `resetPasswordForEmail` + a reset page. This is table stakes.
- **Email verification on signup** and a resend-verification screen.
- **Razorpay billing integration** — checkout, webhooks, subscription lifecycle,
  invoices. Currently subscription status is manual (see saas-next-steps §6).
- **Move writes behind the backend API** — frontend still writes directly to Supabase
  for most modules (saas-next-steps §5). Priority: Fees, Students, Attendance.
- **Rotate the Supabase and OpenRouter keys** — they were shared publicly during
  development. Move OpenRouter calls server-side; a `VITE_`-prefixed AI key ships to
  every browser and can be drained by anyone.
- **Error monitoring** — Sentry (free tier) for frontend + backend.
- **Automated backups + restore drill** for the Supabase database.
- **Terms of Service / Privacy Policy pages** — required for payments and app stores.
- **Rate limiting** on backend routes (express-rate-limit) and on AI endpoints.
- **Playwright smoke tests** for the golden path: register → add student → mark
  attendance → record fee → send announcement.

## 2. Academic Core (module depth) 🔴/🟡

- **Timetable / class schedule builder** 🔴 — periods, teacher assignment, clash
  detection, weekly grid per class and per teacher. Most-requested ERP feature after
  attendance; you have no timetable module today.
- **Report cards / marksheets** 🔴 — exam results exist, but schools need printable
  CBSE/state-board style report cards (PDF) with grade computation, co-scholastic
  areas, and principal signature block.
- **Homework / assignments** 🟡 — teacher posts homework per class, students submit,
  teacher grades. Fits into the existing LMS tables.
- **Staff/HR module** 🟡 — teacher records, staff attendance, leave requests and
  approvals, and later payroll export.
- **Library management** 🟢 — catalog, issue/return, fines.
- **Hostel management** 🟢 — rooms, allocation, attendance (for residential schools).
- **Inventory/assets** 🟢 — labs, sports equipment, uniforms.
- **Certificate generator** 🟡 — transfer certificates, bonafide certificates,
  character certificates from templates. Huge time-saver for school offices in India.

## 3. Fees & Finance 🔴/🟡

- **Fee structures** 🔴 — define fee heads (tuition, transport, lab) per class/term
  and auto-generate dues, instead of entering each payment ad hoc.
- **Online fee payment by parents** 🔴 — Razorpay payment links or an embedded parent
  checkout; auto-reconcile into the fees table. This alone sells the product.
- **Receipts as PDF** 🔴 — numbered, GST-compliant fee receipts.
- **Fee reminders via WhatsApp/SMS** 🟡 — see §5; overdue detection already exists.
- **Concessions/scholarships** 🟡 — sibling discount, staff ward, merit waivers.
- **Expense tracking + simple P&L** 🟢 — many small schools run books in Excel.

## 4. Parent & Student Experience 🟡

- **Parent-student linking** 🔴 — a `guardians` relation so one parent account sees
  its children only. The parent role exists but currently has no scoped child view.
- **Progressive Web App (PWA)** 🟡 — manifest + service worker so parents "install"
  CyberMilo from the browser. Much cheaper than finishing the React Native app first.
- **Push notifications** 🟡 — web push for announcements, absence alerts, fee dues.
- **Absence alerts** 🟡 — auto-notify the parent when a student is marked absent.
- **Student/parent self-service** 🟢 — download receipts, report cards, certificates.
- **Leave application** 🟢 — parent applies for student leave, teacher approves.

## 5. Communication Expansion 🟡

- **WhatsApp Business API integration** 🟡 — the single highest-impact channel for
  Indian schools (announcements, fee reminders, absence alerts). Providers: Interakt,
  Gupshup, or Meta Cloud API directly.
- **SMS fallback** (MSG91/Twilio) for feature phones.
- **Email digests** (Resend/SES) — weekly parent summary, admin reports.
- **In-app notification center** 🔴 — a real notifications table + bell dropdown; the
  TopBar bell is currently decorative. Also covers SaaS alerts (trial expiry etc.,
  saas-next-steps §7).

## 6. AI Differentiators (you already have OpenRouter wired) 🟡

- **AI question-paper generator** — teacher picks subject/chapters/difficulty, gets a
  printable paper + answer key. Very strong demo feature.
- **AI report-card remarks** — generate personalized teacher remarks from grades and
  attendance; teacher edits and approves.
- **AI attendance/performance insights** — weekly natural-language digest for the
  principal ("Class 8B attendance dropped 12% this week...").
- **AI admission-inquiry chatbot on a public page** — capture leads into Admissions.
- **AI lesson-plan generator** for teachers (grade + topic + duration → plan).
- **Move all AI calls server-side** 🔴 — with per-tenant usage metering so AI becomes
  a billable plan feature (Pro plan upsell).

## 7. Reporting & Analytics 🟡

- **Report builder page** — attendance registers, fee collection/defaulter lists,
  exam analysis; filter by class/section/date; export CSV + PDF.
- **Principal dashboard** — cross-class comparisons, teacher activity, fee trends.
- **UDISE+ export helpers** 🟢 — Indian schools must file UDISE data yearly; even a
  partial export is a selling point.

## 8. Platform / SaaS (continues saas-next-steps.md)

- Tenant detail actions, tenant notes, onboarding progress, support mode,
  seed/demo data — all still valid, see that file.
- **Public marketing site + pricing page** 🔴 — you cannot sell without one
  (the `/rank-boost` skill can optimize it once it exists).
- **Demo tenant with sample data** 🔴 — "Try the demo" button on the marketing site.
- **Custom subdomain per tenant** 🟢 — `dps-srinagar.cybermilo.com`.
- **Hindi/Urdu localization** 🟢 — i18n scaffold now, translations later.

---

## Suggested build order (next 90 days)

| Phase | Weeks | Scope |
|-------|-------|-------|
| 1. Sellable | 1–3 | Password reset, parent-student linking, fee structures + PDF receipts, in-app notifications, key rotation |
| 2. Money | 4–6 | Razorpay (SaaS billing + parent fee payments), marketing site + demo tenant |
| 3. Sticky | 7–10 | Timetable, report cards, WhatsApp notifications, PWA |
| 4. Wow | 11–13 | AI question papers + AI remarks (server-side, metered), report builder |

The theme of the ordering: everything in Phase 1–2 removes a reason a school would say
"no"; Phase 3 removes reasons they'd churn; Phase 4 gives the sales demo its wow moment.
