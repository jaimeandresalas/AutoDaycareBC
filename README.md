<div align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/Supabase-DB-3ECF8E?logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/Clerk-Auth-6C47FF" alt="Clerk" />
  <img src="https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css" alt="Tailwind CSS" />
</div>

<br />

<div align="center">
  <h1 align="center">🧸 AutoDayCare BC</h1>
  <p align="center">
    <strong>An AI-powered SaaS that digitizes BC's child care search by aggregating government data and automating personalized outreach to offline daycares.</strong>
  </p>
  <p align="center">
    <a href="https://auto-daycare-bc.vercel.app/">View Live Demo</a>
    ·
    <a href="explainer_AutoDayCareBC.md">Read the Explainer</a>
    ·
    <a href="routes_AutoDayCareBC.md">View Route Architecture</a>
  </p>
</div>

---

## 🎯 What is it?
Finding child care in British Columbia is a deeply frustrating process because the vast majority of providers are not digitized and only offer a phone number. 

**AutoDayCare BC solves this by:**
1. Mapping official BC government data using React-Leaflet.
2. Providing an "Auto-Outreach Engine" (powered by Zustand) that allows parents to contact dozens of daycares simultaneously.
3. Supplying an Analytics dashboard (powered by Recharts) to track automated campaigns vs. verified 1-click requests.
4. Offering a Provider Lead-Gen portal so facilities can claim their business and digitize their waitlist.

---

## 🚀 Quickstart Guide (For Judges)

### 1. Clone & Install
```bash
git clone https://github.com/jaimeandresalas/AutoDaycareBC.git
cd AutoDaycareBC
npm install
```

### 2. Environment Variables
Create a `.env.local` file in the root directory and add your keys for Clerk (Auth) and Supabase (Postgres Database):

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/onboarding
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/dashboard

# Supabase backend
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

> **Note:** The `SUPABASE_SERVICE_ROLE_KEY` is a server-only secret that bypasses Row Level Security (RLS). It is **never** exposed to the browser — it is only used inside Next.js Server Actions. You can find it in your Supabase Dashboard under **Settings → API → Service Role Key**.

### 3. Database Setup (Supabase Seed)
To populate the database with the mock BC government providers and ensure the Row Level Security (RLS) constraints are correct, you need to run the provided SQL seed script:

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard/).
2. Navigate to the **SQL Editor** on the left menu.
3. Open the file `supabase/seed.sql` located in this repository.
4. Copy its entire content, paste it into the Supabase SQL Editor, and click **Run**.
*(Note: This creates all necessary tables: `parents`, `providers`, `campaigns`, and `outreach_logs`, and seeds 20 mock providers).*

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to explore the platform!

---

## 🛠️ Tech Stack
- **Framework:** [Next.js 14](https://nextjs.org/) (App Router, Server Actions)
- **Database:** [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication:** [Clerk](https://clerk.com/) (Middleware-protected routes)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [Shadcn/ui](https://ui.shadcn.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Mapping:** [React-Leaflet](https://react-leaflet.js.org/)
- **Data Visualization:** [Recharts](https://recharts.org/)

---

## 📁 Key Directories

- `src/app/` - Next.js App Router pages (Landing, Dashboard, Outreach, Analytics, Providers).
- `src/app/actions/` - Secure Server Actions for interacting with Supabase.
- `src/components/` - Reusable UI components (shadcn, charts, maps).
- `src/lib/` - Utilities and types.
- `src/store/` - Zustand global state stores.
- `supabase/` - SQL migration and mock seed scripts.

## 🧪 Testing Credentials (For Judges)
To speed up your evaluation without needing to sign up, you can use the following test account:
- **Email/User:** `test_user`
- **Password:** `test_user_2026`

*(You are also welcome to create your own account from scratch to experience the full onboarding flow!)*

---

## 🔒 Security Note
All persistent data generated during this application's usage is stored in a securely encrypted Supabase PostgreSQL database. Communication with the backend is fully authenticated via Clerk Middleware, and direct SQL operations are restricted via Row Level Security (RLS) policies.

---

> Built with ❤️ for parents in British Columbia.
