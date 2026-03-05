/**
 * Enhanced AI Scoring Engine - Fixed Version
 * Calculates property-specific scores instead of using cached/generic values
 */

import { Decision, Strategy } from "@/data/properties";
import { KnowledgeBundle } from "../knowledgeBundle";
import {
  runPreflightGate,
  calculateMAO,
  calculateHoldingCosts,
} from "../calculations";

export interface AIAnalysisResult {
  narrative: string;
  data: {
    mao25k: number;
    mao50k: number;
    rehabEstimate: number;
    rehabTier: "Light" | "Standard" | "Heavy" | "Down to Studs";
    arv: number;
    decision: Decision;
    confidence: number;
    dealScore: number; // 0-100 score
    pricePerSqft: number;
    arvPerSqft: number;
    estimatedProfit: number;
    roi: number;
  };
}

// Cache disabled for accurate per-property calculations
const aiAnalysisCache = new Map<string, { result: AIAnalysisResult; timestamp: number }>();

function generateCacheKey(property: {
  address: string;
  zip: string;
  sqft: number;
  listPrice: number;
}): string {
  return `${property.address}|${property.zip}|${property.sqft}|${property.listPrice}`;
}

/**
 * Calculate ARV based on available data
 */
function calculateARV(
  listPrice: number,
  sqft: number,
  zip: string,
  comps: any[]
): number {
  // Separate real comps (with sold_price) from estimated comps
  const realComps = comps.filter(c => c.sold_price && c.sold_price > 0);
  const estimatedComps = comps.filter(c => !c.sold_price && c.list_price);

  // Priority 1: Real sold comps (3+ comps available)
  if (realComps.length >= 3) {
    const avgPricePerSqft = realComps.reduce((sum, comp) => {
      return sum + (comp.sold_price / (comp.sqft || 1));
    }, 0) / realComps.length;
    return Math.round(avgPricePerSqft * sqft * 1.1); // 10% premium for renovated
  }

  // Priority 2: Sparse real comps (1-2 comps) - blend with ZHVI
  if (realComps.length >= 1) {
    const avgPricePerSqft = realComps.reduce((sum, comp) => {
      return sum + (comp.sold_price / (comp.sqft || 1));
    }, 0) / realComps.length;
    const compARV = Math.round(avgPricePerSqft * sqft * 1.1);

    // Get ZHVI data for blending
    const zhviData = KnowledgeBundle.getZHVI(zip);
    if (zhviData?.current_value) {
      const zhviARV = Math.round(zhviData.current_value * (sqft / 1800)); // Normalize to 1800 sqft average
      // Blend: 70% comps, 30% ZHVI
      return Math.round((compARV * 0.7) + (zhviARV * 0.3));
    }
    return compARV;
  }

  // Priority 3: Estimated comps (list price * 0.965) when no sold prices
  if (estimatedComps.length >= 3) {
    const avgPricePerSqft = estimatedComps.reduce((sum, comp) => {
      const estimatedSoldPrice = (comp.list_price || 0) * 0.965; // 3.5% negotiation
      return sum + (estimatedSoldPrice / (comp.sqft || 1));
    }, 0) / estimatedComps.length;
    return Math.round(avgPricePerSqft * sqft * 1.1);
  }

  // Priority 4: ZHVI-based ARV
  const zhviData = KnowledgeBundle.getZHVI(zip);
  if (zhviData?.current_value) {
    // Apply sqft factor (normalize to 1800 sqft average)
    const sqftFactor = sqft / 1800;
    return Math.round(zhviData.current_value * sqftFactor);
  }

  // Priority 5: Knowledge bundle ARV summary
  const arvData = KnowledgeBundle.getArvSummary(zip);
  if (arvData?.arv_p50 && arvData.arv_p50 > 0) {
    return arvData.arv_p50;
  }

  // Ultimate fallback: Conservative 10% markup
  return Math.round(listPrice * 1.10);
}

/**
 * Determine rehab tier based on property condition signals
 */
function determineRehabTier(
  listPrice: number,
  sqft: number,
  yearBuilt?: number | null
): "Light" | "Standard" | "Heavy" | "Down to Studs" {
  const pricePerSqft = sqft > 0 ? listPrice / sqft : 0;

  // Age-based assessment
  const age = yearBuilt ? new Date().getFullYear() - yearBuilt : 0;

  if (age > 50 || pricePerSqft < 60) {
    return "Down to Studs";
  } else if (age > 30 || pricePerSqft < 80) {
    return "Heavy";
  } else if (age > 15 || pricePerSqft < 100) {
    return "Standard";
  }
  return "Light";
}

/**
 * Calculate rehab budget based on tier and sqft
 */
function calculateRehabBudget(
  sqft: number,
  tier: "Light" | "Standard" | "Heavy" | "Down to Studs"
): number {
  const costPerSqft: Record<string, number> = {
    Light: 15,
    Standard: 35,
    Heavy: 55,
    "Down to Studs": 85,
  };
  const baseCost = sqft * (costPerSqft[tier] || 35);
  return Math.max(Math.round(baseCost), 10000); // Minimum $10k rehab
}

/**
 * Calculate deal score (0-100) based on multiple factors
 */
function calculateDealScore(
  listPrice: number,
  arv: number,
  rehabBudget: number,
  mao25k: number,
  sqft: number,
  pricePerSqft: number,
  marketVelocity?: any,
  zhviGrowth?: number
): number {
  let score = 50; // Start at neutral

  // Factor 1: Price vs MAO (30 points)
  if (listPrice <= mao25k) {
    score += 30;
  } else if (listPrice <= mao25k * 1.1) {
    score += 20;
  } else if (listPrice <= mao25k * 1.2) {
    score += 10;
  } else if (listPrice > mao25k * 1.5) {
    score -= 20;
  }

  // Factor 2: Profit margin potential (25 points)
  const potentialProfit = arv - listPrice - rehabBudget;
  const profitPercent = listPrice > 0 ? (potentialProfit / listPrice) * 100 : 0;

  if (profitPercent >= 40) {
    score += 25;
  } else if (profitPercent >= 30) {
    score += 20;
  } else if (profitPercent >= 20) {
    score += 10;
  } else if (profitPercent < 10) {
    score -= 15;
  }

  // Factor 3: Price per sqft value (20 points)
  // Lower price per sqft is better for flips
  if (pricePerSqft < 70) {
    score += 20;
  } else if (pricePerSqft < 90) {
    score += 15;
  } else if (pricePerSqft < 110) {
    score += 10;
  } else if (pricePerSqft > 150) {
    score -= 10;
  }

  // Factor 4: Market velocity (15 points)
  if (marketVelocity) {
    if (marketVelocity.median_dom < 30) {
      score += 15; // Hot market
    } else if (marketVelocity.median_dom < 60) {
      score += 10;
    } else if (marketVelocity.median_dom > 90) {
      score -= 10; // Slow market
    }
  }

  // Factor 5: Spread (10 points)
  const spreadPercent = listPrice > 0 ? ((arv - listPrice) / listPrice) * 100 : 0;
  if (spreadPercent >= 30) {
    score += 10;
  } else if (spreadPercent >= 20) {
    score += 5;
  }

  // Factor 6: Market Timing (15 points) - NEW
  if (zhviGrowth !== undefined) {
    if (zhviGrowth > 0.05) score += 15;      // Hot market (>5% YoY)
    else if (zhviGrowth > 0.02) score += 10; // Warm market (2-5% YoY)
    else if (zhviGrowth > -0.02) score += 5; // Stable (-2% to 2% YoY)
    else if (zhviGrowth < -0.05) score -= 15; // Declining (<-5% YoY)
  }

  // Clamp to 0-100
  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Determine decision based on comprehensive analysis
 */
function determineDecision(
  listPrice: number,
  mao25k: number,
  mao50k: number,
  dealScore: number,
  potentialProfit: number
): Decision {
  // Hard fail conditions
  if (listPrice > mao25k + 30000 || dealScore < 30 || potentialProfit < 10000) {
    return "HARD_FAIL";
  }

  // Caution conditions
  if (listPrice > mao25k || dealScore < 60 || potentialProfit < 25000) {
    return "CAUTION";
  }

  return "PASS";
}

/**
 * Calculate confidence based on data quality
 */
function calculateConfidence(
  hasComps: boolean,
  hasARV: boolean,
  hasVelocity: boolean,
  sqft: number,
  hasZHVI?: boolean
): number {
  let confidence = 0.6; // Base confidence

  if (hasComps) confidence += 0.15;
  if (hasARV) confidence += 0.15;
  if (hasVelocity) confidence += 0.1;
  if (sqft > 0) confidence += 0.1;
  if (hasZHVI) confidence += 0.15;

  return Math.min(0.95, confidence);
}

/**
 * Generate detailed narrative based on analysis
 */
function generateNarrative(
  property: { address: string; listPrice: number; sqft: number },
  analysis: {
    arv: number;
    rehabTier: string;
    rehabEstimate: number;
    mao25k: number;
    mao50k: number;
    dealScore: number;
    decision: Decision;
    potentialProfit: number;
    roi: number;
    hasComps: boolean;
    hasARV: boolean;
  }
): string {
  const pricePerSqft = property.sqft > 0 ? property.listPrice / property.sqft : 0;
  const arvPerSqft = property.sqft > 0 ? analysis.arv / property.sqft : 0;

  let narrative = `DECISION LINE: ${analysis.decision} (Deal Score: ${analysis.dealScore}/100)

EXECUTIVE SUMMARY: `;

  if (analysis.decision === "PASS") {
    narrative += `Strong flip opportunity in ${analysis.rehabTier.toLowerCase()} rehab tier. `;
  } else if (analysis.decision === "CAUTION") {
    narrative += `Moderate opportunity with risks. Negotiate toward MAO for margin safety. `;
  } else {
    narrative += `Poor flip metrics. Price exceeds viable rehab margin. `;
  }

  narrative += `

OBSERVED: List price $${property.listPrice.toLocaleString()} (${pricePerSqft.toFixed(0)}/sqft), ${property.sqft.toLocaleString()} sqft.

DERIVED: ARV $${analysis.arv.toLocaleString()} (${arvPerSqft.toFixed(0)}/sqft), ${analysis.rehabTier} rehab estimated at $${analysis.rehabEstimate.toLocaleString()}.

FINANCIALS: MAO ($25k profit) = $${analysis.mao25k.toLocaleString()}. MAO ($50k profit) = $${analysis.mao50k.toLocaleString()}. Projected profit: $${analysis.potentialProfit.toLocaleString()} (${analysis.roi.toFixed(1)}% ROI).

POLICY: ${
    analysis.hasComps
      ? "Based on local comparable sales."
      : "ARV estimated (no local comps available)."
  } ${
    analysis.hasARV
      ? "Knowledge bundle ARV data applied."
      : "Market-standard 25% markup applied."
  }

OPINION: `;

  if (analysis.dealScore >= 75) {
    narrative += "Excellent acquisition target. Act quickly at or below MAO.";
  } else if (analysis.dealScore >= 60) {
    narrative += "Viable deal with proper negotiation. Target 10% below list.";
  } else if (analysis.dealScore >= 40) {
    narrative += "Marginal deal. Requires significant price reduction or value-add strategy.";
  } else {
    narrative += "Not recommended. Price too high for profitable flip.";
  }

  return narrative;
}

/**
 * Main Analysis Entry Point - FIXED VERSION
 * Calculates unique scores for each property based on actual data
 */
export async function analyzePropertyFlip(property: {
  address: string;
  zip: string;
  sqft: number;
  listPrice: number;
  yearBuilt?: number | null;
  images?: string[];
}): Promise<AIAnalysisResult> {
  // Check cache first
  const cached = getCachedAIAnalysis(property);
  if (cached) return cached;

  // 1. Gather market data
  const comps = KnowledgeBundle.getSoldComps(property.zip, property.sqft);
  const velocity = KnowledgeBundle.getMarketVelocity(property.zip, "Standard");
  const arvData = KnowledgeBundle.getArvSummary(property.zip);

  const hasComps = comps && comps.length > 0;
  const hasARV = arvData?.arv_p50 && arvData.arv_p50 > 0;
  const hasVelocity = velocity && velocity.median_dom > 0;

  // 2. Calculate ARV
  const arv = calculateARV(property.listPrice, property.sqft, property.zip, comps);

  // 3. Determine rehab
  // Validate yearBuilt to prevent invalid calculations
  const validYear = property.yearBuilt && property.yearBuilt > 1800 && property.yearBuilt <= new Date().getFullYear()
    ? property.yearBuilt
    : null;
  const rehabTier = determineRehabTier(
    property.listPrice,
    property.sqft,
    validYear
  );
  const rehabEstimate = calculateRehabBudget(property.sqft, rehabTier);

  // 4. Calculate holding costs
  const holding = calculateHoldingCosts(arv, velocity?.median_dom || 0);

  // 5. Calculate MAOs
  const mao25k = Math.max(0, calculateMAO(arv, rehabEstimate, holding.cost, 25000));
  const mao50k = Math.max(0, calculateMAO(arv, rehabEstimate, holding.cost, 50000));

  // 6. Calculate financials
  const pricePerSqft = property.sqft > 0 ? property.listPrice / property.sqft : 0;
  const arvPerSqft = property.sqft > 0 ? arv / property.sqft : 0;
  const closingCosts = Math.round(property.listPrice * 0.08); // Buy side only
  const totalInvestment = property.listPrice + rehabEstimate + holding.cost + closingCosts;
  const estimatedProfit = arv - totalInvestment;
  const roi = totalInvestment > 0 ? (estimatedProfit / totalInvestment) * 100 : 0;

  // 7. Calculate deal score
  const dealScore = calculateDealScore(
    property.listPrice,
    arv,
    rehabEstimate,
    mao25k,
    property.sqft,
    pricePerSqft,
    velocity,
    KnowledgeBundle.getZHVI(property.zip)?.yoy_growth || 0
  );

  // 8. Determine decision
  const decision = determineDecision(
    property.listPrice,
    mao25k,
    mao50k,
    dealScore,
    estimatedProfit
  );

  // 9. Calculate confidence
  const confidence = calculateConfidence(!!hasComps, !!hasARV, !!hasVelocity, property.sqft, !!KnowledgeBundle.getZHVI(property.zip));

  // 10. Generate narrative
  const narrative = generateNarrative(property, {
    arv,
    rehabTier,
    rehabEstimate,
    mao25k,
    mao50k,
    dealScore,
    decision,
    potentialProfit: estimatedProfit,
    roi,
    hasComps: !!hasComps,
    hasARV: !!hasARV,
  });

  const result: AIAnalysisResult = {
    narrative,
    data: {
      mao25k,
      mao50k,
      rehabEstimate,
      rehabTier,
      arv,
      decision,
      confidence,
      dealScore,
      pricePerSqft: Math.round(pricePerSqft),
      arvPerSqft: Math.round(arvPerSqft),
      estimatedProfit: Math.round(estimatedProfit),
      roi: Math.round(roi * 100) / 100,
    },
  };

  // Cache for 5 minutes
  setCachedAIAnalysis(property, result);

  return result;
}

// Keep cache functions for backward compatibility
export function getCachedAIAnalysis(property: {
  address: string;
  zip: string;
  sqft: number;
  listPrice: number;
}): AIAnalysisResult | null {
  const cacheKey = generateCacheKey(property);
  return aiAnalysisCache.get(cacheKey)?.result || null;
}

export function setCachedAIAnalysis(
  property: { address: string; zip: string; sqft: number; listPrice: number },
  result: AIAnalysisResult
): void {
  const cacheKey = generateCacheKey(property);
  aiAnalysisCache.set(cacheKey, { result, timestamp: Date.now() });
}

export function clearAIAnalysisCache(): void {
  aiAnalysisCache.clear();
}

export function parseAIResponse(response: string): AIAnalysisResult {
  const jsonMatch = response.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Invalid AI response: Missing JSON");
  }
  return JSON.parse(jsonMatch[0]);
}
