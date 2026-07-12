---
type: "query"
date: "2026-07-12T05:46:32.402540+00:00"
question: "Trace the OnlineMart placeholder trail - how much of the repo is leftover shopping-app template?"
contributor: "graphify"
source_nodes: ["OnlineMart Logo", "OnlineMart Expo App Config", "CartScreen()", "CyberMilo App Branding", "CyberMilo Splash Screen"]
---

# Q: Trace the OnlineMart placeholder trail - how much of the repo is leftover shopping-app template?

## Answer

The entire root-level React Native app is the OnlineMart shopping template, not CyberMilo: app.json is named OnlineMart, and screens/CartScreen.js, screens/ProductDetailsScreen.js, contexts/CartContext.js are e-commerce screens with no education features. The graph shows ZERO code edges between the mobile app (root contexts/screens/navigation) and webapp/ or backend/ - it is a fully disconnected island that only docs/PHASE_WISE_COMPLETION.md references. All 6 branding assets are also placeholders: assets/logo.png is an OnlineMart supermarket logo (tagline A Fantastic Supermarket), assets/bg.png is a pastel shopping-cart photo, and icon.png/splash.png/adaptive-icon.png are the Expo default concentric-circles placeholder; favicon.png is a generic isometric cube. Every asset-to-CyberMilo-branding edge is AMBIGUOUS or weakly INFERRED - no real CyberMilo brand identity exists in the repo. Action: replace assets and either rebuild or remove the mobile template.

## Source Nodes

- OnlineMart Logo
- OnlineMart Expo App Config
- CartScreen()
- CyberMilo App Branding
- CyberMilo Splash Screen