# WillowSaves

A personal finance tracker web app built with Next.js, Supabase, and Tailwind CSS. Track your expenses, manage savings, and monitor bank/GCASH balances with a clean, modern interface.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E)

---

## Features

- **Dashboard** — Overview of savings, expenses, bank balances, and spending trends
- **Savings Tracker** — Record allowances and track your savings rate over time
- **Expense Manager** — Categorize and filter expenses with 8 built-in categories
- **Bank & GCASH** — Track deposits and withdrawals for both bank and GCASH accounts
- **Dark Mode** — Full dark theme support with toggle
- **Responsive** — Works on desktop (sidebar) and mobile (header + floating action button)
- **Undo on Delete** — All deletions show an undo toast for 5 seconds
- **Email Authentication** — Secure login/signup with Supabase Auth
- **Real-time Sync** — Data syncs across browser tabs

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 16 | React framework (App Router) |
| React 19 | UI library |
| TypeScript 5 | Type safety |
| Tailwind CSS 4 | Styling |
| Supabase | Database + Authentication |
| Framer Motion | Animations |
| Recharts | Charts and data visualization |
| Lucide React | Icons |
| React Hook Form | Form handling |
| Zod | Schema validation |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ installed
- A [Supabase](https://supabase.com/) account (optional — runs in localStorage mode without it)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/willow-saves-web.git
   cd willow-saves-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

   > **Note:** Without these variables, the app runs in localStorage-only mode (no authentication, data stored locally in your browser).

4. **Set up the database** (if using Supabase)

   Go to your Supabase project dashboard, open the SQL Editor, and run the contents of `supabase-schema.sql`.

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open the app**

   Visit [http://localhost:3000](http://localhost:3000)

---

## End User Manual

### Dashboard

The dashboard is your home screen showing a complete overview:

- **Welcome Banner** — Shows your current savings rate for the month
- **Stats Cards** — Remaining balance, Bank balance, and GCASH balance
- **Statistics** — Toggle between daily, weekly, monthly, or yearly views to see spending and savings rate charts
- **Recent Activity** — Quick look at your latest expenses, allowances, and bank transactions

### Savings

Track your income and allowances:

1. **Viewing Savings** — The hero card shows your total calculated savings
2. **Filtering by Period** — Use the Weekly / Monthly / Yearly toggle to filter
3. **Adding an Allowance** — Tap the "+" button and select "Add Allowance"
   - Choose a quick preset (Daily 500, Weekly 1,500, Bi-weekly 3,000, Monthly 6,000)
   - Or enter a custom amount and label
4. **Editing an Allowance** — Tap the pencil icon on any allowance card
5. **Deleting an Allowance** — Tap the trash icon (undo toast appears for 5 seconds)

### Expenses

Manage and categorize your spending:

1. **Adding an Expense** — Tap the "+" button and select "Add Expense"
   - Enter the amount in Philippine Pesos
   - Select a category (Food, Transport, Shopping, Bills, Entertainment, Health, Education, Other)
   - Pick a date
   - Optionally add notes
2. **Filtering by Category** — Tap the category pills at the top to filter
3. **Filtering by Period** — Use the Daily / Weekly / Monthly / Yearly toggle
4. **Editing an Expense** — Tap the pencil icon on any expense card
5. **Deleting an Expense** — Tap the trash icon (undo toast appears for 5 seconds)

### Bank & GCASH

Track deposits and withdrawals for both accounts:

1. **Viewing Balances** — The hero card shows both Bank and GCASH balances side by side
2. **Making a Deposit** — Tap the "+" button and select "Deposit to Bank"
   - Choose account: Bank or GCASH
   - Select source: "From Savings" (deducts from your savings) or "Other Source" (external money)
   - Enter amount and optional note
3. **Making a Withdrawal** — Tap the "+" button and select "Withdraw from Bank"
   - Choose account: Bank or GCASH
   - Enter amount and optional note
4. **Transaction History** — All deposits and withdrawals are listed with icons showing type (green = deposit, red = withdrawal)

### Navigation

**Desktop (wide screens):**
- Fixed sidebar on the left with navigation icons
- "Add New" button in the top bar for quick actions
- User menu with sign out option

**Mobile (narrow screens):**
- Top bar with navigation tabs
- Floating action button (green "+") at the bottom right for adding expenses, allowances, deposits, and withdrawals

### Dark Mode

Tap the theme toggle (sun/moon icon) to switch between light and dark mode. Your preference is saved and persists across sessions.

### Authentication

- **Sign Up** — Create an account with email and password (minimum 8 characters). Check your email for a confirmation link.
- **Log In** — Sign in with your email and password.
- **Sign Out** — Available in the user menu on desktop or settings on mobile.

---

## Expense Categories

| Category | Icon | Color |
|----------|------|-------|
| Food | Apple | Red |
| Transport | Bus | Yellow-Green |
| Shopping | ShoppingBag | Orange |
| Bills | Receipt | Orange |
| Entertainment | Film | Blue |
| Health | HeartPulse | Red |
| Education | GraduationCap | Purple |
| Other | MoreHorizontal | Gray |

---

## How Savings Are Calculated

```
Savings = Total Allowances - Total Expenses - Total Deposited + Total Withdrawn
```

- **Allowances** increase your savings
- **Expenses** decrease your savings
- **Deposits to Bank/GCASH** decrease your savings (moving money to bank)
- **Withdrawals from Bank/GCASH** increase your savings (moving money back)

---

## Project Structure

```
willow-saves-web/
├── public/                    # Static assets (images, logos)
├── src/
│   ├── app/
│   │   ├── (auth)/           # Login/signup pages (no sidebar)
│   │   ├── (app)/            # Authenticated pages with sidebar
│   │   │   ├── page.tsx      # Dashboard
│   │   │   ├── savings/      # Savings tracker
│   │   │   ├── expenses/     # Expense manager
│   │   │   └── bank/         # Bank & GCASH
│   │   └── layout.tsx        # Root layout
│   ├── components/
│   │   ├── auth/             # Auth forms
│   │   ├── cat/              # Cat mascot component
│   │   ├── dashboard/        # Dashboard charts
│   │   ├── expenses/         # Expense cards and lists
│   │   ├── forms/            # All form components
│   │   ├── layout/           # Sidebar, header, app layout
│   │   └── ui/               # Reusable UI components
│   ├── lib/
│   │   ├── store.ts          # Singleton state management
│   │   ├── supabase/         # Supabase client setup
│   │   └── utils.ts          # Utility functions
│   └── types/                # TypeScript type definitions
├── supabase-schema.sql       # Database schema
└── package.json
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click **Add New Project** and select your repository
4. Add your environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
5. Click **Deploy**

Vercel auto-detects Next.js and configures everything for you.

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | No | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | No | Your Supabase anonymous key |

> Without these, the app runs in localStorage mode with no authentication.

---

## License

This project is for personal use.
