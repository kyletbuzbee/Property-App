/**
 * Shared Calculation Utilities - Rule 1: Flipping Only
 * Rule 3: Mandatory Knowledge Base Logic
 * Rule 5: Missing Data Fallback
 */

import { Decision, Strategy } from "@/data/properties";
import { MarketVelocity } from "./knowledgeBundle";

// Re-export Decision and Strategy for convenience
export type { Decision, Strategy } from "@/data/properties";

export class IncompleteDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "IncompleteDataError";
  }
}

/**
 * Preflight Gates: Returns decision signal based on basic property/market data.
 * - HARD_FAIL if List Price > 75% ARV
 * - HARD_FAIL if median_dom > 90
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

  // Gate 2: Market Velocity
  if (velocityData) {
    if (velocityData.median_dom > 90) {
      return {
        decision: "HARD_FAIL",
        rationale: `Market too slow: Median DOM (${velocityData.median_dom}) > 90 days.`,
      };
    }
    if (velocityData.p75_dom > 90) {
      return {
        decision: "CAUTION",
        rationale: `Slow market warning: P75 DOM (${velocityData.p75_dom}) > 90 days.`,
      };
    }
  }

  return null;
}

/**
 * Holding Costs: Implement institutional formulas.
 * Months: Default 4. If median_dom > 60, change to 5.
 * Formula: ($350 * months) + ((ARV * 0.0235) / 12 * months)
 */
export function calculateHoldingCosts(
  arv: number,
  medianDom: number = 0,
): { cost: number; months: number } {
  const months = medianDom > 60 ? 5 : 4;
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
  decision: string;
  strategy: string;
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
}

/**
 * Interface for properties with calculated fields
 */
export interface PropertyWithCalculations extends PropertyBase {
  pricePerSqft: number;
  pricePerDoor: number;
  // Type-safe accessors
  decision: string;
  strategy: string;
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
