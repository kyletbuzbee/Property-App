/**
 * Enhanced AI Scoring Engine with Regional Market Benchmarks
 * Tier 1 Implementation: Market-aware, region-specific scoring
 * 
 * Features:
 * - Regional benchmarks for East Texas markets
 * - Property-type specific weighting
 * - Dynamic score calculation based on local market conditions
 */

import { Property, Strategy } from '@/data/properties';

// ============================================================================
// REGIONAL MARKET BENCHMARKS - East Texas Markets
// ============================================================================

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

// Regional benchmarks for East Texas markets
export const REGIONAL_BENCHMARKS: Record<string, RegionalBenchmarks> = {
  'Tyler': {
    city: 'Tyler',
    state: 'TX',
    capRate: { min: 5, good: 7, excellent: 10 },
    cashOnCash: { min: 6, good: 10, excellent: 15 },
    grossYield: { min: 6, good: 9, excellent: 12 },
    pricePerSqft: { min: 120, good: 160, excellent: 200 },
    pricePerDoor: { min: 60000, good: 90000, excellent: 120000 },
    onePercentRule: true,
    daysOnMarketAvg: 45,
    vacancyRateAvg: 0.08,
    appreciationRate: 0.045,
  },
  'Longview': {
    city: 'Longview',
    state: 'TX',
    capRate: { min: 6, good: 8, excellent: 12 },
    cashOnCash: { min: 7, good: 12, excellent: 18 },
    grossYield: { min: 7, good: 10, excellent: 14 },
    pricePerSqft: { min: 90, good: 130, excellent: 170 },
    pricePerDoor: { min: 45000, good: 70000, excellent: 100000 },
    onePercentRule: true,
    daysOnMarketAvg: 38,
    vacancyRateAvg: 0.07,
    appreciationRate: 0.038,
  },
  'Marshall': {
    city: 'Marshall',
    state: 'TX',
    capRate: { min: 7, good: 10, excellent: 14 },
    cashOnCash: { min: 8, good: 14, excellent: 20 },
    grossYield: { min: 8, good: 12, excellent: 16 },
    pricePerSqft: { min: 70, good: 100, excellent: 140 },
    pricePerDoor: { min: 35000, good: 55000, excellent: 80000 },
    onePercentRule: true,
    daysOnMarketAvg: 42,
    vacancyRateAvg: 0.09,
    appreciationRate: 0.032,
  },
  'Kilgore': {
    city: 'Kilgore',
    state: 'TX',
    capRate: { min: 6, good: 9, excellent: 12 },
    cashOnCash: { min: 7, good: 12, excellent: 17 },
    grossYield: { min: 7, good: 11, excellent: 15 },
    pricePerSqft: { min: 80, good: 120, excellent: 160 },
    pricePerDoor: { min: 40000, good: 65000, excellent: 90000 },
    onePercentRule: true,
    daysOnMarketAvg: 35,
    vacancyRateAvg: 0.065,
    appreciationRate: 0.035,
  },
  'Jacksonville': {
    city: 'Jacksonville',
    state: 'TX',
    capRate: { min: 6, good: 9, excellent: 13 },
    cashOnCash: { min: 7, good: 13, excellent: 18 },
    grossYield: { min: 8, good: 11, excellent: 15 },
    pricePerSqft: { min: 75, good: 110, excellent: 150 },
    pricePerDoor: { min: 38000, good: 60000, excellent: 85000 },
    onePercentRule: true,
    daysOnMarketAvg: 40,
    vacancyRateAvg: 0.075,
    appreciationRate: 0.033,
  },
  'Henderson': {
    city: 'Henderson',
    state: 'TX',
    capRate: { min: 6, good: 9, excellent: 12 },
    cashOnCash: { min: 7, good: 12, excellent: 17 },
    grossYield: { min: 7, good: 10, excellent: 14 },
    pricePerSqft: { min: 85, good: 125, excellent: 165 },
    pricePerDoor: { min: 42000, good: 68000, excellent: 95000 },
    onePercentRule: true,
    daysOnMarketAvg: 37,
    vacancyRateAvg: 0.07,
    appreciationRate: 0.036,
  },
  'Gilmer': {
    city: 'Gilmer',
    state: 'TX',
    capRate: { min: 7, good: 10, excellent: 14 },
    cashOnCash: { min: 8, good: 14, excellent: 20 },
    grossYield: { min: 8, good: 12, excellent: 16 },
    pricePerSqft: { min: 75, good: 110, excellent: 150 },
    pricePerDoor: { min: 38000, good: 60000, excellent: 85000 },
    onePercentRule: true,
    daysOnMarketAvg: 44,
    vacancyRateAvg: 0.085,
    appreciationRate: 0.030,
  },
  'Athens': {
    city: 'Athens',
    state: 'TX',
    capRate: { min: 5, good: 8, excellent: 11 },
    cashOnCash: { min: 6, good: 11, excellent: 16 },
    grossYield: { min: 6, good: 9, excellent: 13 },
    pricePerSqft: { min: 100, good: 140, excellent: 180 },
    pricePerDoor: { min: 50000, good: 80000, excellent: 110000 },
    onePercentRule: true,
    daysOnMarketAvg: 41,
    vacancyRateAvg: 0.08,
    appreciationRate: 0.040,
  },
  'Mineola': {
    city: 'Mineola',
    state: 'TX',
    capRate: { min: 6, good: 9, excellent: 13 },
    cashOnCash: { min: 7, good: 13, excellent: 18 },
    grossYield: { min: 8, good: 11, excellent: 15 },
    pricePerSqft: { min: 80, good: 115, excellent: 155 },
    pricePerDoor: { min: 40000, good: 62000, excellent: 88000 },
    onePercentRule: true,
    daysOnMarketAvg: 39,
    vacancyRateAvg: 0.07,
    appreciationRate: 0.034,
  },
  'Lindale': {
    city: 'Lindale',
    state: 'TX',
    capRate: { min: 5, good: 7, excellent: 10 },
    cashOnCash: { min: 6, good: 10, excellent: 14 },
    grossYield: { min: 6, good: 8, excellent: 11 },
    pricePerSqft: { min: 130, good: 170, excellent: 210 },
    pricePerDoor: { min: 65000, good: 95000, excellent: 130000 },
    onePercentRule: true,
    daysOnMarketAvg: 32,
    vacancyRateAvg: 0.055,
    appreciationRate: 0.050,
  },
  'Bullard': {
    city: 'Bullard',
    state: 'TX',
    capRate: { min: 5, good: 7, excellent: 9 },
    cashOnCash: { min: 5, good: 9, excellent: 13 },
    grossYield: { min: 5, good: 8, excellent: 11 },
    pricePerSqft: { min: 140, good: 180, excellent: 220 },
    pricePerDoor: { min: 70000, good: 100000, excellent: 140000 },
    onePercentRule: true,
    daysOnMarketAvg: 30,
    vacancyRateAvg: 0.05,
    appreciationRate: 0.055,
  },
  'Whitehouse': {
    city: 'Whitehouse',
    state: 'TX',
    capRate: { min: 5, good: 7, excellent: 9 },
    cashOnCash: { min: 5, good: 9, excellent: 13 },
    grossYield: { min: 5, good: 8, excellent: 11 },
    pricePerSqft: { min: 135, good: 175, excellent: 215 },
    pricePerDoor: { min: 68000, good: 98000, excellent: 135000 },
    onePercentRule: true,
    daysOnMarketAvg: 28,
    vacancyRateAvg: 0.05,
    appreciationRate: 0.052,
  },
};

// Default benchmarks for unknown cities (conservative estimates)
const DEFAULT_BENCHMARKS: RegionalBenchmarks = {
  city: 'Default',
  state: 'TX',
  capRate: { min: 5, good: 7, excellent: 10 },
  cashOnCash: { min: 5, good: 10, excellent: 15 },
  grossYield: { min: 5, good: 8, excellent: 12 },
  pricePerSqft: { min: 100, good: 150, excellent: 200 },
  pricePerDoor: { min: 50000, good: 80000, excellent: 120000 },
  onePercentRule: true,
  daysOnMarketAvg: 45,
  vacancyRateAvg: 0.08,
  appreciationRate: 0.035,
};

// ============================================================================
// STRATEGY-SPECIFIC WEIGHTING
// ============================================================================

export interface StrategyWeights {
  capRate: number;
  cashOnCash: number;
  equityGap: number;
  onePercentRule: number;
  grossYield: number;
  pricePerSqft: number;
  decisionQuality: number;
  neighborhoodScore: number;
  cashFlow: number;
  appreciation: number;
}

export const STRATEGY_WEIGHTS: Record<Strategy, StrategyWeights> = {
  'BRRR': {
    capRate: 0.18,
    cashOnCash: 0.20,
    equityGap: 0.15,
    onePercentRule: 0.10,
    grossYield: 0.08,
    pricePerSqft: 0.08,
    decisionQuality: 0.08,
    neighborhoodScore: 0.05,
    cashFlow: 0.05,
    appreciation: 0.03,
  },
  'Retail Flip': {
    capRate: 0.05,
    cashOnCash: 0.10,
    equityGap: 0.20,
    onePercentRule: 0.05,
    grossYield: 0.05,
    pricePerSqft: 0.15,
    decisionQuality: 0.10,
    neighborhoodScore: 0.10,
    cashFlow: 0.05,
    appreciation: 0.15,
  },
  'Section 8': {
    capRate: 0.20,
    cashOnCash: 0.20,
    equityGap: 0.10,
    onePercentRule: 0.15,
    grossYield: 0.15,
    pricePerSqft: 0.05,
    decisionQuality: 0.05,
    neighborhoodScore: 0.05,
    cashFlow: 0.03,
    appreciation: 0.02,
  },
  'Owner Finance': {
    capRate: 0.15,
    cashOnCash: 0.18,
    equityGap: 0.12,
    onePercentRule: 0.12,
    grossYield: 0.15,
    pricePerSqft: 0.08,
    decisionQuality: 0.08,
    neighborhoodScore: 0.05,
    cashFlow: 0.05,
    appreciation: 0.02,
  },
  'Wholesaling': {
    capRate: 0.08,
    cashOnCash: 0.10,
    equityGap: 0.25,
    onePercentRule: 0.08,
    grossYield: 0.05,
    pricePerSqft: 0.12,
    decisionQuality: 0.15,
    neighborhoodScore: 0.07,
    cashFlow: 0.05,
    appreciation: 0.05,
  },
};

// ============================================================================
// ENHANCED SCORING TYPES
// ============================================================================

export interface PropertyMetrics {
  // Financial metrics
  capRate: number;
  cashOnCashReturn: number;
  grossYield: number;
  pricePerSqft: number;
  pricePerDoor: number;
  onePercentRule: boolean;
  equityGap: number;
  cashFlow: number;
  noi: number;
  
  // Property characteristics
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  listPrice: number;
  
  // Location data
  city: string;
  state: string;
  lat: number;
  lng: number;
  
  // Decision/Strategy
  decision: string;
  strategy: Strategy;
}

export interface EnhancedFactorScore {
  name: string;
  weight: number;
  score: number;
  rawValue: number;
  benchmarkValue: number;
  rating: 'excellent' | 'good' | 'fair' | 'poor';
  description: string;
}

export interface EnhancedScoringResult {
  propertyId: string;
  overallScore: number;
  riskLevel: 'Low Risk' | 'Medium Risk' | 'High Risk' | 'Very High Risk';
  riskColor: string;
  factorScores: EnhancedFactorScore[];
  regionalBenchmarks: RegionalBenchmarks;
  recommendations: string[];
  strengths: string[];
  weaknesses: string[];
}

// ============================================================================
// SCORE CALCULATION FUNCTIONS
// ============================================================================

/**
 * Get regional benchmarks for a property's location
 */
export function getRegionalBenchmarks(city: string, state: string): RegionalBenchmarks {
  const key = city.trim();
  if (REGIONAL_BENCHMARKS[key]) {
    return REGIONAL_BENCHMARKS[key];
  }
  
  // Try case-insensitive match
  const lowerCity = key.toLowerCase();
  for (const [benchmarkCity, benchmarks] of Object.entries(REGIONAL_BENCHMARKS)) {
    if (benchmarkCity.toLowerCase() === lowerCity) {
      return benchmarks;
    }
  }
  
  // Return default benchmarks
  return DEFAULT_BENCHMARKS;
}

/**
 * Calculate score based on regional benchmarks (0-100)
 */
function calculateBenchmarkScore(
  value: number,
  benchmarks: { min: number; good: number; excellent: number }
): number {
  if (value >= benchmarks.excellent) return 100;
  if (value >= benchmarks.good) return 70 + ((value - benchmarks.good) / (benchmarks.excellent - benchmarks.good)) * 30;
  if (value >= benchmarks.min) return 40 + ((value - benchmarks.min) / (benchmarks.good - benchmarks.min)) * 30;
  return Math.max(0, 20 + ((value - benchmarks.min / 2) / (benchmarks.min / 2)) * 20);
}

/**
 * Calculate Cap Rate score with regional benchmarks
 */
function calculateCapRateScore(capRate: number, benchmarks: RegionalBenchmarks): EnhancedFactorScore {
  const score = calculateBenchmarkScore(capRate, benchmarks.capRate);
  return {
    name: 'Cap Rate',
    weight: 0.18, // Default weight
    score: Math.round(score),
    rawValue: capRate,
    benchmarkValue: benchmarks.capRate.good,
    rating: score >= 80 ? 'excellent' : score >= 60 ? 'good' : score >= 40 ? 'fair' : 'poor',
    description: `Cap Rate of ${capRate.toFixed(2)}% vs regional target of ${benchmarks.capRate.good}%`,
  };
}

/**
 * Calculate Cash-on-Cash Return score with regional benchmarks
 */
function calculateCashOnCashScore(cashOnCash: number, benchmarks: RegionalBenchmarks): EnhancedFactorScore {
  const score = calculateBenchmarkScore(cashOnCash, benchmarks.cashOnCash);
  return {
    name: 'Cash-on-Cash Return',
    weight: 0.18,
    score: Math.round(score),
    rawValue: cashOnCash,
    benchmarkValue: benchmarks.cashOnCash.good,
    rating: score >= 80 ? 'excellent' : score >= 60 ? 'good' : score >= 40 ? 'fair' : 'poor',
    description: `CoC return of ${cashOnCash.toFixed(2)}% vs regional target of ${benchmarks.cashOnCash.good}%`,
  };
}

/**
 * Calculate Gross Yield score with regional benchmarks
 */
function calculateGrossYieldScore(grossYield: number, benchmarks: RegionalBenchmarks): EnhancedFactorScore {
  const score = calculateBenchmarkScore(grossYield, benchmarks.grossYield);
  return {
    name: 'Gross Yield',
    weight: 0.10,
    score: Math.round(score),
    rawValue: grossYield,
    benchmarkValue: benchmarks.grossYield.good,
    rating: score >= 80 ? 'excellent' : score >= 60 ? 'good' : score >= 40 ? 'fair' : 'poor',
    description: `Gross yield of ${grossYield.toFixed(2)}% vs regional target of ${benchmarks.grossYield.good}%`,
  };
}

/**
 * Calculate Price per SqFt score (inverse - lower is better)
 */
function calculatePricePerSqftScore(pricePerSqft: number, benchmarks: RegionalBenchmarks): EnhancedFactorScore {
  // For price per sqft, lower is better, so we invert the calculation
  const excellent = benchmarks.pricePerSqft.excellent;
  const good = benchmarks.pricePerSqft.good;
  const min = benchmarks.pricePerSqft.min;
  
  let score: number;
  if (pricePerSqft <= excellent) score = 100;
  else if (pricePerSqft <= good) score = 70 + ((good - pricePerSqft) / (good - excellent)) * 30;
  else if (pricePerSqft <= min) score = 40 + ((min - pricePerSqft) / (min - good)) * 30;
  else score = Math.max(0, 20 + ((min * 1.2 - pricePerSqft) / (min * 0.2)) * 20);
  
  return {
    name: 'Price per SqFt',
    weight: 0.08,
    score: Math.round(score),
    rawValue: pricePerSqft,
    benchmarkValue: benchmarks.pricePerSqft.good,
    rating: score >= 80 ? 'excellent' : score >= 60 ? 'good' : score >= 40 ? 'fair' : 'poor',
    description: `$${pricePerSqft.toFixed(0)}/sqft vs regional avg of $${benchmarks.pricePerSqft.good}`,
  };
}

/**
 * Calculate 1% Rule score
 */
function calculateOnePercentScore(onePercentRule: boolean, benchmarks: RegionalBenchmarks): EnhancedFactorScore {
  const score = onePercentRule ? 100 : benchmarks.onePercentRule ? 50 : 30;
  return {
    name: '1% Rule',
    weight: 0.12,
    score,
    rawValue: onePercentRule ? 1 : 0,
    benchmarkValue: 1,
    rating: score >= 80 ? 'excellent' : score >= 60 ? 'good' : score >= 40 ? 'fair' : 'poor',
    description: onePercentRule ? 'Meets the 1% rule' : 'Does not meet 1% rule',
  };
}

/**
 * Calculate Equity Gap score (higher gap = higher score for flips)
 */
function calculateEquityGapScore(equityGap: number, listPrice: number, strategy: Strategy): EnhancedFactorScore {
  const ratio = listPrice > 0 ? equityGap / listPrice : 0;
  
  // Different thresholds based on strategy
  let excellent: number, good: number, min: number;
  if (strategy === 'Retail Flip' || strategy === 'Wholesaling') {
    excellent = 0.30;
    good = 0.20;
    min = 0.10;
  } else {
    excellent = 0.25;
    good = 0.15;
    min = 0.08;
  }
  
  let score: number;
  if (ratio >= excellent) score = 100;
  else if (ratio >= good) score = 70 + ((ratio - good) / (excellent - good)) * 30;
  else if (ratio >= min) score = 40 + ((ratio - min) / (good - min)) * 30;
  else score = Math.max(0, 20 + (ratio / min) * 20);
  
  return {
    name: 'Equity Gap',
    weight: 0.12,
    score: Math.round(score),
    rawValue: equityGap,
    benchmarkValue: listPrice * good,
    rating: score >= 80 ? 'excellent' : score >= 60 ? 'good' : score >= 40 ? 'fair' : 'poor',
    description: `$${equityGap.toLocaleString()} (${(ratio * 100).toFixed(1)}% of list price)`,
  };
}

/**
 * Calculate Decision Quality score
 */
function calculateDecisionScore(decision: string): EnhancedFactorScore {
  const scores: Record<string, number> = {
    'Pass Platinum': 100,
    'Pass Gold': 85,
    'Pass Silver': 70,
    'Caution': 40,
    'Hard Fail': 10,
  };
  
  const score = scores[decision] ?? 50;
  
  return {
    name: 'Decision Quality',
    weight: 0.08,
    score,
    rawValue: score,
    benchmarkValue: 70,
    rating: score >= 80 ? 'excellent' : score >= 60 ? 'good' : score >= 40 ? 'fair' : 'poor',
    description: `Original decision: ${decision}`,
  };
}

/**
 * Calculate Cash Flow score
 */
function calculateCashFlowScore(cashFlow: number): EnhancedFactorScore {
  let score: number;
  if (cashFlow >= 500) score = 100;
  else if (cashFlow >= 300) score = 80;
  else if (cashFlow >= 150) score = 60;
  else if (cashFlow >= 0) score = 40;
  else score = Math.max(0, 20 + (cashFlow / 100) * 20);
  
  return {
    name: 'Monthly Cash Flow',
    weight: 0.06,
    score: Math.round(score),
    rawValue: cashFlow,
    benchmarkValue: 300,
    rating: score >= 80 ? 'excellent' : score >= 60 ? 'good' : score >= 40 ? 'fair' : 'poor',
    description: `$${cashFlow.toLocaleString()}/month`,
  };
}

/**
 * Calculate Appreciation Potential score
 */
function calculateAppreciationScore(benchmarks: RegionalBenchmarks): EnhancedFactorScore {
  const rate = benchmarks.appreciationRate * 100;
  let score: number;
  
  if (rate >= 5) score = 100;
  else if (rate >= 4) score = 80;
  else if (rate >= 3) score = 60;
  else if (rate >= 2) score = 40;
  else score = 20;
  
  return {
    name: 'Appreciation Potential',
    weight: 0.04,
    score: Math.round(score),
    rawValue: rate,
    benchmarkValue: 4,
    rating: score >= 80 ? 'excellent' : score >= 60 ? 'good' : score >= 40 ? 'fair' : 'poor',
    description: `${rate.toFixed(1)}% annual appreciation forecast`,
  };
}

/**
 * Calculate Neighborhood Score (placeholder for external data)
 */
function calculateNeighborhoodScore(neighborhoodData?: {
  schoolsScore?: number;
  crimeScore?: number;
  walkScore?: number;
}): EnhancedFactorScore {
  const score = neighborhoodData 
    ? ((neighborhoodData.schoolsScore ?? 50) * 0.4 + 
        (neighborhoodData.crimeScore ?? 50) * 0.3 + 
        (neighborhoodData.walkScore ?? 50) * 0.3)
    : 50;
  
  return {
    name: 'Neighborhood Score',
    weight: 0.04,
    score: Math.round(score),
    rawValue: score,
    benchmarkValue: 60,
    rating: score >= 80 ? 'excellent' : score >= 60 ? 'good' : score >= 40 ? 'fair' : 'poor',
    description: neighborhoodData 
      ? `Schools: ${neighborhoodData.schoolsScore ?? 'N/A'}, Crime: ${neighborhoodData.crimeScore ?? 'N/A'}, Walk: ${neighborhoodData.walkScore ?? 'N/A'}`
      : 'No neighborhood data available',
  };
}

// ============================================================================
// MAIN ENHANCED SCORING FUNCTION
// ============================================================================

/**
 * Calculate enhanced deal score for a property using regional benchmarks
 */
export function calculateEnhancedScore(
  property: PropertyMetrics,
  neighborhoodData?: {
    schoolsScore?: number;
    crimeScore?: number;
    walkScore?: number;
  }
): EnhancedScoringResult {
  // Get regional benchmarks
  const benchmarks = getRegionalBenchmarks(property.city, property.state);
  
  // Get strategy-specific weights
  const weights = STRATEGY_WEIGHTS[property.strategy];
  
  // Calculate individual factor scores
  const factorScores: EnhancedFactorScore[] = [];
  
  // Financial factors
  factorScores.push({
    ...calculateCapRateScore(property.capRate, benchmarks),
    weight: weights.capRate,
  });
  
  factorScores.push({
    ...calculateCashOnCashScore(property.cashOnCashReturn, benchmarks),
    weight: weights.cashOnCash,
  });
  
  factorScores.push({
    ...calculateGrossYieldScore(property.grossYield, benchmarks),
    weight: weights.grossYield,
  });
  
  factorScores.push({
    ...calculatePricePerSqftScore(property.pricePerSqft, benchmarks),
    weight: weights.pricePerSqft,
  });
  
  factorScores.push({
    ...calculateOnePercentScore(property.onePercentRule, benchmarks),
    weight: weights.onePercentRule,
  });
  
  factorScores.push({
    ...calculateEquityGapScore(property.equityGap, property.listPrice, property.strategy),
    weight: weights.equityGap,
  });
  
  factorScores.push({
    ...calculateDecisionScore(property.decision),
    weight: weights.decisionQuality,
  });
  
  factorScores.push({
    ...calculateCashFlowScore(property.cashFlow),
    weight: weights.cashFlow,
  });
  
  factorScores.push({
    ...calculateAppreciationScore(benchmarks),
    weight: weights.appreciation,
  });
  
  factorScores.push({
    ...calculateNeighborhoodScore(neighborhoodData),
    weight: weights.neighborhoodScore,
  });
  
  // Calculate weighted overall score
  let totalWeight = 0;
  let weightedScore = 0;
  
  factorScores.forEach(factor => {
    weightedScore += factor.score * factor.weight;
    totalWeight += factor.weight;
  });
  
  const overallScore = Math.round(weightedScore / totalWeight);
  
  // Determine risk level
  let riskLevel: 'Low Risk' | 'Medium Risk' | 'High Risk' | 'Very High Risk';
  let riskColor: string;
  
  if (overallScore >= 80) {
    riskLevel = 'Low Risk';
    riskColor = '#10b981'; // emerald
  } else if (overallScore >= 60) {
    riskLevel = 'Medium Risk';
    riskColor = '#3b82f6'; // blue
  } else if (overallScore >= 40) {
    riskLevel = 'High Risk';
    riskColor = '#f59e0b'; // amber
  } else {
    riskLevel = 'Very High Risk';
    riskColor = '#ef4444'; // red
  }
  
  // Generate recommendations
  const recommendations: string[] = [];
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  
  factorScores.forEach(factor => {
    if (factor.score >= 80) {
      strengths.push(`${factor.name}: ${factor.description}`);
    } else if (factor.score < 50) {
      weaknesses.push(`${factor.name}: ${factor.description}`);
    }
  });
  
  // Add strategic recommendations
  if (property.capRate < benchmarks.capRate.min) {
    recommendations.push(`Cap rate is below market average. Consider negotiating lower purchase price or increasing rent.`);
  }
  
  if (property.cashOnCashReturn < benchmarks.cashOnCash.min) {
    recommendations.push(`Cash-on-cash return is below target. Explore alternative financing or value-add opportunities.`);
  }
  
  if (!property.onePercentRule && benchmarks.onePercentRule) {
    recommendations.push(`Property doesn't meet 1% rule. Review rent potential or purchase price.`);
  }
  
  if (property.pricePerSqft > benchmarks.pricePerSqft.min) {
    recommendations.push(`Price per sqft is above market. Use as negotiation leverage.`);
  }
  
  if (overallScore >= 80) {
    recommendations.push(`Strong investment opportunity in ${property.city} market.`);
  } else if (overallScore < 50) {
    recommendations.push(`Consider this property for value-add strategy or pass for better opportunities.`);
  }
  
  return {
    propertyId: `${property.city}-${property.listPrice}`,
    overallScore,
    riskLevel,
    riskColor,
    factorScores,
    regionalBenchmarks: benchmarks,
    recommendations,
    strengths,
    weaknesses,
  };
}

// ============================================================================
// BATCH SCORING
// ============================================================================

/**
 * Calculate enhanced scores for multiple properties
 */
export function calculateBatchEnhancedScores(
  properties: PropertyMetrics[],
  neighborhoodDataMap?: Map<string, { schoolsScore?: number; crimeScore?: number; walkScore?: number }>
): EnhancedScoringResult[] {
  return properties.map(property => {
    const neighborhoodData = neighborhoodDataMap?.get(property.city);
    return calculateEnhancedScore(property, neighborhoodData);
  }).sort((a, b) => b.overallScore - a.overallScore);
}

// ============================================================================
// MARKET COMPARISON
// ============================================================================

/**
 * Compare a property against market benchmarks
 */
export function compareToMarket(
  property: PropertyMetrics,
  benchmarks: RegionalBenchmarks
): {
  metric: string;
  propertyValue: number;
  marketValue: number;
  comparison: 'above' | 'below' | 'at';
  percentDifference: number;
}[] {
  return [
    {
      metric: 'Cap Rate',
      propertyValue: property.capRate,
      marketValue: benchmarks.capRate.good,
      comparison: property.capRate >= benchmarks.capRate.good ? 'above' : 'below',
      percentDifference: benchmarks.capRate.good > 0 
        ? ((property.capRate - benchmarks.capRate.good) / benchmarks.capRate.good) * 100 
        : 0,
    },
    {
      metric: 'Cash-on-Cash',
      propertyValue: property.cashOnCashReturn,
      marketValue: benchmarks.cashOnCash.good,
      comparison: property.cashOnCashReturn >= benchmarks.cashOnCash.good ? 'above' : 'below',
      percentDifference: benchmarks.cashOnCash.good > 0 
        ? ((property.cashOnCashReturn - benchmarks.cashOnCash.good) / benchmarks.cashOnCash.good) * 100 
        : 0,
    },
    {
      metric: 'Gross Yield',
      propertyValue: property.grossYield,
      marketValue: benchmarks.grossYield.good,
      comparison: property.grossYield >= benchmarks.grossYield.good ? 'above' : 'below',
      percentDifference: benchmarks.grossYield.good > 0 
        ? ((property.grossYield - benchmarks.grossYield.good) / benchmarks.grossYield.good) * 100 
        : 0,
    },
    {
      metric: 'Price per SqFt',
      propertyValue: property.pricePerSqft,
      marketValue: benchmarks.pricePerSqft.good,
      comparison: property.pricePerSqft <= benchmarks.pricePerSqft.good ? 'above' : 'below',
      percentDifference: benchmarks.pricePerSqft.good > 0 
        ? ((property.pricePerSqft - benchmarks.pricePerSqft.good) / benchmarks.pricePerSqft.good) * 100 
        : 0,
    },
  ];
}
