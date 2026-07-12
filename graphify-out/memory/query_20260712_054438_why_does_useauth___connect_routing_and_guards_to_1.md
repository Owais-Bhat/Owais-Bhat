---
type: "query"
date: "2026-07-12T05:44:38.937068+00:00"
question: "Why does useAuth() connect Routing and Guards to 11 module communities?"
contributor: "graphify"
source_nodes: ["useAuth()", "AuthContext", "canAccessPath()", "RoleGate()", "ProtectedRoute()"]
---

# Q: Why does useAuth() connect Routing and Guards to 11 module communities?

## Answer

There are TWO useAuth() nodes: the mobile app's (contexts/AuthContext.js, 5 edges, used only by AppNavigator and LoginScreen) and the webapp's (webapp/src/hooks/useAuth.js, 24 edges). The webapp one is the trust root of the entire security stack: all five gate components (ProtectedRoute, RoleGate, FeatureGate, BillingGate, UsageTracker) import it, the layout shell (Sidebar, TopBar, CommandPalette, NotificationBell) imports it for role-aware rendering, and all 14 pages import it for institution_id scoping. The chain is useAuth -> AuthContext (Supabase session + user_profiles.role) -> canAccessPath(role, path) in webapp/src/auth/permissions.js -> RoleGate/Sidebar/TopBar/CommandPalette. Everything role-based in the frontend derives from the single profile.role value; Supabase RLS is the backend backup enforcement.

## Source Nodes

- useAuth()
- AuthContext
- canAccessPath()
- RoleGate()
- ProtectedRoute()