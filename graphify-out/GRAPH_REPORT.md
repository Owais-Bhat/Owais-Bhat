# Graph Report - .  (2026-05-25)

## Corpus Check
- 71 files · ~59,691 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 224 nodes · 323 edges · 18 communities (17 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 168,692 input · 87,000 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Context & App Entry|Context & App Entry]]
- [[_COMMUNITY_Navigation & Layout|Navigation & Layout]]
- [[_COMMUNITY_Data Management|Data Management]]
- [[_COMMUNITY_Package Dependencies|Package Dependencies]]
- [[_COMMUNITY_Mobile Assets|Mobile Assets]]
- [[_COMMUNITY_Authentication|Authentication]]
- [[_COMMUNITY_Core Packages|Core Packages]]
- [[_COMMUNITY_Build Scripts|Build Scripts]]
- [[_COMMUNITY_Admissions Module|Admissions Module]]
- [[_COMMUNITY_Configuration|Configuration]]
- [[_COMMUNITY_Product Details|Product Details]]

## God Nodes (most connected - your core abstractions)
1. `useAppData()` - 35 edges
2. `expo` - 11 edges
3. `scripts` - 5 edges
4. `useAuth()` - 5 edges
5. `moduleCatalog` - 5 edges
6. `splash` - 4 edges
7. `scripts` - 4 edges
8. `adaptiveIcon` - 3 edges
9. `ios` - 2 edges
10. `android` - 2 edges

## Surprising Connections (you probably didn't know these)
- `AppNavigator()` --calls--> `useAuth()`  [EXTRACTED]
  navigation/AppNavigator.js → contexts/AuthContext.js
- `LoginScreen()` --calls--> `useAuth()`  [EXTRACTED]
  screens/LoginScreen.js → contexts/AuthContext.js
- `AcademicsPage()` --calls--> `useAppData()`  [EXTRACTED]
  webapp/src/pages/AcademicsPage.jsx → webapp/src/context/AppDataContext.jsx
- `AdmissionsPage()` --calls--> `useAppData()`  [EXTRACTED]
  webapp/src/pages/AdmissionsPage.jsx → webapp/src/context/AppDataContext.jsx
- `AttendancePage()` --calls--> `useAppData()`  [EXTRACTED]
  webapp/src/pages/AttendancePage.jsx → webapp/src/context/AppDataContext.jsx

## Communities (18 total, 1 thin omitted)

### Community 0 - "Context & App Entry"
Cohesion: 0.10
Nodes (21): useAppData(), moduleCatalog, AcademicsPage(), AdmissionsPage(), AttendancePage(), AutomationPage(), CommunicationPage(), cards (+13 more)

### Community 1 - "Navigation & Layout"
Cohesion: 0.05
Nodes (18): styles, styles, Drawer, Tab, styles, styles, styles, METRICS (+10 more)

### Community 2 - "Data Management"
Cohesion: 0.15
Nodes (19): AppDataContext, AppDataProvider(), defaultState, initialAiInsights, initialAttendance, initialAutomation, initialExams, initialHostel (+11 more)

### Community 3 - "Package Dependencies"
Cohesion: 0.09
Nodes (22): dependencies, expo, @expo/metro-runtime, expo-status-bar, formik, install, npm, react (+14 more)

### Community 4 - "Mobile Assets"
Cohesion: 0.10
Nodes (19): backgroundColor, foregroundImage, adaptiveIcon, expo, android, icon, ios, name (+11 more)

### Community 5 - "Authentication"
Cohesion: 0.18
Nodes (10): AuthContext, AuthProvider(), useAuth(), AppNavigator(), Stack, LoginScreen(), validationSchema, supabaseConfig (+2 more)

### Community 6 - "Core Packages"
Cohesion: 0.12
Nodes (15): dependencies, react, react-dom, react-router-dom, devDependencies, vite, @vitejs/plugin-react, name (+7 more)

### Community 7 - "Build Scripts"
Cohesion: 0.17
Nodes (11): devDependencies, @babel/core, main, name, private, scripts, android, ios (+3 more)

### Community 8 - "Admissions Module"
Cohesion: 0.40
Nodes (3): styles, demoLeads, fetchLeads()

### Community 9 - "Configuration"
Cohesion: 0.50
Nodes (3): config, hasOpenRouterConfig, hasSupabaseConfig

## Knowledge Gaps
- **85 isolated node(s):** `name`, `slug`, `version`, `orientation`, `icon` (+80 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useAppData()` connect `Context & App Entry` to `Data Management`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Package Dependencies` to `Build Scripts`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **What connects `name`, `slug`, `version` to the rest of the system?**
  _85 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Context & App Entry` be split into smaller, more focused modules?**
  _Cohesion score 0.09528214616096208 - nodes in this community are weakly interconnected._
- **Should `Navigation & Layout` be split into smaller, more focused modules?**
  _Cohesion score 0.05217391304347826 - nodes in this community are weakly interconnected._
- **Should `Package Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `Mobile Assets` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._