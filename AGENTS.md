# Agent Guidelines for Property App

## Project Overview

- **Type**: Next.js 15+ Real Estate Triage Dashboard for "Properties 4 Creation" platform
- **Focus**: BRRRR strategy and distressed property flips in East Texas (Tyler, Kilgore, Tatum)
- **Database**: Supabase (PostgreSQL) with Prisma ORM
- **Styling**: Tailwind CSS with institutional design system
- **State Management**: React Context + TanStack Table

---

## Build Commands

```bash
npm run dev              # Start dev server at localhost:3000
npm run build            # Production build
npm run lint             # Run ESLint (next/core-web-vitals)
npm run lint:fix         # Fix ESLint issues
npm run format           # Format with Prettier
npm run format:check     # Check formatting
npx prisma generate      # Generate Prisma client
npx prisma db push       # Push schema to database
npx prisma studio        # Open Prisma GUI
```

---

## Testing

Uses Playwright for e2e testing:

```bash
npx playwright test                        # Run all tests
npx playwright test tests/filename.spec.ts # Run single test file
npx playwright test --grep "test name"     # Run specific test
npx playwright test --headed               # Run in headed mode
npx playwright test --project=chromium     # Run in specific browser
npx playwright test --ui                   # Open Playwright UI
```

---

## Code Style

### TypeScript
- **Strict mode enabled** - never disable strict checks
- Never use `any` - always use precise interfaces
- Use `interface` for object shapes, `type` for unions/aliases
- Define return types for exported functions

### Naming Conventions
| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `PropertyDataTable.tsx` |
| Interfaces | PascalCase | `PropertyWithCalculations` |
| Functions | camelCase | `calculateCashFlow()` |
| Variables | camelCase | `propertyList` |
| DB columns | snake_case | `list_price` |
| Hooks | usePrefix | `usePropertyData()` |
| Constants | UPPER_SNAKE | `MAX_PROPERTIES` |

### Import Order
1. React/Next imports
2. Third-party libraries
3. Internal (`@/components`, `@/lib`)
4. Type imports

```typescript
import { useState } from "react";
import { useReactTable } from "@tanstack/react-table";
import { PropertyCard } from "@/components/PropertyCard";
import type { Property } from "@/data/properties";
```

### File Organization
```
src/
├── app/          # Next.js App Router
├── components/   # React components
├── context/      # Context providers
├── data/         # Static data, types
└── lib/          # Utilities, calculations
```

---

## Component Patterns

- Use `'use client'` for client components
- Use TypeScript interfaces for props
- Destructure props in function signature
- Use `useMemo` for expensive calculations
- Handle null/undefined states defensively

```typescript
'use client';

interface Props {
  properties: Property[];
}

export default function PropertyList({ properties }: Props) {
  const sorted = useMemo(() => [...properties].sort(), [properties]);
  return <div>{sorted.map(p => <Card key={p.id} property={p} />)}</div>;
}
```

---

## Database Patterns

- Supabase uses snake_case (`list_price`, `created_at`)
- API routes convert snake_case ↔ camelCase
- Handle null values defensively: `property.listPrice ?? 0`

### Error Handling
```typescript
try {
  const { data, error } = await supabase.from("properties").select("*");
  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch" },
      { status: 500 }
    );
  }
  return NextResponse.json({ success: true, data });
} catch (e) {
  console.error("API Error:", e);
  return NextResponse.json(
    { success: false, error: "Internal error" },
    { status: 500 }
  );
}
```

---

## UI/UX Guidelines

- **Aesthetic**: Institutional, sharp, data-dense. Bento-box layouts, terminal-style outputs
- **Styling**: Tailwind CSS exclusively. Use palette: `text-success`, `bg-warning/10`
- **Formatting**: Currency (`$250,000`), percentages (`15.5%`), `tabular-nums` for tables

---

## AI Analysis Rules

### ARV Waterfall Priority
1. Actual sold comps → 2. Estimated comps → 3. ZHVI sqft → 4. Knowledge Bundle → 5. Conservative markup

### DOM Scoring
- < 30 days = caution | 90-180 days = 10% discount | > 180 days = 15% discount

### Narrative Style
Cold, objective tone: "DECISION LINE: CAUTION. Negotiate toward MAO for margin safety."

---

## Key Libraries

| Library | Purpose |
|---------|---------|
| `@tanstack/react-table` | Data tables |
| `@dnd-kit` | Drag and drop |
| `recharts` | Data visualization |
| `react-leaflet` | Maps |
| `supabase` | Database/auth |
| `prisma` | ORM |

---

## Common Tasks

**Add API Route**: Create `src/app/api/[resource]/route.ts`, export GET/POST/PUT/DELETE, return `{ success, data?, error? }`

**Add Component**: Create `src/components/Name.tsx`, add interface, use `'use client'` if needed, export default

**Add Calculation**: Add to `src/lib/calculations.ts`, export function, include in `addCalculations()`, update interface

---

## Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
```

---

## Execution Protocol

1. **Plan**: Output 2-3 step plan of files to touch
2. **Execute**: Write complete, executable code
3. **Verify**: Check `src/lib` changes flow to `src/components` correctly

**Always run `npm run lint` and `npm run format:check` before committing.**
