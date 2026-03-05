/**
 * What-If Analysis Engine for Property Renovation Scenarios
 * Allows modeling additions and improvements to maximize flip profits
 */

import { Decision } from "@/data/properties";
import { KnowledgeBundle } from "../knowledgeBundle";
import {
  runPreflightGate,
  calculateMAO,
  calculateHoldingCosts,
  calculateHoldingCosts as calcHolding,
} from "../calculations";

export interface WhatIfScenario {
  name: string;
  additions: {
    sqft?: number;
    bedrooms?: number;
    bathrooms?: number;
  };
  improvements: {
    kitchen?: "basic" | "mid" | "high";
    bathrooms?: "basic" | "mid" | "high";
    flooring?: "basic" | "mid" | "high";
    hvac?: boolean;
    roof?: boolean;
    windows?: boolean;
  };
}

export interface ScenarioResult {
  scenario: WhatIfScenario;
  baseProperty: PropertyMetrics;
  projectedProperty: PropertyMetrics;
  comparison: ScenarioComparison;
}

export interface PropertyMetrics {
  listPrice: number;
  sqft: number;
  bedrooms: number;
  bathrooms: number;
  arv: number;
  rehabBudget: number;
  holdingCosts: number;
  closingCosts: number;
  mao25k: number;
  mao50k: number;
  projectedProfit: number;
  roi: number;
  decision: Decision;
}

export interface ScenarioComparison {
  profitDifference: number;
  roiDifference: number;
  additionalInvestment: number;
  paybackRatio: number; // Additional profit / Additional cost
  recommendation: string;
}

// Cost database for additions (East Texas market rates)
const ADDITION_COSTS = {
  sqft: {
    base: 85, // $85/sqft for basic addition (foundation, framing, roof, electrical)
    mid: 120, // $120/sqft with HVAC and finishes
    high: 165, // $165/sqft high-end finishes
  },
  bedroom: {
    base: 8000, // Minimum to add a bedroom (closet, window, egress)
    withBathroom: 25000, // Bedroom + bath addition
  },
  bathroom: {
    half: 8000, // Powder room
    full: 18000, // Full bathroom
    highEnd: 28000, // Luxury bath
  },
};

// ARV impact multipliers
const ARV_IMPACT = {
  perSqft: 0.6, // Each added sqft adds 60% of avg price/sqft to ARV
  perBedroom: 0.08, // +8% to ARV for each bedroom added (up to 4)
  perBathroom: 0.05, // +5% to ARV for each full bath added
  perHalfBath: 0.025, // +2.5% to ARV for half bath
};

// Improvement costs
const IMPROVEMENT_COSTS = {
  kitchen: {
    basic: 8000,
    mid: 15000,
    high: 28000,
  },
  bathrooms: {
    basic: 4000,
    mid: 8000,
    high: 15000,
  },
  flooring: {
    basic: 3, // $3/sqft
    mid: 5.5,
    high: 9,
  },
  hvac: 6500,
  roof: 8500,
  windows: 4500,
};

/**
 * Calculate ARV adjustment based on additions
 */
function calculateArvAdjustment(
  baseArv: number,
  baseSqft: number,
  additions: { sqft?: number; bedrooms?: number; bathrooms?: number }
): number {
  let adjustment = 0;

  // Sqft addition impact
  if (additions.sqft && additions.sqft > 0) {
    const pricePerSqft = baseArv / baseSqft;
    adjustment += additions.sqft * pricePerSqft * ARV_IMPACT.perSqft;
  }

  // Bedroom addition impact
  if (additions.bedrooms && additions.bedrooms > 0) {
    adjustment += baseArv * ARV_IMPACT.perBedroom * Math.min(additions.bedrooms, 2);
  }

  // Bathroom addition impact
  if (additions.bathrooms && additions.bathrooms > 0) {
    const fullBaths = Math.floor(additions.bathrooms);
    const halfBath = additions.bathrooms % 1 >= 0.5 ? 1 : 0;
    adjustment += baseArv * (ARV_IMPACT.perBathroom * fullBaths + ARV_IMPACT.perHalfBath * halfBath);
  }

  return Math.round(adjustment);
}

/**
 * Calculate cost of additions
 */
function calculateAdditionCosts(
  additions: { sqft?: number; bedrooms?: number; bathrooms?: number }
): number {
  let cost = 0;

  if (additions.sqft && additions.sqft > 0) {
    // Use mid-tier for sqft additions by default
    cost += additions.sqft * ADDITION_COSTS.sqft.mid;
  }

  if (additions.bedrooms && additions.bedrooms > 0) {
    // If adding both bedroom and bath together, use combined cost
    if (additions.bathrooms && additions.bathrooms >= 1) {
      cost += ADDITION_COSTS.bedroom.withBathroom * additions.bedrooms;
    } else {
      cost += ADDITION_COSTS.bedroom.base * additions.bedrooms;
    }
  }

  // Only add separate bathroom cost if not already included with bedroom
  if (additions.bathrooms && additions.bathrooms > 0 && !(additions.bedrooms && additions.bedrooms >= 1)) {
    const fullBaths = Math.floor(additions.bathrooms);
    const hasHalfBath = additions.bathrooms % 1 >= 0.5;
    cost += ADDITION_COSTS.bathroom.full * fullBaths;
    if (hasHalfBath) cost += ADDITION_COSTS.bathroom.half;
  }

  return Math.round(cost);
}

/**
 * Calculate improvement costs
 */
function calculateImprovementCosts(
  sqft: number,
  improvements: {
    kitchen?: "basic" | "mid" | "high";
    bathrooms?: "basic" | "mid" | "high";
    flooring?: "basic" | "mid" | "high";
    hvac?: boolean;
    roof?: boolean;
    windows?: boolean;
  }
): number {
  let cost = 0;

  if (improvements.kitchen) {
    cost += IMPROVEMENT_COSTS.kitchen[improvements.kitchen];
  }

  if (improvements.bathrooms) {
    cost += IMPROVEMENT_COSTS.bathrooms[improvements.bathrooms];
  }

  if (improvements.flooring) {
    cost += IMPROVEMENT_COSTS.flooring[improvements.flooring] * sqft;
  }

  if (improvements.hvac) cost += IMPROVEMENT_COSTS.hvac;
  if (improvements.roof) cost += IMPROVEMENT_COSTS.roof;
  if (improvements.windows) cost += IMPROVEMENT_COSTS.windows;

  return Math.round(cost);
}

/**
 * Run what-if analysis comparing base scenario to proposed scenario
 */
export function runWhatIfAnalysis(
  baseProperty: {
    listPrice: number;
    sqft: number;
    bedrooms: number;
    bathrooms: number;
    zip: string;
    annualTaxes: number;
    annualInsurance: number;
  },
  scenario: WhatIfScenario
): ScenarioResult {
  // Get base ARV from knowledge bundle
  const arvData = KnowledgeBundle.getArvSummary(baseProperty.zip);
  const baseArv = arvData?.arv_p50 || Math.round(baseProperty.listPrice * 1.25);
  
  // Base calculations
  const baseRehab = baseProperty.sqft * 35; // Base rehab $35/sqft
  const baseClosing = Math.round(baseProperty.listPrice * 0.1);
  const baseHolding = calculateHoldingCosts(baseArv, 0).cost + 
    baseProperty.annualTaxes / 2 + 
    baseProperty.annualInsurance / 2;
  
  const baseMao25k = calculateMAO(baseArv, baseRehab, baseHolding, 25000);
  const baseMao50k = calculateMAO(baseArv, baseRehab, baseHolding, 50000);
  
  const baseTotalInvestment = baseProperty.listPrice + baseRehab + baseHolding + baseClosing;
  const baseProfit = baseArv - baseTotalInvestment;
  const baseRoi = (baseProfit / baseTotalInvestment) * 100;

  // Calculate ARV adjustment
  const arvAdjustment = calculateArvAdjustment(baseArv, baseProperty.sqft, scenario.additions);
  const projectedArv = baseArv + arvAdjustment;

  // Calculate addition and improvement costs
  const additionCosts = calculateAdditionCosts(scenario.additions);
  const improvementCosts = calculateImprovementCosts(
    baseProperty.sqft + (scenario.additions.sqft || 0),
    scenario.improvements
  );
  
  const additionalRehab = additionCosts + improvementCosts;
  const totalRehab = baseRehab + additionalRehab;

  // Projected calculations
  const projectedClosing = Math.round(baseProperty.listPrice * 0.1); // Same purchase price
  const projectedHolding = calculateHoldingCosts(projectedArv, 0).cost +
    baseProperty.annualTaxes / 2 +
    baseProperty.annualInsurance / 2;
  
  const projectedMao25k = calculateMAO(projectedArv, totalRehab, projectedHolding, 25000);
  const projectedMao50k = calculateMAO(projectedArv, totalRehab, projectedHolding, 50000);
  
  const projectedTotalInvestment = baseProperty.listPrice + totalRehab + projectedHolding + projectedClosing;
  const projectedProfit = projectedArv - projectedTotalInvestment;
  const projectedRoi = (projectedProfit / projectedTotalInvestment) * 100;

  // Determine decision
  let decision: Decision = "PASS";
  if (baseProperty.listPrice > projectedMao25k + 15000) {
    decision = "HARD_FAIL";
  } else if (baseProperty.listPrice > projectedMao25k) {
    decision = "CAUTION";
  }

  // Comparison metrics
  const profitDifference = projectedProfit - baseProfit;
  const roiDifference = projectedRoi - baseRoi;
  const additionalInvestment = additionalRehab;
  const paybackRatio = additionalInvestment > 0 ? profitDifference / additionalInvestment : 0;

  // Generate recommendation
  let recommendation = "";
  if (paybackRatio > 1.5) {
    recommendation = "STRONG BUY - Scenario generates excellent ROI on additional investment";
  } else if (paybackRatio > 1.0) {
    recommendation = "MODERATE BUY - Scenario is profitable but marginal";
  } else if (paybackRatio > 0) {
    recommendation = "WEAK - Additional investment barely pays for itself";
  } else {
    recommendation = "PASS - Scenario reduces overall profitability";
  }

  return {
    scenario,
    baseProperty: {
      listPrice: baseProperty.listPrice,
      sqft: baseProperty.sqft,
      bedrooms: baseProperty.bedrooms,
      bathrooms: baseProperty.bathrooms,
      arv: baseArv,
      rehabBudget: baseRehab,
      holdingCosts: Math.round(baseHolding),
      closingCosts: baseClosing,
      mao25k: baseMao25k,
      mao50k: baseMao50k,
      projectedProfit: Math.round(baseProfit),
      roi: Math.round(baseRoi * 100) / 100,
      decision: "PASS",
    },
    projectedProperty: {
      listPrice: baseProperty.listPrice,
      sqft: baseProperty.sqft + (scenario.additions.sqft || 0),
      bedrooms: baseProperty.bedrooms + (scenario.additions.bedrooms || 0),
      bathrooms: baseProperty.bathrooms + (scenario.additions.bathrooms || 0),
      arv: projectedArv,
      rehabBudget: totalRehab,
      holdingCosts: Math.round(projectedHolding),
      closingCosts: projectedClosing,
      mao25k: projectedMao25k,
      mao50k: projectedMao50k,
      projectedProfit: Math.round(projectedProfit),
      roi: Math.round(projectedRoi * 100) / 100,
      decision,
    },
    comparison: {
      profitDifference: Math.round(profitDifference),
      roiDifference: Math.round(roiDifference * 100) / 100,
      additionalInvestment,
      paybackRatio: Math.round(paybackRatio * 100) / 100,
      recommendation,
    },
  };
}

/**
 * Run multiple scenarios and return the best one
 */
export function findBestScenario(
  baseProperty: {
    listPrice: number;
    sqft: number;
    bedrooms: number;
    bathrooms: number;
    zip: string;
    annualTaxes: number;
    annualInsurance: number;
  },
  scenarios: WhatIfScenario[]
): { bestScenario: ScenarioResult; allResults: ScenarioResult[] } {
  const results = scenarios.map((scenario) => runWhatIfAnalysis(baseProperty, scenario));
  
  // Sort by projected profit
  const sorted = results.sort((a, b) => 
    b.projectedProperty.projectedProfit - a.projectedProperty.projectedProfit
  );

  return {
    bestScenario: sorted[0],
    allResults: results,
  };
}

/**
 * Generate predefined common scenarios for a property
 */
export function generateCommonScenarios(): WhatIfScenario[] {
  return [
    {
      name: "Add 200 sqft + 1 Bedroom",
      additions: { sqft: 200, bedrooms: 1, bathrooms: 0 },
      improvements: { kitchen: "mid", bathrooms: "mid", flooring: "mid" },
    },
    {
      name: "Add 400 sqft + 1 Bed/1 Bath",
      additions: { sqft: 400, bedrooms: 1, bathrooms: 1 },
      improvements: { kitchen: "mid", bathrooms: "mid", flooring: "mid" },
    },
    {
      name: "Add Master Suite (300sqft + Bath)",
      additions: { sqft: 300, bedrooms: 1, bathrooms: 1 },
      improvements: { kitchen: "high", bathrooms: "high", flooring: "mid" },
    },
    {
      name: "Luxury Full Renovation (No Addition)",
      additions: { sqft: 0, bedrooms: 0, bathrooms: 0 },
      improvements: { kitchen: "high", bathrooms: "high", flooring: "high", hvac: true, windows: true },
    },
    {
      name: "Budget Refresh (No Addition)",
      additions: { sqft: 0, bedrooms: 0, bathrooms: 0 },
      improvements: { kitchen: "basic", bathrooms: "basic", flooring: "basic" },
    },
    {
      name: "Add 500 sqft + 2 Beds/1 Bath",
      additions: { sqft: 500, bedrooms: 2, bathrooms: 1 },
      improvements: { kitchen: "mid", bathrooms: "mid", flooring: "mid", hvac: true },
    },
  ];
}
