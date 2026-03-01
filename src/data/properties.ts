// Rule 1: Flipping Only - Purged all rental and buy-and-hold logic

export type Decision = "PASS" | "CAUTION" | "HARD_FAIL";

export type Strategy = "Retail Flip" | "Wholesaling";

export type PropertyStatus =
  | "NEW_LEAD"
  | "UNDERWRITING"
  | "OFFER_PENDING"
  | "UNDER_CONTRACT"
  | "ACTIVE_REHAB"
  | "LISTED"
  | "CLOSED"
  | "ARCHIVED";

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
  status: PropertyStatus;
  yearBuilt?: number | null;
  rationale: string;
  type: string;
  realtor?: string | null;
  url?: string | null;
  details?: string | null;
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

export const getStatusLabel = (status: PropertyStatus): string => {
  return status.replace(/_/g, " ").replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

export const getStatusColor = (status: PropertyStatus): string => {
  switch (status) {
    case "NEW_LEAD":
      return "#64748b";
    case "UNDERWRITING":
      return "#3b82f6";
    case "OFFER_PENDING":
      return "#f59e0b";
    case "UNDER_CONTRACT":
      return "#8b5cf6";
    case "ACTIVE_REHAB":
      return "#10b981";
    case "LISTED":
      return "#ec4899";
    case "CLOSED":
      return "#0f172a";
    case "ARCHIVED":
      return "#94a3b8";
    default:
      return "#64748b";
  }
};

export const properties: Property[] = [
  {
    id: "p1",
    address: "309 E Brandon St",
    city: "Overton",
    state: "TX",
    zip: "75684",
    lat: 32.2757,
    lng: -94.9427,
    listPrice: 149900,
    equityGap: 25000,
    sqft: 1700,
    bedrooms: 3,
    bathrooms: 3,
    decision: "PASS",
    strategy: "Retail Flip",
    status: "UNDERWRITING",
    yearBuilt: 1985,
    rationale: "Multi-family potential in rental desert; high yield potential for retail exit.",
    type: "Single Family",
    images: ["https://images.unsplash.com/photo-1568605114967-8130f3a36994"],
    annualTaxes: 2400,
    annualInsurance: 1200,
    renovationBudget: 35000,
    afterRepairValue: 245000,
    notes: "High priority target for East Texas portfolio.",
    mao25k: 165000,
    mao50k: 140000,
    holdingCosts: 5000,
    closingCosts: 15000,
    rehabTier: "Standard",
    arvSource: "Local Knowledge Bundle",
    createdAt: "2026-02-15T10:00:00Z",
    updatedAt: "2026-02-28T14:00:00Z",
  },
  {
    id: "p2",
    address: "2319 Luther St",
    city: "Tyler",
    state: "TX",
    zip: "75702",
    lat: 32.3513,
    lng: -95.3011,
    listPrice: 99999,
    equityGap: 125000,
    sqft: 1909,
    bedrooms: 4,
    bathrooms: 2,
    decision: "PASS",
    strategy: "Retail Flip",
    status: "ACTIVE_REHAB",
    yearBuilt: 1972,
    rationale: "Massive equity gap; tax value $225k vs $100k list. Prime for quick turnaround.",
    type: "Single Family",
    images: ["https://images.unsplash.com/photo-1570129477492-45c003edd2be"],
    annualTaxes: 3100,
    annualInsurance: 1500,
    renovationBudget: 45000,
    afterRepairValue: 235000,
    notes: "Rehab 40% complete. Foundation stabilized.",
    mao25k: 145000,
    mao50k: 120000,
    holdingCosts: 6000,
    closingCosts: 18000,
    rehabTier: "Standard",
    arvSource: "Local Knowledge Bundle",
    createdAt: "2026-02-10T09:00:00Z",
    updatedAt: "2026-02-28T11:00:00Z",
  },
  {
    id: "p3",
    address: "18737 Saddleback Ln",
    city: "Flint",
    state: "TX",
    zip: "75762",
    lat: 32.2015,
    lng: -95.3524,
    listPrice: 150000,
    equityGap: 85000,
    sqft: 2200,
    bedrooms: 4,
    bathrooms: 3,
    decision: "PASS",
    strategy: "Wholesaling",
    status: "NEW_LEAD",
    yearBuilt: 1998,
    rationale: "Mispriced at $68/sqft in high-growth Flint market. Strong wholesaling potential.",
    type: "Single Family",
    images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750"],
    annualTaxes: 3800,
    annualInsurance: 1800,
    renovationBudget: 25000,
    afterRepairValue: 285000,
    notes: "Lead from direct mail campaign. Seller motivated.",
    mao25k: 195000,
    mao50k: 170000,
    holdingCosts: 4500,
    closingCosts: 22000,
    rehabTier: "Light",
    arvSource: "Local Knowledge Bundle",
    createdAt: "2026-02-27T15:00:00Z",
    updatedAt: "2026-02-28T08:00:00Z",
  },
  {
    id: "p4",
    address: "1205 Booker St",
    city: "Longview",
    state: "TX",
    zip: "75601",
    lat: 32.5023,
    lng: -94.7408,
    listPrice: 146000,
    equityGap: 15000,
    sqft: 1090,
    bedrooms: 2,
    bathrooms: 2,
    decision: "CAUTION",
    strategy: "Retail Flip",
    status: "OFFER_PENDING",
    yearBuilt: 1965,
    rationale: "High price per sqft for Longview. Marginal spread after rehab costs.",
    type: "Single Family",
    images: ["https://images.unsplash.com/photo-1480074568708-e7b720bb3f09"],
    annualTaxes: 1800,
    annualInsurance: 900,
    renovationBudget: 28000,
    afterRepairValue: 195000,
    notes: "Pending counter-offer at $132k.",
    mao25k: 125000,
    mao50k: 100000,
    holdingCosts: 4000,
    closingCosts: 15000,
    rehabTier: "Standard",
    arvSource: "Local Knowledge Bundle",
    createdAt: "2026-02-20T11:00:00Z",
    updatedAt: "2026-02-28T09:30:00Z",
  },
  {
    id: "p5",
    address: "10490 Browning St",
    city: "Brownsboro",
    state: "TX",
    zip: "75756",
    lat: 32.3012,
    lng: -95.6123,
    listPrice: 112500,
    equityGap: -10000,
    sqft: 540,
    bedrooms: 2,
    bathrooms: 2,
    decision: "HARD_FAIL",
    strategy: "Retail Flip",
    status: "ARCHIVED",
    yearBuilt: 1950,
    rationale: "Tiny square footage limits exit options. Overpriced for the footprint.",
    type: "Cottage",
    images: ["https://images.unsplash.com/photo-1449156001935-d2863fb72690"],
    annualTaxes: 1200,
    annualInsurance: 800,
    renovationBudget: 20000,
    afterRepairValue: 120000,
    notes: "ARCHIVED: Unsuitable for institutional portfolio.",
    mao25k: 65000,
    mao50k: 40000,
    holdingCosts: 3000,
    closingCosts: 9000,
    rehabTier: "Light",
    arvSource: "Local Knowledge Bundle",
    createdAt: "2026-02-18T14:00:00Z",
    updatedAt: "2026-02-25T16:00:00Z",
  }
];
