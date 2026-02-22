# 🧸 AutoDayCare BC

> **One-line description:** An AI-powered SaaS that digitizes BC's child care search by aggregating government data and automating personalized outreach to offline daycares.

---

## 👥 Team
**Jaime Andres Salas**  
📧 jsalasmoreira@gmail.com

---

## 🔗 Links
- **Live Deployment URL:** [[INGRESA_TU_VERCEL_URL_AQUÍ]]
- **GitHub Repository:** [[https://github.com/jaimeandresalas/AutoDaycareBC]]

---

## 🚨 The Problem We Solved
Finding child care in British Columbia is a deeply frustrating, manual process because the vast majority of providers are not digitized and only offer a phone number. Parents waste countless hours playing phone tag just to discover waitlists are full or their child's age group isn't supported. 

**AutoDayCare BC solves this by:**
1. Taking official government data and mapping it.
2. Providing an "Auto-Outreach Engine" that allows parents to contact dozens of daycares simultaneously.
3. Sending highly personalized, data-driven messages automatically.

---

## 💡 Why This is a Great SaaS Product
*The Value Proposition:*

AutoDayCare BC bridges the gap between modern parents and legacy daycare operations. Instead of forcing daycares to adopt complex new software immediately, we meet them where they are (SMS/Email) while giving parents a seamless digital dashboard. 

📈 **The Growth Loop:** Every automated message sent acts as an invitation for providers to claim their profile and join the platform, naturally onboarding new facilities.

---

## ⚙️ Working Core Features

- 🗺️ **Interactive Map & Smart Filtering**  
  A dynamic Leaflet map integrated with a search dashboard that filters mock BC government data by child age, care type, and verified status.

- 🚀 **The Auto-Outreach Engine**  
  Parents can add unverified daycares to a "campaign cart" (powered by Zustand) and launch a simulated mass-contact event. The system dynamically formats the outreach message using the exact child's age in months and expected start date.

- ✨ **One-Click Verified Requests**  
  For daycares that have claimed their profiles, parents can request a spot with a single click, completely bypassing the manual outreach.

- 📊 **Campaign Analytics Dashboard**  
  A visual CRM for parents using Recharts to track outreach performance, comparing the success of Automated Campaigns vs. Direct Partner Requests.

---

## 🛠️ Tech Stack & Architecture

| Category | Technology |
| :--- | :--- |
| **Framework** | Next.js 14 (App Router) |
| **Styling & UI** | Tailwind CSS, Shadcn/ui, Framer Motion |
| **State Management**| Zustand (with local storage persistence) |
| **Authentication** | Clerk |
| **Database** | Supabase (PostgreSQL) storing parent profiles, provider data, and outreach logs via Server Actions |
| **Data Viz** | Recharts & React-Leaflet |
| **Deployment** | Vercel |