/**
 * Shared Calculation Utilities - Rule 1: Flipping Only
 * Rule 3: Mandatory Knowledge Base Logic
 * Rule 5: Missing Data Fallback
 */

import { Decision, Strategy, PropertyStatus } from "@/data/properties";
import { MarketVelocity, SoldComp, AttomAvm } from "./knowledgeBundle";

// Re-export Decision, Strategy and PropertyStatus for convenience
export type { Decision, Strategy, PropertyStatus } from "@/data/properties";

export class IncompleteDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "IncompleteDataError";
  }
}

/**
 * Preflight Gates: Returns decision signal based on basic property/market data.
 * - HARD_FAIL if List Price > 75% ARV
 * - CAUTION if p75_dom > 90
 */
export function runPreflightGate(
  property: { listPrice: number; afterRepairValue: number },
  velocityData?: MarketVelocity | null,
): { decision: Decision; rationale: string } | null {
  // Gate 1: Price vs ARV
  if (
    property.afterRepairValue > 0 &&
    property.listPrice > property.afterRepairValue * 0.75
  ) {
    return {
      decision: "HARD_FAIL",
      rationale: "List Price exceeds 75% of ARV threshold.",
    };
  }

  // Gate 2: Market Velocity (P75 DOM warning only)
  if (velocityData) {
    if (velocityData.p75_dom > 90) {
      return {
        decision: "CAUTION",
        rationale: `Slow market warning: P75 DOM (${velocityData.p75_dom}) > 90 days.`,
      };
    }
  }

  return null;
}

export interface DOMOpportunity {
  scoreAdjustment: number; // -5 to +15 points
  badge: string; // "Fresh Listing" | "Normal Listing" | "Stale Listing" | "Motivated Seller"
  opportunityDiscount: number; // 0 to 0.15 (percentage below list)
  recommendation: string;
  daysOnMarket: number;
}

export function analyzeDOMOpportunity(
  daysOnMarket: number,
  medianDomMarket?: number,
): DOMOpportunity {
  // Use median market DOM if available, otherwise use property DOM
  const dom = medianDomMarket ?? daysOnMarket;

  if (dom < 30) {
    return {
      scoreAdjustment: -5,
      badge: "Fresh Listing",
      opportunityDiscount: 0,
      recommendation: "Sellers have high expectations, difficult to negotiate",
      daysOnMarket: dom,
    };
  } else if (dom >= 30 && dom <= 90) {
    return {
      scoreAdjustment: 0,
      badge: "Normal Listing",
      opportunityDiscount: 0,
      recommendation: "Standard market conditions",
      daysOnMarket: dom,
    };
  } else if (dom > 90 && dom <= 180) {
    return {
      scoreAdjustment: 10,
      badge: "Stale Listing",
      opportunityDiscount: 0.1,
      recommendation:
        "Motivated seller - carrying costs stinging, target 10% below list",
      daysOnMarket: dom,
    };
  } else {
    return {
      scoreAdjustment: 15,
      badge: "Motivated Seller",
      opportunityDiscount: 0.15,
      recommendation:
        "Prime target - overpriced or needs rehab, target 15% below list",
      daysOnMarket: dom,
    };
  }
}

/**
 * Holding Costs: Implement institutional formulas.
 * Months: Market-aware calculation based on median DOM
 * Formula: ($350 * months) + ((ARV * 0.0235) / 12 * months)
 */
export function calculateHoldingCosts(
  arv: number,
  medianDom: number = 0,
): { cost: number; months: number } {
  // Market-aware months calculation
  let months: number;
  if (medianDom < 30) {
    months = 3; // Hot market - fast sales
  } else if (medianDom >= 30 && medianDom <= 90) {
    months = 4; // Normal market
  } else {
    months = 5; // Slower market
  }

  const fixedMonthly = 350 * months;
  const capitalMonthly = ((arv * 0.0235) / 12) * months;

  return {
    cost: Math.round(fixedMonthly + capitalMonthly),
    months,
  };
}

/**
 * MAO Calculation: Institutional Buy Formula
 * Accounts for 8% closing cost and 20% rehab contingency.
 */
export function calculateMAO(
  arv: number,
  rehabBudget: number,
  holdingCosts: number,
  profitTarget: number,
): number {
  if (arv <= 0) return 0;

  // Closing Costs: Mandatory 8%
  const closingCosts = arv * 0.08;

  // Rehab Contingency: Mandatory 20%
  const totalRehab = rehabBudget * 1.2;

  const mao = arv - totalRehab - holdingCosts - closingCosts - profitTarget;
  return Math.max(0, Math.round(mao));
}

/**
 * Base property interface that matches Prisma schema
 */
export interface PropertyBase {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  lat: number;
  lng: number;
  listPrice: number;
  equityGap: number;
  sqft: number;
  bedrooms: number;
  bathrooms: number;
  decision: Decision;
  strategy: Strategy;
  status: PropertyStatus;
  yearBuilt?: number | null;
  rationale: string;
  type: string;
  realtor: string | null;
  url: string | null;
  details: string | null;
  images: string[];
  annualTaxes: number;
  annualInsurance: number;
  renovationBudget: number;
  afterRepairValue: number;
  notes: string;
  // Flipping specific fields
  mao25k: number;
  mao50k: number;
  holdingCosts: number;
  closingCosts: number;
  rehabTier: string;
  arvSource: string;
  // Extended fields from database schema
  isOwned: boolean;
  purchasePrice: number;
  purchaseDate: Date | string | null;
  rehabCompleted: Date | string | null;
  isFavorite: boolean;
  favoriteNotes: string;
  dealScore: number;
  riskLevel: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  // TODO: Add to database schema - needs listDate or daysOnMarket field in Prisma
  daysOnMarket?: number;
}

/**
 * Interface for properties with calculated fields
 */
export interface PropertyWithCalculations extends PropertyBase {
  pricePerSqft: number;
  pricePerDoor: number;
  // Comps for visualization
  comps?: SoldComp[];
  // Market & AVM details for Preflight Gate
  velocity?: MarketVelocity | null;
  avm?: AttomAvm | null;
}

/**
 * Add calculated fields to a property object.
 * Enforces Rule 5 (Missing Data Fallback).
 */
export function addCalculations<T extends PropertyBase>(
  property: T,
): PropertyWithCalculations {
  // Rule 5: Missing Data Fallback
  if (!property.listPrice || !property.sqft || !property.zip) {
    throw new IncompleteDataError(
      `Missing required data for analysis: ${!property.listPrice ? "listPrice " : ""}${!property.sqft ? "sqft " : ""}${!property.zip ? "zip" : ""}`,
    );
  }

  const listPrice = property.listPrice;
  const sqft = property.sqft;
  const bedrooms = property.bedrooms ?? 0;

  return {
    ...property,
    pricePerSqft: sqft > 0 ? Number((listPrice / sqft).toFixed(2)) : 0,
    pricePerDoor: bedrooms > 0 ? Number((listPrice / bedrooms).toFixed(2)) : 0,
  };
}

/**
 * Batch processing
 */
export function addCalculationsToAll<T extends PropertyBase>(
  properties: T[],
): PropertyWithCalculations[] {
  if (!properties || !Array.isArray(properties)) {
    return [];
  }

  const results: PropertyWithCalculations[] = [];
  for (const p of properties) {
    try {
      results.push(addCalculations(p));
    } catch (e) {
      if (e instanceof IncompleteDataError) {
        console.warn(`Skipping property ${p.address}: ${e.message}`);
        continue;
      }
      throw e;
    }
  }
  return results;
}

/**
 * Serialize a property for client-side usage.
 */
export function serializeProperty<
  T extends { createdAt: Date | string; updatedAt: Date | string },
>(
  property: T,
): Omit<T, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
} {
  return {
    ...property,
    createdAt:
      property.createdAt instanceof Date
        ? property.createdAt.toISOString()
        : String(property.createdAt),
    updatedAt:
      property.updatedAt instanceof Date
        ? property.updatedAt.toISOString()
        : String(property.updatedAt),
  };
}

export function serializeProperties<
  T extends { createdAt: Date | string; updatedAt: Date | string },
>(
  properties: T[],
): Array<
  Omit<T, "createdAt" | "updatedAt"> & { createdAt: string; updatedAt: string }
> {
  if (!properties || !Array.isArray(properties)) {
    return [];
  }
  return properties.map(serializeProperty);
}
