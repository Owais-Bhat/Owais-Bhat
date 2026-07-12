---
type: "query"
date: "2026-07-12T05:42:40.465837+00:00"
question: "Why does useNotification() connect Auth Pages to all 12 module communities?"
contributor: "graphify"
source_nodes: ["useNotification()", "NotificationContext", "NotificationCenter()", "NotificationProvider()"]
---

# Q: Why does useNotification() connect Auth Pages to all 12 module communities?

## Answer

useNotification() (webapp/src/hooks/useNotification.js) is the app's toast API. Every user-facing page - all 4 auth pages, all 8 module pages, all 4 AI pages, Profile and Settings (18 pages, 39 edges, all EXTRACTED imports/calls) - imports it to show success/error feedback after actions. It reads NotificationContext, whose NotificationProvider wraps the whole tree in App.jsx, and NotificationCenter renders the toasts. It bridges 12+ communities because user feedback is the one concern every module shares; it is a deliberate hub, and any change to its API (notification.success/error/info) touches every page in the app.

## Source Nodes

- useNotification()
- NotificationContext
- NotificationCenter()
- NotificationProvider()