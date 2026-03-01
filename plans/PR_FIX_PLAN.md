# PR Fix Plan: Architectural Pivot to Flipping-Only

## Overview
This plan addresses the critical and warning issues found in the code review for the architectural pivot from rental management SaaS to property flipping/wholesaling workflow.

## Critical Issues

### 1. Duplicate Status Fields in Prisma Schema
**File**: `prisma/schema.prisma:67-68`

**Problem**: Both `status` and `propertyStatus` fields exist with identical enum types and defaults. The `propertyStatus` has `@map("property_status")` but `status` has no map, causing confusion.

**Current Code**:
```prisma
// Property status
status         PropertyStatus @default(NEW_LEAD)
propertyStatus PropertyStatus @default(NEW_LEAD) @map("property_status")
```

**Fix**:
- Remove the `propertyStatus` field
- Keep `status` as the canonical field
- Add `@map("property_status")` to `status` to maintain database column mapping

**Code Changes**:
```prisma
// Property status
status         PropertyStatus @default(NEW_LEAD) @map("property_status")
```

---

### 2. PropertyStatus Enum Migration
**File**: `prisma/schema.prisma:127-134` and `supabase/migrations/20260228063302_new-migration.sql`

**Problem**: The `PropertyStatus` enum values were completely changed without a migration. The migration file is empty, so existing database rows with old enum values will cause query failures.

**Old Values** (rental-focused):
- `AVAILABLE`
- `UNDER_RENOVATION`
- `OFF_MARKET`
- `SOLD`

**New Values** (flipping-focused):
- `NEW_LEAD`
- `UNDERWRITING`
- `OFFER_PENDING`
- `UNDER_CONTRACT`
- `ACTIVE_REHAB`
- `LISTED`
- `CLOSED`
- `ARCHIVED`

**Fix**:
Create a proper migration that maps old statuses to new ones:

```sql
-- Migration: Map old rental-focused statuses to new flipping-focused statuses

-- First, add a temporary column to store old values
ALTER TABLE properties ADD COLUMN status_old TEXT;

-- Copy current status values to temp column
UPDATE properties SET status_old = status;

-- Map old statuses to new statuses
UPDATE properties SET status = CASE 
    WHEN status_old = 'AVAILABLE' THEN 'NEW_LEAD'
    WHEN status_old = 'UNDER_RENOVATION' THEN 'ACTIVE_REHAB'
    WHEN status_old = 'SOLD' THEN 'CLOSED'
    WHEN status_old = 'OFF_MARKET' THEN 'ARCHIVED'
    ELSE 'NEW_LEAD'  -- Default fallback
END;

-- Drop the temporary column
ALTER TABLE properties DROP COLUMN status_old;
```

---

## Warning Issues

### 3. AI Analysis Error Handling in API Route
**File**: `src/app/api/properties/route.ts:134-156`

**Problem**: When `enrich=true`, `analyzePropertyFlip()` is called for each property in a `Promise.all()` without error handling. If one AI call fails, the entire request fails.

**Current Code**:
```typescript
calculated = await Promise.all(calculated.map(async (prop) => {
  // ... context setup ...
  
  // Apply AI Analysis - NO ERROR HANDLING
  const aiResult = await analyzePropertyFlip({
    address: prop.address,
    zip: prop.zip,
    sqft: prop.sqft,
    listPrice: prop.listPrice,
    images: prop.images || [],
  });
  
  return { ...prop, /* AI results */ };
}));
```

**Fix**: Wrap AI analysis in try/catch and return property without AI enrichment if it fails:

```typescript
calculated = await Promise.all(calculated.map(async (prop) => {
  const benchmarks = getDynamicBenchmarks(prop.city, prop.state);
  const comps = KnowledgeBundle.getSoldComps(prop.zip, prop.sqft);
  const velocity = KnowledgeBundle.getMarketVelocity(prop.zip, "Standard");
  const avmList = KnowledgeBundle.getAttomAvm(prop.zip, prop.sqft);
  const avm = avmList.length > 0 ? avmList[0] : null;

  try {
    // Apply AI Analysis with error handling
    const aiResult = await analyzePropertyFlip({
      address: prop.address,
      zip: prop.zip,
      sqft: prop.sqft,
      listPrice: prop.listPrice,
      images: prop.images || [],
    });

    return { 
      ...prop, 
      marketIntelligence: { benchmarks }, 
      comps, 
      velocity, 
      avm,
      decision: aiResult.data.decision,
      afterRepairValue: aiResult.data.arv,
      mao25k: aiResult.data.mao25k,
      mao50k: aiResult.data.mao50k,
      renovationBudget: aiResult.data.rehabEstimate,
      rehabTier: aiResult.data.rehabTier,
      rationale: aiResult.narrative,
    };
  } catch (aiError) {
    console.error(`AI analysis failed for property ${prop.id}:`, aiError);
    // Return property without AI enrichment
    return {
      ...prop,
      marketIntelligence: { benchmarks },
      comps,
      velocity,
      avm,
    };
  }
}));
```

---

### 4. AI Analysis Performance Issue on Page Load
**File**: `src/app/page.tsx:45-70`

**Problem**: AI analysis is run server-side for every property during page load with no caching. This causes significant latency with many properties.

**Current Code**:
```typescript
// Apply AI Analysis to every property - NO CACHING
const enriched = await Promise.all(serialized.map(async (p) => {
  const calculated = addCalculations(p);
  const aiResult = await analyzePropertyFlip({
    address: p.address,
    zip: p.zip,
    sqft: p.sqft,
    listPrice: p.listPrice,
    images: p.images || [],
  });
  // ... rest of processing
}));
```

**Fix Options**:

**Option A: Add Simple In-Memory Caching (Recommended for immediate fix)**
```typescript
// Simple cache for AI analysis results
const aiAnalysisCache = new Map<string, any>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

async function getCachedAIAnalysis(property: any) {
  const cacheKey = `${property.id}-${property.listPrice}-${property.sqft}`;
  const cached = aiAnalysisCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  
  const result = await analyzePropertyFlip({
    address: property.address,
    zip: property.zip,
    sqft: property.sqft,
    listPrice: property.listPrice,
    images: property.images || [],
  });
  
  aiAnalysisCache.set(cacheKey, { data: result, timestamp: Date.now() });
  return result;
}
```

**Option B: Store AI Results in Database (Long-term solution)**
- Add fields to Property model: `aiDecision`, `aiARV`, `aiRehabEstimate`, `aiAnalyzedAt`
- Only re-run AI analysis if property data changes or `aiAnalyzedAt` is older than threshold

**Option C: Move AI Analysis to Client-Side**
- Fetch properties without AI analysis on server
- Trigger AI analysis client-side on-demand (e.g., when user clicks "Analyze Deal")

---

### 5. Prisma Provider Change Verification
**File**: `prisma/schema.prisma:2`

**Change**: Provider changed from `prisma-client` to `prisma-client-js`

**Status**: ✅ **This is CORRECT**
- `prisma-client-js` is the standard, correct provider name for Prisma
- The previous `prisma-client` was likely a typo or legacy value
- No action needed

---

## Implementation Order

1. **Fix duplicate status field** (Critical - blocks development)
2. **Create database migration** (Critical - required for production)
3. **Add AI error handling** (Warning - prevents API failures)
4. **Implement AI caching** (Warning - improves performance)
5. **Run tests** (Verify all changes work)

---

## Status Workflow Mapping

The new flipping-focused status workflow:

```
NEW_LEAD → UNDERWRITING → OFFER_PENDING → UNDER_CONTRACT → ACTIVE_REHAB → LISTED → CLOSED
                ↓
            ARCHIVED (if deal falls through)
```

| Old Status        | New Status     | Reasoning                          |
|-------------------|----------------|------------------------------------|
| AVAILABLE         | NEW_LEAD       | New lead in the system             |
| UNDER_RENOVATION  | ACTIVE_REHAB   | Property is being rehabbed         |
| SOLD              | CLOSED         | Deal is complete                   |
| OFF_MARKET        | ARCHIVED       | No longer being worked             |

---

## Testing Checklist

- [ ] Prisma schema validates without errors
- [ ] Migration runs successfully on test database
- [ ] Properties with old statuses are correctly mapped
- [ ] API returns properties with `enrich=true` even if AI fails
- [ ] AI analysis is cached and doesn't re-run on every request
- [ ] All existing tests pass
- [ ] New tests added for error handling scenarios
