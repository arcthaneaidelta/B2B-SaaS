# Quillfold — Automated B2B Post-Purchase Fulfillment Pipeline

> **Interactive Frontend Prototype & Concept Demo**  
> Proving a complete Shopify + Tally + Google Sheets + Make.com + Direct Mail/Gifting REST API automated fulfillment architecture.

[![Netlify Status](https://api.netlify.com/api/v1/badges/your-badge/deploy-status)](https://app.netlify.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38b2ac.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646cff.svg)](https://vitejs.dev/)

---

## 🌟 Executive Summary

Quillfold is an end-to-end interactive demo demonstrating how a modern B2B subscription platform handles the entire post-purchase automation lifecycle without fragile manual intervention:

1. **Storefront & Plan Selection** — Monthly & quarterly tier selection with interactive pricing, animated feature drawers, and instant cart.
2. **Shopify-Style Checkout & Thank You** — Mock checkout flow, credit card simulation, and 5-second auto-redirect ring.
3. **5-Step Tally Onboarding Simulation** — Account info, sender profile parameters, custom attributes, CSV upload with row preview, and review screen.
4. **Interactive Scenario Canvas (Make.com)** — 8-node live pipeline with real-time execution animation, module inspection, execution logs, and drill injection (e.g. invalid postcodes, missing sender, API rate-limiting).
5. **Data Merge Studio** — Cross-table merging of customer parameters with multi-row recipient CSVs using `account_id` as foreign key with orphaned record and duplicate resolution.
6. **Live Payload Inspector & Sandbox Runner** — Inspection of generated `sender` + `recipient` JSON schemas, mapping table, and live test dispatcher returning mock `201 Created` responses.
7. **Error Matrix & Automated Alert Center** — Triaged exception queue with alert email preview, root cause diagnostic, and inline "Inspect & Fix" actions.
8. **End-to-End Test Suite & Verification Matrix** — 8-step self-executing system verification testing all critical data invariants.
9. **Post-Handoff Resource Center** — Runbook documentation, video walkthrough chapters, copyable curl commands, and architectural specs.

---

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Custom Design Tokens (Warm editorial Clay/Oat/Stone palette)
- **Routing**: React Router DOM (v6) with full SPA redirect support on Netlify
- **Animations & Motion**: Framer Motion
- **Icons**: Lucide React
- **State Management**: Zustand with persistent storage

---

## 🚀 Quick Start (Local Development)

```bash
# Clone the repository
git clone https://github.com/arcthaneaidelta/shopify-automation-demo.git
cd shopify-automation-demo

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🚢 Deploy to Netlify

This project is pre-configured for 1-click Netlify deployment:

1. Push this repository to GitHub.
2. Log into [Netlify](https://app.netlify.com/) and click **Add new site > Import an existing project**.
3. Select your repository: `arcthaneaidelta/shopify-automation-demo`.
4. Netlify will auto-detect the configuration from [`netlify.toml`](./netlify.toml):
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Click **Deploy site**. All SPA routes and deep links work out of the box via `_redirects` and `netlify.toml`.

---

## 🧭 Project Architecture

```
src/
├── app/
│   └── router.tsx             # App routing table (storefront + control room)
├── components/
│   ├── app/                   # Control Room components (Sidebar, Topbar, Palette)
│   ├── site/                  # Storefront components (Navbar, Footer, Cart, etc.)
│   └── ui/                    # Reusable UI primitives (Button, Modal, Drawer, etc.)
├── config/
│   ├── brand.config.ts        # Brand typography, copy, endpoints, and colors
│   ├── nav.ts                 # Navigation routes
│   └── plans.ts               # Subscription tier matrix & pricing
├── mock/
│   ├── api.ts                 # Simulated REST endpoints
│   ├── mergeEngine.ts         # Account ID relational merge algorithm
│   ├── payloadMapper.ts       # Sender/recipient payload transformation
│   ├── runEngine.ts           # Make.com scenario execution simulator
│   ├── seed.ts                # Deterministic initial dataset
│   └── validators.ts          # Validation logic & error tagging
├── routes/
│   ├── app/                   # Control room pages (Overview, Pipeline, Data, etc.)
│   └── storefront/            # Storefront pages (Home, Plans, Checkout, Onboarding)
└── store/
    └── useStore.ts            # Reactive centralized Zustand state
```

---

## ⚖️ License & Disclaimer

*Interactive concept demo — simulated data, no live third-party integrations.*  
Built for demonstration and client review purposes.
