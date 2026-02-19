/**
 * Shared Calculation Utilities
 * Single source of truth for property calculations used by both server and client.
 */

import {
  calculateCapRate,
  calculateCashOnCashReturn,
  calculateMAO,
  calculateOnePercentRule,
  calculateGrossYield,
  Decision,
  Strategy,
} from '@/data/properties';

// Re-export Decision and Strategy for convenience
export type { Decision, Strategy } from '@/data/properties';

/**
 * Base property interface that matches Prisma schema (with Date objects)
 * Uses string types for decision and strategy since Prisma stores them as strings.
 * The frontend should validate/cast these to the proper union types when needed.
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
  decision: string;  // Stored as string in DB, cast to Decision type when needed
  strategy: string;  // Stored as string in DB, cast to Strategy type when needed
  rationale: string;
  type: string;
  realtor: string | null;
  url: string | null;
  details: string | null;
  images: string[];
  estimatedRent: number;
  annualTaxes: number;
  annualInsurance: number;
  renovationBudget: number;
  afterRepairValue: number;
  notes: string;
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
 * Uses string types for decision/strategy to match Prisma storage.
 */
export interface PropertyWithCalculations extends PropertyBase {
  pricePerSqft: number;
  pricePerDoor: number;
  capRate: number;
  cashOnCashReturn: number;
  mao: number;
  onePercentRule: boolean;
  grossYield: number;
  // Type-safe accessors - cast to proper types when needed
  decision: string;
  strategy: string;
}

/**
 * Add calculated fields to a property object.
 * This is the SINGLE source of truth for all property calculations.
 * Used by both the API route and the client-side context.
 * 
 * @param property - The base property object (can be from Prisma or client)
 * @returns Property with all calculated fields added
 */
export function addCalculations<T extends PropertyBase>(property: T): PropertyWithCalculations {
  // Ensure numeric values are valid (defensive coding)
  const listPrice = property.listPrice ?? 0;
  const sqft = property.sqft ?? 0;
  const bedrooms = property.bedrooms ?? 0;

  return {
    ...property,
    // Price per square foot (0 if sqft is 0 or negative)
    pricePerSqft: sqft > 0 ? Number((listPrice / sqft).toFixed(2)) : 0,
    // Price per bedroom/door (0 if bedrooms is 0 or negative)
    pricePerDoor: bedrooms > 0 ? Number((listPrice / bedrooms).toFixed(2)) : 0,
    // Cap rate calculation
    capRate: Number(calculateCapRate(property as any).toFixed(2)),
    // Cash on cash return calculation
    cashOnCashReturn: Number(calculateCashOnCashReturn(property as any).toFixed(2)),
    // Maximum Allowable Offer
    mao: Number(calculateMAO(property as any).toFixed(2)),
    // 1% rule check (rent >= 1% of purchase price)
    onePercentRule: calculateOnePercentRule(property as any),
    // Gross yield calculation
    grossYield: Number(calculateGrossYield(property as any).toFixed(2)),
  };
}

/**
 * Add calculations to an array of properties.
 * Convenience function for batch processing.
 * 
 * @param properties - Array of base property objects
 * @returns Array of properties with calculated fields
 */
export function addCalculationsToAll<T extends PropertyBase>(
  properties: T[]
): PropertyWithCalculations[] {
  if (!properties || !Array.isArray(properties)) {
    return [];
  }
  return properties.map(addCalculations);
}

/**
 * Serialize a property for client-side usage.
 * Converts Date objects to ISO strings for JSON serialization.
 * 
 * @param property - Property from Prisma (with Date objects)
 * @returns Property with dates as ISO strings
 */
export function serializeProperty<T extends { createdAt: Date; updatedAt: Date }>(
  property: T
): Omit<T, 'createdAt' | 'updatedAt'> & { createdAt: string; updatedAt: string } {
  return {
    ...property,
    createdAt: property.createdAt instanceof Date 
      ? property.createdAt.toISOString() 
      : String(property.createdAt),
    updatedAt: property.updatedAt instanceof Date 
      ? property.updatedAt.toISOString() 
      : String(property.updatedAt),
  };
}

/**
 * Serialize an array of properties for client-side usage.
 * 
 * @param properties - Array of properties from Prisma
 * @returns Array of properties with dates as ISO strings
 */
export function serializeProperties<T extends { createdAt: Date; updatedAt: Date }>(
  properties: T[]
): Array<Omit<T, 'createdAt' | 'updatedAt'> & { createdAt: string; updatedAt: string }> {
  if (!properties || !Array.isArray(properties)) {
    return [];
  }
  return properties.map(serializeProperty);
}
