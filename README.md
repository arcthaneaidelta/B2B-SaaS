# A&A Patch Work — Interactive Demo & System Preview

A high-fidelity prototype built for the **"Patches QR Code Data"** merit patch system proposal.

## Features
- **Universal Packaging QR Destination (`/s`)**: Clean mobile fork with two distinct pathways: **Register a Patch** (for high school students) and **Order Patches** (for Athletic Directors, coaches, and booster parents).
- **Student Privacy by Design (`/s/register`)**: Enforces First Name + Last Initial + Graduation Year only. Physical single-character constraint prevents storing minors' full names.
- **Bulk School Ordering (`/s/order`)**: Multi-item line builder with live inventory awareness, quantity steppers, and backorder handling.
- **Owner Console (`/admin`)**:
  - Live KPI strip with 12-week sparklines.
  - Reporting breakdowns by School (interactive bar chart), Category, and Top Students.
  - Schools directory with computed order rollups (`/admin/schools`).
  - Patch catalog with inline inventory editing (`/admin/catalog`).
  - Master flat ledger (`/admin/records`).
  - Universal QR generator & printable 6-up sticker sheet (`/admin/qr`).
- **Real Excel Export (`.xlsx`)**: Client-side SheetJS generation creating 4 sheets with a **Pivot-ready flat data sheet** containing denormalized school and category columns.
- **Proposal Blueprint (`/how-it-works`)**: System architecture, cost comparison bar ($0–$19/mo recommended stack vs $250+/mo custom app), and 5-day delivery roadmap.

## Tech Stack
- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS + Custom Design Tokens (Warm Paper `#F7F3EC`, Ink `#1C2B3A`, Thread Red `#B5472F`)
- **State Management:** Zustand with `localStorage` persistence
- **Spreadsheet Generation:** SheetJS (`xlsx`)
- **QR Code Generation:** `qrcode`
- **Icons:** Lucide React

## Local Development
```bash
npm install
npm run dev
```

## Production Build
```bash
npm run build
```

## Netlify Deployment
The repository includes `netlify.toml` and `public/_redirects` configured for Single Page Application (SPA) routing. All sub-routes (`/s`, `/s/register`, `/admin`, `/how-it-works`) will resolve correctly without 404s.
