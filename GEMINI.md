# Property App: Real Estate Triage Dashboard - GEMINI.md

## Project Overview

The **Property App** is an institutional-grade real estate triage and investment analysis dashboard specifically designed for fix-and-flip investors in the East Texas market (Tyler, Longview, Marshall, etc.). It automates property evaluation using AI deal scoring, market intelligence (ZHVI/ZORI), and institutional buy parameters.

### Core Technology Stack

- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript (Strict Mode)
- **Frontend:** React 19, Tailwind CSS, TanStack Table (Data Tables), Recharts (Charts), Leaflet (Maps)
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** PostgreSQL (Supabase)
- **Testing:** Playwright (E2E)
- **AI Integration:** Custom "East Texas Deal Inspector" persona using RAG (Retrieval-Augmented Generation) with local market data bundles.

---

## Building and Running

### Development Commands

- `npm run dev`: Starts the Next.js development server at `localhost:3000`.
- `npm run build`: Creates a production build.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint and Stylelint checks.

### Database Management

- `npx prisma generate`: Generates the Prisma client based on `schema.prisma`.
- `npx prisma db push`: Synchronizes the database schema with the Prisma schema.
- `npx prisma studio`: Opens a GUI to view and edit database data.

### Testing

- `npx playwright test`: Runs all E2E tests.
- `npx playwright test --ui`: Opens the Playwright UI for interactive test development.

---

## Architecture & Data Model

### Key Entities (Prisma Schema)

- **Property:** Central entity for deal analysis. Includes specs, AI-derived scores (MAO, deal score), and status.
- **Organization/User:** Multi-tenancy support for investment teams.
- **RehabItem:** Detailed line-item tracking for renovation budgets.
- **MarketData:** Neighborhood-level trends and inventory data.
- **Accounting:** `BankAccount`, `Transaction`, and `Vendor` models for financial tracking.

### AI Scoring Logic (`src/lib/ai/enhancedScoring.ts`)

The "East Texas Deal Inspector" enforces strict institutional rules:

1. **Rule 1 (Flipping Only):** Ignores rental metrics; focuses solely on retail flip potential.
2. **Rule 3 (Knowledge Base Priority):** Uses exact local comps, velocity, and rehab catalogs from `KnowledgeBundle`.
3. **Preflight Gate:** Automatically filters out "HARD_FAIL" deals based on price and velocity before deep analysis.

---

## Development Conventions

### Coding Standards

- **Naming:** PascalCase for Components/Types, camelCase for Variables/Functions, snake_case for Database columns.
- **Imports:** Use the `@/` alias for `src/` directory. Order: React/Next -> Third-party -> Internal -> Types.
- **State:** Prefer React Context for global UI state and TanStack Table for complex data filtering/sorting.

### API Patterns

- **Response Format:** All API routes return `{ success: boolean; data?: any; error?: string }`.
- **Data Conversion:** DB uses snake_case; Client uses camelCase. Use `serializeProperty` and `addCalculations` helpers in `src/lib/calculations.ts` to transform data between layers.
- **Automatic Analysis:** Creating a new property via `POST /api/properties` automatically triggers the AI Analysis engine.

### Directory Structure

- `src/app/`: Next.js App Router (Pages & API Routes).
- `src/components/`: Modular React components.
- `src/lib/`: Core logic (AI scoring, market data loaders, calculations).
- `src/data/`: Static constants, types, and initial data structures.
- `prisma/`: Database schema and seeding scripts.
- `processed/`: Curated CSV/JSON market data used by the RAG engine.

---

## Environment Configuration

Ensure `.env.local` contains the following for database access:

```bash
DATABASE_URL="your-postgresql-url"
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

Refer to `AGENTS.md` for more detailed AI guidelines and code snippets.
