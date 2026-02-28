export interface MarketIntelligence {
  // Property identification
  propertyId?: string;
  address?: string;
  city: string;
  county?: string;
  zip?: string;

  // Property specs
  price?: number;
  sqft?: number;
  beds?: number;
  baths?: number;

  // Zillow ZHVI (Home Value Index)
  zhviCurrent: number;
  zhvi1YrAgo?: number;
  zhvi2YrAgo?: number;
  zhvi1YrGrowth: number;
  zhvi2YrGrowth?: number;

  // Zillow ZORI (Rent Index)
  zoriCurrent: number;
  zori1YrAgo?: number;
  zori1YrGrowth?: number;

  // Census data
  censusMedianHomeValue?: number;
  censusMedianGrossRent?: number;
  censusMedianHouseholdIncome?: number;

  // AI predictions
  predictedRent?: number;
  predictedARV?: number;
  grossYield?: number;
  equityPotential?: number;
  confidence?: number;
  dealScore?: number;
  recommendation?: "PLATINUM" | "GOLD" | "SILVER" | "CAUTION" | "HARD_FAIL";
}

// Regional Benchmark interface matching enhancedScoring.ts
export interface RegionalBenchmarks {
  city: string;
  state: string;
  capRate: { min: number; good: number; excellent: number };
  cashOnCash: { min: number; good: number; excellent: number };
  grossYield: { min: number; good: number; excellent: number };
  pricePerSqft: { min: number; good: number; excellent: number };
  pricePerDoor: { min: number; good: number; excellent: number };
  onePercentRule: boolean;
  daysOnMarketAvg: number;
  vacancyRateAvg: number;
  appreciationRate: number;
}
