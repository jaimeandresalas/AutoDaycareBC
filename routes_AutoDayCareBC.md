# 🗺️ AutoDayCare BC - Route Architecture

> **Overview:** A complete breakdown of the application's routing, distinguishing between public-facing marketing pages, authenticated user dashboards, and back-end Server Actions.

---

## 🌍 Public Routes
*Accessible by anyone. No authentication required.*

- **`/`**  
  **Main Landing Page** – Features the high-converting Hero section, Value Propositions, the timeline-based "How it Works" guide, and strong CTAs.
- **`/providers`**  
  **Provider Smoke Test** – A lead generation page aimed at Daycare providers. Includes benefits and a waitlist form to capture their interest in claiming a profile.

---

## 🔒 Protected Routes
*Require Clerk Authentication. Enforced globally by the middleware.*

- **`/onboarding`**  
  **Parent Profile Setup** – Collects the child's name, age/DOB, care type needed, and expected start date before granting platform access.
- **`/dashboard`**  
  **Main Search UI** – The core application featuring an interactive React-Leaflet map and filterable data grid of both verified and unverified daycares.
- **`/outreach`**  
  **Campaign Manager** – Allows parents to review their "cart" of selected daycares, previews dynamically generated messages, and simulates a mass-send event with a progress modal.
- **`/analytics`**  
  **Comparative Dashboard** – A visual CRM utilizing Recharts to track and compare the performance of Automated Outreach Campaigns vs. Direct 1-Click Requests.

---

## ⚙️ API & Server Actions (Backend Logic)
*Next.js Server Actions handling Supabase PostgreSQL interactions safely.*

- `app/actions/daycareActions.ts`  
  Fetches provider listings from the DB and joins them with the user's personal outreach history to determine UI states.
- `app/actions/campaignActions.ts`  
  Handles the creation of mass SMS/email campaigns, logging each individual outreach attempt to the DB.
- `app/actions/spotActions.ts`  
  Manages the 1-click "Direct Request" flow for verified partners, completely bypassing the automated outreach engine.
- `app/actions/analyticsActions.ts`  
  Aggregates metrics and recent activity logs from `outreach_logs`, separating data between Verified and Unverified providers for the Recharts dashboard.
- `app/actions/userActions.ts`  
  Saves and updates the parent’s onboarding profile securely within the `parents` table.

---

## 🛡️ Middleware
- **`middleware.ts`**  
  The Clerk authentication guard. Actively redirects unauthenticated traffic trying to access protected routes back to sign-in, and enforces the completion of the `/onboarding` step before accessing the dashboard.
