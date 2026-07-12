# Graph Report - E:\work\Owais-Bhat  (2026-07-12)

## Corpus Check
- 132 files · ~131,744 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 580 nodes · 1012 edges · 49 communities (42 shown, 7 thin omitted)
- Extraction: 98% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 12 edges (avg confidence: 0.88)
- Token cost: 377,746 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_SaaS Backend & Feature Gating|SaaS Backend & Feature Gating]]
- [[_COMMUNITY_Roles & Permissions UI|Roles & Permissions UI]]
- [[_COMMUNITY_Product Vision & Docs|Product Vision & Docs]]
- [[_COMMUNITY_Mobile App Dependencies|Mobile App Dependencies]]
- [[_COMMUNITY_Webapp Dependencies|Webapp Dependencies]]
- [[_COMMUNITY_Auth & Notifications Layer|Auth & Notifications Layer]]
- [[_COMMUNITY_Super Admin Console|Super Admin Console]]
- [[_COMMUNITY_Expo App Config|Expo App Config]]
- [[_COMMUNITY_Auth Pages & Toasts|Auth Pages & Toasts]]
- [[_COMMUNITY_Mobile App Shell|Mobile App Shell]]
- [[_COMMUNITY_Layout & Communication UI|Layout & Communication UI]]
- [[_COMMUNITY_Helper Utilities|Helper Utilities]]
- [[_COMMUNITY_Backend Dependencies|Backend Dependencies]]
- [[_COMMUNITY_Routing & Guards|Routing & Guards]]
- [[_COMMUNITY_OpenRouter AI Functions|OpenRouter AI Functions]]
- [[_COMMUNITY_Demo Data Seeder|Demo Data Seeder]]
- [[_COMMUNITY_AI Tutor UI|AI Tutor UI]]
- [[_COMMUNITY_Mobile Layout & Cart|Mobile Layout & Cart]]
- [[_COMMUNITY_Mobile Drawer Screens|Mobile Drawer Screens]]
- [[_COMMUNITY_Dashboard Widgets|Dashboard Widgets]]
- [[_COMMUNITY_Students Module|Students Module]]
- [[_COMMUNITY_Branding & Splash Assets|Branding & Splash Assets]]
- [[_COMMUNITY_Mobile Tab Navigation|Mobile Tab Navigation]]
- [[_COMMUNITY_Mobile Header & Profile|Mobile Header & Profile]]
- [[_COMMUNITY_Career Path Page|Career Path Page]]
- [[_COMMUNITY_Attendance Module|Attendance Module]]
- [[_COMMUNITY_Exams Module|Exams Module]]
- [[_COMMUNITY_Fees Module|Fees Module]]
- [[_COMMUNITY_Mobile Admissions Screen|Mobile Admissions Screen]]
- [[_COMMUNITY_Mobile Students Screen|Mobile Students Screen]]
- [[_COMMUNITY_LMS Module|LMS Module]]
- [[_COMMUNITY_Fee Recovery Page|Fee Recovery Page]]
- [[_COMMUNITY_Mobile Home Screen|Mobile Home Screen]]
- [[_COMMUNITY_Favicon Branding|Favicon Branding]]
- [[_COMMUNITY_Placeholder App Icon|Placeholder App Icon]]
- [[_COMMUNITY_OnlineMart Leftover Logo|OnlineMart Leftover Logo]]
- [[_COMMUNITY_Android Adaptive Icon|Android Adaptive Icon]]
- [[_COMMUNITY_Claude Permissions Config|Claude Permissions Config]]
- [[_COMMUNITY_Mobile About Screen|Mobile About Screen]]
- [[_COMMUNITY_Product Details Screen|Product Details Screen]]

## God Nodes (most connected - your core abstractions)
1. `useNotification()` - 39 edges
2. `useAuth()` - 24 edges
3. `useAppData()` - 17 edges
4. `adminRequest()` - 12 edges
5. `callAI()` - 12 edges
6. `expo` - 11 edges
7. `adminClient` - 8 edges
8. `canAccessPath()` - 8 edges
9. `formatDate()` - 8 edges
10. `CyberMilo Admin API Package (Express)` - 8 edges

## Surprising Connections (you probably didn't know these)
- `ERP Master Plan (Python + Supabase)` --conceptually_related_to--> `CyberMilo Admin API Package (Express)`  [AMBIGUOUS]
  docs/ERP_MASTER_PLAN.md → backend/package.json
- `Phase-wise Completion Tracker` --references--> `OnlineMart Mobile App Package (Expo/React Native)`  [INFERRED]
  docs/PHASE_WISE_COMPLETION.md → package.json
- `CyberMilo Admin API Package (Express)` --implements--> `CyberMilo EduOS (Education ERP Product)`  [INFERRED]
  backend/package.json → CYBERMILO_DOCUMENTATION.md
- `Education ERP Webapp Package (Vite/React)` --implements--> `CyberMilo EduOS (Education ERP Product)`  [INFERRED]
  webapp/package.json → CYBERMILO_DOCUMENTATION.md
- `CyberMilo EduOS (Education ERP Product)` --semantically_similar_to--> `CyberMilo TravelOS (AI Tourism Intelligence OS)`  [INFERRED] [semantically similar]
  CYBERMILO_DOCUMENTATION.md → CYBERMILO_IMPLEMENTATION_GUIDE.md

## Hyperedges (group relationships)
- **Phase 1 Seed-and-Smoke Verification Flow** — phase_1_runbook, readme_cybermilo_admin_api, package_cybermilo_admin_api, seed_demo_data_script, phase1_smoke_check_script, supabase_schema_sql [EXTRACTED 1.00]
- **CyberMilo Planning and Roadmap Document Chain** — erp_master_plan, feature_backlog, production_roadmap, saas_next_steps, feature_roadmap_2026, phase_wise_completion [INFERRED 0.85]
- **CyberMilo EduOS Runtime Stack** — package_education_erp_webapp, package_cybermilo_admin_api, concept_supabase_platform, concept_openrouter_ai, concept_cybermilo_eduos [INFERRED 0.85]

## Communities (49 total, 7 thin omitted)

### Community 0 - "SaaS Backend & Feature Gating"
Cohesion: 0.05
Nodes (44): FEATURE_CATALOG, PLAN_DEFINITIONS, getRequestIp(), recordAuditEvent(), getBearerToken(), requireAuthenticatedProfile(), requireSuperAdmin(), requireTenantAdmin() (+36 more)

### Community 1 - "Roles & Permissions UI"
Cohesion: 0.06
Nodes (41): canAccessPath(), getRolePermissions(), ROLE_PERMISSIONS, Avatar(), getGradient(), getInitials(), GRADIENTS, SIZE_CLASSES (+33 more)

### Community 2 - "Product Vision & Docs"
Cohesion: 0.12
Nodes (37): CyberMilo API Reference Guide, OnlineMart Expo App Config, AI Itinerary Builder (TravelOS Flagship), CyberMilo EduOS (Education ERP Product), CyberMilo TravelOS (AI Tourism Intelligence OS), EduAI Engine (10 AI Features Layer), AI Fee Recovery Assistant, Glassmorphism Design System (+29 more)

### Community 3 - "Mobile App Dependencies"
Cohesion: 0.06
Nodes (33): dependencies, expo, @expo/metro-runtime, expo-status-bar, formik, install, npm, react (+25 more)

### Community 4 - "Webapp Dependencies"
Cohesion: 0.06
Nodes (33): dependencies, axios, classnames, date-fns, framer-motion, @headlessui/react, js-cookie, leaflet (+25 more)

### Community 5 - "Auth & Notifications Layer"
Cohesion: 0.08
Nodes (13): TYPE_ICONS, AuthContext, AuthProvider(), fetchNotifications(), markAllNotificationsRead(), markNotificationRead(), notifyInstitution(), subscribeToNotifications() (+5 more)

### Community 6 - "Super Admin Console"
Cohesion: 0.14
Nodes (22): DEFAULT_CREATE_FORM, ROLE_OPTIONS, adminRequest(), changeInstitutionPlan(), createAdminInstitution(), fetchAdminAudit(), fetchAdminFeatures(), fetchAdminInstitutions() (+14 more)

### Community 7 - "Expo App Config"
Cohesion: 0.10
Nodes (19): backgroundColor, foregroundImage, adaptiveIcon, expo, android, icon, ios, name (+11 more)

### Community 8 - "Auth Pages & Toasts"
Cohesion: 0.16
Nodes (12): PerformanceAnalysisPage(), ForgotPasswordPage(), LoginPage(), INSTITUTION_TYPES, RegisterPage(), STEPS, ResetPasswordPage(), NotificationCenter() (+4 more)

### Community 9 - "Mobile App Shell"
Cohesion: 0.18
Nodes (10): AuthContext, AuthProvider(), useAuth(), AppNavigator(), Stack, LoginScreen(), validationSchema, supabaseConfig (+2 more)

### Community 10 - "Layout & Communication UI"
Cohesion: 0.15
Nodes (7): CLASS_OPTIONS, EMPTY_FORM, STATUS_TABS, CommunicationPage(), PRIORITY_STYLES, TransportPage(), formatDate()

### Community 11 - "Helper Utilities"
Cohesion: 0.14
Nodes (4): Badge(), getInitials(), getStatusBadge(), truncateText()

### Community 12 - "Backend Dependencies"
Cohesion: 0.13
Nodes (14): dependencies, cors, dotenv, express, @supabase/supabase-js, name, private, scripts (+6 more)

### Community 13 - "Routing & Guards"
Cohesion: 0.24
Nodes (3): DEFAULT_SUBJECTS, useAuth(), ProfilePage()

### Community 14 - "OpenRouter AI Functions"
Cohesion: 0.32
Nodes (11): admissionChatbot(), analyzePerformance(), analyzeStudentRisk(), callAI(), classifyComplaint(), feeRecoveryAssistant(), generateLessonPlan(), generateMeetingSummary() (+3 more)

### Community 15 - "Demo Data Seeder"
Cohesion: 0.36
Nodes (9): clearDemoTenant(), createOrUpdateAuthUser(), DEMO, findAuthUserByEmail(), getOrCreateInstitution(), insertRows(), isoDate(), seed() (+1 more)

### Community 16 - "AI Tutor UI"
Cohesion: 0.20
Nodes (6): AiTutorPage(), GRADE_LEVELS, SUBJECT_TOPICS, SUBJECTS, SIZES, VARIANTS

### Community 17 - "Mobile Layout & Cart"
Cohesion: 0.22
Nodes (3): styles, styles, styles

### Community 18 - "Mobile Drawer Screens"
Cohesion: 0.22
Nodes (3): Drawer, styles, styles

### Community 19 - "Dashboard Widgets"
Cohesion: 0.25
Nodes (3): ACTION_COLORS, StatCard(), useCountUp()

### Community 20 - "Students Module"
Cohesion: 0.25
Nodes (3): CLASS_OPTIONS, EMPTY_FORM, StudentsPage()

### Community 21 - "Branding & Splash Assets"
Cohesion: 0.29
Nodes (7): E-commerce / Shopping Theme, Soft Pastel Color Palette (mint teal, pink, purple, baby blue, yellow), Pastel Shopping Cart with Gift Boxes and Bags (bg.png), CyberMilo App Branding, Concentric Circles Logo Mark on Blueprint Grid, Minimal Light Gray/White Visual Style, CyberMilo Splash Screen

### Community 22 - "Mobile Tab Navigation"
Cohesion: 0.29
Nodes (3): Tab, modules, styles

### Community 24 - "Career Path Page"
Cohesion: 0.29
Nodes (6): CareerPathPage(), INTERESTS_OPTIONS, PERSONALITY_TYPES, STREAMS, STRENGTHS_OPTIONS, SUBJECT_FIELDS

### Community 25 - "Attendance Module"
Cohesion: 0.38
Nodes (4): AttendancePage(), getLastNDays(), toDateStr(), TODAY

### Community 28 - "Mobile Admissions Screen"
Cohesion: 0.47
Nodes (4): AdmissionsScreen(), styles, demoLeads, fetchLeads()

### Community 29 - "Mobile Students Screen"
Cohesion: 0.47
Nodes (4): StudentsScreen(), styles, demoStudents, fetchStudents()

### Community 31 - "Fee Recovery Page"
Cohesion: 0.33
Nodes (5): DELAY_REASON_OPTIONS, FeeRecoveryPage(), INCOME_OPTIONS, PAYMENT_HISTORY_OPTIONS, RISK_STYLES

### Community 32 - "Mobile Home Screen"
Cohesion: 0.40
Nodes (3): METRICS, MODULES, styles

### Community 33 - "Favicon Branding"
Cohesion: 0.50
Nodes (4): CyberMilo App Branding, CyberMilo Favicon (Isometric Cube Icon), Isometric Wireframe Cube with Sphere Motif, Minimal Black-and-White Line-Art Style

### Community 34 - "Placeholder App Icon"
Cohesion: 0.50
Nodes (4): CyberMilo App Icon (Placeholder), Concentric Circles on Grid Motif, CyberMilo App Branding, Neutral Light-Gray Palette

### Community 35 - "OnlineMart Leftover Logo"
Cohesion: 0.50
Nodes (4): CyberMilo App Branding, OnlineMart Logo, Turquoise Shopping Cart Icon, Tagline: A Fantastic Supermarket

### Community 36 - "Android Adaptive Icon"
Cohesion: 1.00
Nodes (3): Adaptive Icon (Concentric Circles on Grid), CyberMilo Android App Branding, Minimal Placeholder Design Style (Light Gray Line Art)

## Ambiguous Edges - Review These
- `CyberMilo Admin API Package (Express)` → `ERP Master Plan (Python + Supabase)`  [AMBIGUOUS]
  docs/ERP_MASTER_PLAN.md · relation: conceptually_related_to
- `Minimal Placeholder Design Style (Light Gray Line Art)` → `CyberMilo Android App Branding`  [AMBIGUOUS]
  assets/adaptive-icon.png · relation: conceptually_related_to
- `Pastel Shopping Cart with Gift Boxes and Bags (bg.png)` → `CyberMilo App Branding`  [AMBIGUOUS]
  assets/bg.png · relation: conceptually_related_to
- `CyberMilo App Icon (Placeholder)` → `CyberMilo App Branding`  [AMBIGUOUS]
  assets/icon.png · relation: conceptually_related_to
- `OnlineMart Logo` → `CyberMilo App Branding`  [AMBIGUOUS]
  assets/logo.png · relation: conceptually_related_to

## Knowledge Gaps
- **201 isolated node(s):** `name`, `slug`, `version`, `orientation`, `icon` (+196 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `CyberMilo Admin API Package (Express)` and `ERP Master Plan (Python + Supabase)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Minimal Placeholder Design Style (Light Gray Line Art)` and `CyberMilo Android App Branding`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Pastel Shopping Cart with Gift Boxes and Bags (bg.png)` and `CyberMilo App Branding`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `CyberMilo App Icon (Placeholder)` and `CyberMilo App Branding`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `OnlineMart Logo` and `CyberMilo App Branding`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `useNotification()` connect `Auth Pages & Toasts` to `Roles & Permissions UI`, `Super Admin Console`, `Layout & Communication UI`, `Routing & Guards`, `AI Tutor UI`, `Students Module`, `Career Path Page`, `Attendance Module`, `Exams Module`, `Fees Module`, `LMS Module`, `Fee Recovery Page`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Why does `useAuth()` connect `Routing & Guards` to `Roles & Permissions UI`, `Auth & Notifications Layer`, `Super Admin Console`, `Layout & Communication UI`, `Dashboard Widgets`, `Students Module`, `Attendance Module`, `Exams Module`, `Fees Module`, `LMS Module`, `Fee Recovery Page`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._