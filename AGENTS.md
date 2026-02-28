# Agent Guidelines for Property App

This document provides guidelines for AI agents working on this codebase.

## Project Overview

- **Type**: Next.js 16+ Real Estate Triage Dashboard
- **Database**: Supabase (PostgreSQL) with Prisma ORM
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Context + TanStack Table
- **Authentication**: Supabase Auth

---

## Build Commands

```bash
# Development
npm run dev           # Start Next.js dev server at localhost:3000

# Build
npm run build         # Production build
npm run start         # Start production server

# Linting
npm run lint          # Run ESLint (Next.js core-web-vitals config)

# Database
npx prisma generate   # Generate Prisma client
npx prisma db push   # Push schema to database
npx prisma studio    # Open Prisma database GUI
```

---

## Running Tests

This project uses Playwright for end-to-end testing.

```bash
# Run all tests
npx playwright test

# Run a single test file
npx playwright test tests/filename.spec.ts

# Run tests matching a pattern
npx playwright test --grep "test name"

# Run tests in headed mode (see browser)
npx playwright test --headed

# Open Playwright UI for test development
npx playwright open
```

Test files are located in `tests/` directory.

---

## Code Style Guidelines

### TypeScript

- **Strict mode enabled** in `tsconfig.json` - do not disable strict checks
- Always define proper types; avoid `any` except for external API responses
- Use interfaces for object shapes, types for unions/aliases
- Use `type` for union types (e.g., `type Decision = 'Pass Platinum' | 'Pass Gold'`)

### Naming Conventions

| Type             | Convention                  | Example                     |
| ---------------- | --------------------------- | --------------------------- |
| Components       | PascalCase                  | `PropertyDataTable.tsx`     |
| Interfaces/Types | PascalCase                  | `PropertyWithCalculations`  |
| Functions        | camelCase                   | `calculateCashFlow()`       |
| Variables        | camelCase                   | `const propertyList = []`   |
| Database columns | snake_case                  | `list_price`, `is_favorite` |
| React hooks      | camelCase with `use` prefix | `usePropertyData()`         |

### Import Organization

Order imports as follows:

1. Next.js/React imports
2. Third-party library imports
3. Internal imports (`@/components`, `@/lib`)
4. Type imports

```typescript
// 1. React/Next
import { useState, useMemo } from "react";
import { NextRequest, NextResponse } from "next/server";

// 2. Third-party
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import clsx from "clsx";

// 3. Internal
import { PropertyWithCalculations } from "@/lib/calculations";
import { getDecisionColor } from "@/data/properties";

// 4. Types
import type { Decision, Strategy } from "@/data/properties";
```

Use the `@/` alias for imports from `src/` directory.

### File Organization

```
src/
├── app/                    # Next.js App Router pages/api
│   ├── api/              # API routes
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # React components
├── context/              # React Context providers
├── data/                # Static data, types, constants
└── lib/                 # Utility functions, helpers
```

### Component Patterns

- Use `'use client'` directive for client-side components
- Use TypeScript interfaces for props
- Destructure props in function signature
- Use `useMemo` for expensive calculations
- Use `useCallback` for callback props passed to children

```typescript
'use client';

import { useMemo, useState } from 'react';
import { PropertyWithCalculations } from '@/lib/calculations';

interface PropertyTableProps {
  properties: PropertyWithCalculations[];
  onPropertyClick?: (property: PropertyWithCalculations) => void;
}

export default function PropertyTable({
  properties,
  onPropertyClick,
}: PropertyTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo(() => [...], [dependencies]);

  return <table>...</table>;
}
```

### Database Patterns

- Supabase uses snake_case for columns (`list_price`, `created_at`)
- API routes convert between snake_case (DB) and camelCase (client)
- Use helper functions like `convertSupabaseProperty()` for conversion
- Always handle null values defensively (`property.listPrice ?? 0`)

### Error Handling

- API routes: Return `{ success: false, error: 'message' }` with appropriate HTTP status
- Use try/catch blocks with console.error for logging
- Client components: Handle errors with state and display user-friendly messages

```typescript
// API route error handling
try {
  const { data, error } = await supabase.from("properties").select("*");
  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch properties" },
      { status: 500 },
    );
  }
  return NextResponse.json({ success: true, data });
} catch (error) {
  console.error("API Error:", error);
  return NextResponse.json(
    { success: false, error: "Internal server error" },
    { status: 500 },
  );
}
```

### Tailwind CSS

- Use utility classes for styling
- Use `clsx` or `cn()` for conditional classes
- Avoid custom CSS; prefer Tailwind utilities

### Linting

- ESLint: Extends `next/core-web-vitals`
- Stylelint: Extends `stylelint-config-standard`
- Run `npm run lint` before committing

---

## Key Libraries

| Library                 | Purpose                                         |
| ----------------------- | ----------------------------------------------- |
| `@tanstack/react-table` | Data tables with sorting, filtering, pagination |
| `@dnd-kit`              | Drag and drop functionality                     |
| `recharts`              | Data visualization                              |
| `react-leaflet`         | Map components                                  |
| `supabase`              | Database and auth                               |
| `prisma`                | ORM for database                                |

---

## Common Tasks

### Adding a new API route

1. Create `src/app/api/[resource]/route.ts`
2. Export GET, POST, PUT, DELETE functions
3. Return `{ success: boolean; data?: any; error?: string }` format

### Adding a new component

1. Create `src/components/ComponentName.tsx`
2. Add TypeScript interface for props
3. Use `'use client'` if using hooks/state
4. Export as default

### Adding a new calculation

1. Add to `src/lib/calculations.ts`
2. Export function with proper types
3. Include in `addCalculations()` function
4. Update `PropertyWithCalculations` interface

---

## Environment Variables

Create `.env.local` for local development:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## Notes

- The app uses Supabase for real-time data and authentication
- Property calculations are centralized in `src/lib/calculations.ts`
- Decision/Strategy types are defined in `src/data/properties.ts`
- API routes handle conversion between database (snake_case) and client (camelCase) formats
