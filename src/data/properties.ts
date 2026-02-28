// Rule 1: Flipping Only - Purged all rental and buy-and-hold logic

export type Decision = "PASS" | "CAUTION" | "HARD_FAIL";

export type Strategy = "Retail Flip" | "Wholesaling";

export interface Property {
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
  rationale: string;
  type: string;
  realtor: string;
  url: string;
  details: string;
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
  createdAt: string | Date;
  updatedAt: string | Date;
}

// Helper functions for data analysis
export const getPricePerSqft = (property: Property): number => {
  if (property.sqft <= 0) return 0;
  return property.listPrice / property.sqft;
};

export const getPricePerDoor = (property: Property): number => {
  if (property.bedrooms <= 0) return 0;
  return property.listPrice / property.bedrooms;
};

export const getDecisionColor = (decision: Decision): string => {
  switch (decision) {
    case "PASS":
      return "#10b981";
    case "CAUTION":
      return "#f59e0b";
    case "HARD_FAIL":
      return "#ef4444";
    default:
      return "#64748b";
  }
};

export const properties: Property[] = [
  // Static data would need to be updated to match the new schema
];
