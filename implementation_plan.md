# Implementation Plan: Integrate Processed Data into AI Scoring

## Status: ✅ IMPLEMENTED

The core integration has been completed. The build passes successfully.

## [Overview]

This plan outlines how to integrate the processed market data files into your Property App's AI scoring system to make deal analysis more accurate. The processed data contains Zillow Home Value Index (ZHVI), Zillow Rent Index (ZORI), census data, and ML-generated predictions that can replace the current hardcoded regional benchmarks with real market data.

Currently, the AI scoring engine (`enhancedScoring.ts`) uses static regional benchmarks for East Texas cities. By integrating the processed CSV data and predictions JSON, we can:

1. Use actual market data (ZHVI, ZORI) for property valuations
2. Leverage ML-generated predictions (rent, ARV, yield, deal scores)
3. Enrich property data with real-time market intelligence
4. Store and query predictions more efficiently from the database

---

## [Types]

### New Types for Market Data Integration

```typescript
// Market data from processed CSVs
interface MarketIntelligence {
  // Property identification
  propertyId: string;
  address: string;
  city: string;
  county: string;
  zip: string;

  // Property specs
  price: number;
  sqft: number;
  beds: number;
  baths: number;

  // Zillow ZHVI (Home Value Index)
  zhviCurrent: number;
  zhvi1YrAgo: number;
  zhvi2YrAgo: number;
  zhvi1YrGrowth: number;
  zhvi2YrGrowth: number;

  // Zillow ZORI (Rent Index)
  zoriCurrent: number;
  zori1YrAgo: number;
  zori1YrGrowth: number;

  // Census data
  censusMedianHomeValue: number;
  censusMedianGrossRent: number;
  censusMedianHouseholdIncome: number;

  // Target/ML predictions
  targetARV: number;
  targetRent: number;
  targetYield: number;

  // AI predictions
  predictedRent: number;
  predictedARV: number;
  grossYield: number;
  equityPotential: number;
  confidence: number;
  dealScore: number;
  recommendation: "PLATINUM" | "GOLD" | "SILVER" | "CAUTION" | "HARD_FAIL";
}

// Extended property type with market intelligence
interface PropertyWithMarketData extends PropertyWithCalculations {
  marketIntelligence?: MarketIntelligence;
  zhviCurrent?: number;
  zoriCurrent?: number;
  censusMedianHomeValue?: number;
  censusMedianGrossRent?: number;
  predictedRent?: number;
  predictedARV?: number;
  aiConfidence?: number;
  aiRecommendation?: string;
}
```

---

## [Files]

### New Files to Create

1. **`src/lib/marketData.ts`** - Market data loader and utilities
   - Load and cache processed CSV data
   - Provide lookup functions for ZHVI, ZORI by city/zip
   - Merge market data with properties

2. **`src/lib/ai/predictionService.ts`** - Prediction service layer
   - Fetch predictions from JSON or database
   - Enrich properties with AI predictions
   - Cache predictions for performance

3. **`src/types/marketIntelligence.ts`** - TypeScript type definitions
   - MarketIntelligence interface
   - PropertyWithMarketData interface

### Existing Files to Modify

1. **`src/lib/ai/enhancedScoring.ts`**
   - Update `RegionalBenchmarks` to accept dynamic market data
   - Add function to fetch ZHVI/ZORI for a property's location
   - Use actual market data instead of hardcoded values

2. **`src/app/api/predictions/route.ts`**
   - Add POST endpoint to save predictions to database
   - Add market data enrichment to predictions
   - Implement caching for better performance

3. **`src/app/api/properties/route.ts`**
   - Add market data enrichment when fetching properties
   - Include AI predictions in property responses

4. **`src/components/AIDealScoring.tsx`**
   - Update to display market intelligence data
   - Show confidence scores and recommendations

5. **`src/lib/calculations.ts`**
   - Add market data fields to PropertyBase interface

---

## [Functions]

### New Functions

1. **`loadMarketData()`** in `src/lib/marketData.ts`
   - Loads processed CSV files into memory
   - Returns Map<city, MarketIntelligence[]>

2. **`getZHVIForLocation(city, zip)`** in `src/lib/marketData.ts`
   - Returns ZHVI data for a specific location
   - Falls back to county-level data if city not found

3. **`getZORIForLocation(city, zip)`** in `src/lib/marketData.ts`
   - Returns rent index data for a location

4. **`enrichWithMarketData(property)`** in `src/lib/marketData.ts`
   - Merges property with available market data
   - Returns PropertyWithMarketData

5. **`getPredictionForProperty(propertyId)`** in `src/lib/ai/predictionService.ts`
   - Fetches ML prediction for a property
   - Returns predicted rent, ARV, yield, deal score

6. **`enrichWithPredictions(properties)`** in `src/lib/ai/predictionService.ts`
   - Batch enriches properties with AI predictions

### Modified Functions

1. **`calculateEnhancedScore(property, neighborhoodData)`** in `src/lib/ai/enhancedScoring.ts`
   - Accept optional market data parameter
   - Use actual ZHVI/ZORI for benchmark calculations

2. **`GET /api/predictions`** in `src/app/api/predictions/route.ts`
   - Add enrichment with market data
   - Implement response caching

3. **`GET /api/properties`** in `src/app/api/properties/route.ts`
   - Add optional `enrich` query param
   - Include market data and predictions when requested

---

## [Classes]

No new classes required. All changes are functional.

---

## [Dependencies]

### New Dependencies

No new npm packages required. All functionality uses existing packages:

- `fs` (Node.js built-in) - for loading CSV/JSON files
- `papaparse` (already in project) - for CSV parsing if needed

### Configuration Updates

1. **Update `.env.local`** (optional)
   ```
   # Market data configuration
   MARKET_DATA_PATH=./processed
   PREDICTIONS_PATH=./predictions_for_app.json
   ENABLE_MARKET_DATA=true
   ```

---

## [Testing]

### Test Files to Create

1. **`tests/marketData.test.ts`**
   - Test loading market data from CSV
   - Test ZHVI/ZORI lookup functions
   - Test fallback to county data

2. **`tests/predictionService.test.ts`**
   - Test fetching predictions
   - Test batch enrichment

### Validation Strategies

1. Verify market data loads correctly
2. Confirm ZHVI/ZORI values match source CSVs
3. Validate predictions JSON is properly parsed
4. Test API responses include market data
5. Verify AI scoring uses actual market data

---

## [Implementation Order]

1. **Create type definitions** - Define MarketIntelligence and PropertyWithMarketData types in new `src/types/marketIntelligence.ts`

2. **Create market data loader** - Build `src/lib/marketData.ts` to load and query CSV data

3. **Create prediction service** - Build `src/lib/ai/predictionService.ts` for prediction fetching

4. **Update enhanced scoring** - Modify `src/lib/ai/enhancedScoring.ts` to accept dynamic market data

5. **Update properties API** - Add market data enrichment to `/api/properties`

6. **Update predictions API** - Enhance `/api/predictions` with caching and market data

7. **Update AIDealScoring component** - Display new market intelligence in UI

8. **Test integration** - Verify all components work together

---

## Data Sources Summary

| File                                 | Records | Key Fields                                                |
| ------------------------------------ | ------- | --------------------------------------------------------- |
| `predictions_for_app.json`           | 373     | predicted_rent, predicted_arv, deal_score, recommendation |
| `brrr_training_enriched_cleaned.csv` | 45      | zhvi, zori, census data                                   |
| `consolidated_zillow_zhvi.csv`       | Varies  | ZHVI by location                                          |
| `consolidated_zillow_zori.csv`       | Varies  | ZORI by location                                          |
| `consolidated_zillow_inventory.csv`  | Varies  | Inventory levels                                          |
