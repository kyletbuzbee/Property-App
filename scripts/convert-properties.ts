import fs from "fs";
import path from "path";

interface RawProperty {
  address: string;
  link: string;
  brokerage: string | null;
  price: string;
  beds: string;
  baths: string;
  sqft: string;
  type: string;
  note: string;
}

// Updated Property interface matching current schema
interface Property {
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
  status: string;
  yearBuilt: number | null;
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
  // Additional fields
  isOwned: boolean;
  purchasePrice: number;
  isFavorite: boolean;
  favoriteNotes: string;
  dealScore: number;
  riskLevel: string;
  createdAt: string;
  updatedAt: string;
}

const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  Marshall: { lat: 32.5449, lng: -94.3674 },
  Yantis: { lat: 32.9418, lng: -95.1693 },
  Troup: { lat: 32.1507, lng: -95.1227 },
  Rusk: { lat: 31.7957, lng: -95.1505 },
  Pittsburg: { lat: 32.9946, lng: -94.9733 },
  Gladewater: { lat: 32.5446, lng: -94.9483 },
  "Hughes Springs": { lat: 32.9968, lng: -94.6302 },
  Palestine: { lat: 31.7621, lng: -95.6327 },
  Overton: { lat: 32.2757, lng: -94.9427 },
  Kemp: { lat: 32.4268, lng: -96.0186 },
  Kilgore: { lat: 32.3863, lng: -94.8756 },
  Omaha: { lat: 33.1801, lng: -94.7888 },
  Athens: { lat: 32.2049, lng: -95.855 },
  Kerens: { lat: 32.1326, lng: -96.0694 },
  Hawkins: { lat: 32.5885, lng: -95.2044 },
  Daingerfield: { lat: 33.0293, lng: -94.7188 },
  Mineola: { lat: 32.6626, lng: -95.4891 },
  Alba: { lat: 32.7934, lng: -95.4702 },
  Tatum: { lat: 32.5868, lng: -94.5199 },
  Larue: { lat: 32.2135, lng: -95.6282 },
  Chandler: { lat: 32.3032, lng: -95.4794 },
  Jacksonville: { lat: 31.9635, lng: -95.2705 },
  "Big Sandy": { lat: 32.5818, lng: -95.0769 },
  Brownsboro: { lat: 32.3018, lng: -95.6133 },
  Longview: { lat: 32.5007, lng: -94.7405 },
  "Grand Saline": { lat: 32.6768, lng: -95.7413 },
  Winnsboro: { lat: 32.9404, lng: -95.1114 },
  Quitman: { lat: 32.8479, lng: -95.4458 },
  Alto: { lat: 31.6496, lng: -95.0783 },
  Scroggins: { lat: 33.0418, lng: -95.2107 },
  Tyler: { lat: 32.3513, lng: -95.3011 },
  Canton: { lat: 32.5565, lng: -95.3012 },
  "Holly Lake Ranch": { lat: 32.7473, lng: -95.214 },
  "Sulphur Springs": { lat: 33.3565, lng: -95.6013 },
  Trinidad: { lat: 32.1557, lng: -96.0969 },
  Bullard: { lat: 32.1388, lng: -95.3219 },
  Arp: { lat: 32.2274, lng: -95.0544 },
  Henderson: { lat: 32.1532, lng: -94.7997 },
  Gilmer: { lat: 32.7288, lng: -94.9424 },
  Emory: { lat: 32.8715, lng: -95.7617 },
  Whitehouse: { lat: 32.2207, lng: -95.2219 },
  Flint: { lat: 32.204, lng: -95.3491 },
  "Mount Pleasant": { lat: 33.2071, lng: -94.9687 },
  "Gun Barrel City": { lat: 32.3288, lng: -96.1047 },
  Scurry: { lat: 32.4682, lng: -96.4286 },
  Mabank: { lat: 32.3704, lng: -96.1039 },
  "Wills Point": { lat: 32.7087, lng: -96.0086 },
  "Mount Enterprise": { lat: 31.931, lng: -94.6841 },
  Lindale: { lat: 32.5157, lng: -95.4094 },
  Frankston: { lat: 31.8779, lng: -95.1654 },
  "Van Zandt": { lat: 32.6216, lng: -95.8675 },
  Eustace: { lat: 32.3065, lng: -96.0145 },
  Malakoff: { lat: 32.1696, lng: -96.0124 },
  "Ben Wheeler": { lat: 32.4416, lng: -95.7022 },
  "Cedar Creek": { lat: 32.3326, lng: -96.4508 },
  Murchison: { lat: 32.2788, lng: -95.7508 },
  "Prairie View": { lat: 30.0933, lng: -95.9919 },
  Reklaw: { lat: 31.8628, lng: -94.9858 },
  "New London": { lat: 32.2387, lng: -94.9372 },
  "Lake Cherokee": { lat: 32.2085, lng: -94.6545 },
};

function parsePrice(priceStr: string): number {
  if (
    priceStr.toLowerCase().includes("auction") ||
    priceStr.toLowerCase().includes("undisclosed") ||
    priceStr.toLowerCase().includes("est.")
  ) {
    return 0;
  }
  const cleaned = priceStr.replace(/[$,]/g, "").replace("Est. ", "");
  return parseInt(cleaned) || 0;
}

function parseAddress(address: string): {
  city: string;
  state: string;
  zip: string;
} {
  const parts = address.split(",").map((p) => p.trim());
  const cityPart = parts[1]?.replace(/ TX$/, "").trim() || "";
  const state = "TX";
  // Only look for zip in the last part (state/zip portion) to avoid matching street numbers
  const lastPart = parts[parts.length - 1] || "";
  const zipMatch = lastPart.match(/\d{5}/);
  const zip = zipMatch ? zipMatch[0] : "";
  return { city: cityPart, state, zip };
}

function getCoordinates(city: string): { lat: number; lng: number } {
  const coords = cityCoordinates[city];
  if (coords) return coords;
  return { lat: 32.3513, lng: -95.3011 };
}

function generateId(address: string): string {
  return address
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 50);
}

function estimateTaxes(listPrice: number): number {
  return Math.round(listPrice * 0.02);
}

function estimateInsurance(): number {
  return 1200;
}

function calculateMAO(arv: number, renovationBudget: number, profitTarget: number): number {
  // Maximum Allowable Offer = ARV - Renovation - Desired Profit
  return Math.round(arv - renovationBudget - profitTarget);
}

function determineRehabTier(price: number, sqft: number): string {
  const pricePerSqft = sqft > 0 ? price / sqft : 0;
  if (pricePerSqft < 60) return "Heavy";
  if (pricePerSqft < 85) return "Standard";
  if (pricePerSqft < 110) return "Light";
  return "Cosmetic";
}

function calculateRenovationBudget(listPrice: number, sqft: number, tier: string): number {
  // Per sqft renovation costs
  const costPerSqft: Record<string, number> = {
    "Cosmetic": 15,
    "Light": 25,
    "Standard": 40,
    "Heavy": 65,
  };
  const baseCost = Math.round(sqft * (costPerSqft[tier] || 35));
  // Minimum renovation budget
  return Math.max(baseCost, 15000);
}

function determineDecision(price: number, sqft: number, arv: number, mao25k: number): string {
  const pricePerSqft = sqft > 0 ? price / sqft : 0;
  const margin = arv - price;
  
  // Must have at least $25k potential profit
  if (price <= mao25k && margin > 40000) return "PASS";
  if (price <= mao25k + 10000 && margin > 30000) return "CAUTION";
  return "HARD_FAIL";
}

function determineStrategy(type: string): string {
  const lower = type.toLowerCase();
  if (lower.includes("auction")) return "Wholesaling";
  return "Retail Flip";
}

function calculateHoldingCosts(listPrice: number): number {
  // 6 months holding: taxes, insurance, utilities, financing
  const monthly = (listPrice * 0.07 / 12) + 150 + 200; // Financing + insurance + utilities
  return Math.round(monthly * 6);
}

function calculateClosingCosts(listPrice: number): number {
  // Buy and sell closing costs (~5% each side)
  return Math.round(listPrice * 0.1);
}

function generateRationale(property: Property): string {
  const ppsf = property.sqft > 0 ? (property.listPrice / property.sqft).toFixed(0) : "N/A";
  const margin = property.afterRepairValue - property.listPrice - property.renovationBudget;
  
  return `Retail Flip Analysis: ${property.bedrooms}bd/${property.bathrooms}ba, ${property.sqft.toLocaleString()} sqft at $${ppsf}/sqft. ` +
    `Estimated ARV: $${property.afterRepairValue.toLocaleString()}. ` +
    `Renovation Budget (${property.rehabTier}): $${property.renovationBudget.toLocaleString()}. ` +
    `Projected Gross Margin: $${margin.toLocaleString()}. ` +
    `MAO (25k profit): $${property.mao25k.toLocaleString()}. ` +
    `${property.details ? property.details + ". " : ""}` +
    `Listed by ${property.realtor || "Unknown Brokerage"}.`;
}

function convertProperty(raw: RawProperty): Property | null {
  const listPrice = parsePrice(raw.price);
  const sqft = parseInt(raw.sqft.replace(/,/g, "")) || 0;
  
  // FILTER: Only properties under $150,000 with valid sqft
  if (listPrice >= 150000 || listPrice === 0 || sqft === 0) {
    return null;
  }
  
  const { city, state, zip } = parseAddress(raw.address);
  const coords = getCoordinates(city);
  const bedrooms = parseInt(raw.beds) || 0;
  const bathrooms = parseFloat(raw.baths) || 0;
  const annualTaxes = estimateTaxes(listPrice);
  const annualInsurance = estimateInsurance();
  
  // Flipping calculations
  const rehabTier = determineRehabTier(listPrice, sqft);
  const renovationBudget = calculateRenovationBudget(listPrice, sqft, rehabTier);
  const afterRepairValue = listPrice > 0 ? Math.round(listPrice * 1.25) : 0; // 25% ARV markup
  const holdingCosts = calculateHoldingCosts(listPrice);
  const closingCosts = calculateClosingCosts(listPrice);
  
  // MAO calculations
  const mao25k = calculateMAO(afterRepairValue, renovationBudget, 25000);
  const mao50k = calculateMAO(afterRepairValue, renovationBudget, 50000);
  
  // Decision based on flip viability
  const decision = determineDecision(listPrice, sqft, afterRepairValue, mao25k);
  const strategy = determineStrategy(raw.type);
  
  // Calculate deal score (0-100) based on margin percentage
  const totalInvestment = listPrice + renovationBudget + holdingCosts + closingCosts;
  const potentialProfit = afterRepairValue - totalInvestment;
  const marginPercent = totalInvestment > 0 ? (potentialProfit / totalInvestment) * 100 : 0;
  const dealScore = Math.min(Math.max(Math.round(marginPercent * 2), 0), 100);
  
  const property: Property = {
    id: generateId(raw.address),
    address: raw.address.split(",")[0].trim(),
    city,
    state,
    zip,
    lat: coords.lat + (Math.random() - 0.5) * 0.02,
    lng: coords.lng + (Math.random() - 0.5) * 0.02,
    listPrice,
    equityGap: Math.round(afterRepairValue * 0.15),
    sqft,
    bedrooms,
    bathrooms,
    decision,
    strategy,
    status: "NEW_LEAD",
    yearBuilt: null,
    rationale: "", // Will be set after property object created
    type: raw.type,
    realtor: raw.brokerage,
    url: raw.link,
    details: raw.note,
    images: [],
    annualTaxes,
    annualInsurance,
    renovationBudget,
    afterRepairValue,
    notes: raw.brokerage ? `Listed by ${raw.brokerage}` : "",
    mao25k,
    mao50k,
    holdingCosts,
    closingCosts,
    rehabTier,
    arvSource: "AI_ANALYSIS",
    isOwned: false,
    purchasePrice: 0,
    isFavorite: false,
    favoriteNotes: "",
    dealScore,
    riskLevel: decision === "HARD_FAIL" ? "High" : decision === "CAUTION" ? "Medium" : "Low",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  // Generate rationale now that we have all fields
  property.rationale = generateRationale(property);
  
  return property;
}

const rawData = JSON.parse(
  fs.readFileSync(
    path.join(process.cwd(), "processed", "properties.json"),
    "utf-8",
  ),
) as RawProperty[];

const properties = rawData
  .map(convertProperty)
  .filter((p): p is Property => p !== null)
  // Sort by deal score (best deals first)
  .sort((a, b) => b.dealScore - a.dealScore);

// Generate TypeScript file
const header = `// Auto-generated from processed/properties.json
// Filter: Properties under $150,000
// Run: npx tsx scripts/convert-properties.ts to regenerate

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
  yearBuilt: number | null;
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
  isOwned: boolean;
  purchasePrice: number;
  isFavorite: boolean;
  favoriteNotes: string;
  dealScore: number;
  riskLevel: string;
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
  return status.replace(/_/g, " ").replace(/\\w\\S*/g, (txt) => {
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

export const properties: Property[] = `;

const content = header + JSON.stringify(properties, null, 2) + ";\n";

fs.writeFileSync(
  path.join(process.cwd(), "src", "data", "properties.ts"),
  content,
);

console.log(
  "Generated src/data/properties.ts with",
  properties.length,
  "properties (filtered under $150k)",
);
console.log(
  "Breakdown:",
  properties.filter((p) => p.decision === "PASS").length,
  "PASS,",
  properties.filter((p) => p.decision === "CAUTION").length,
  "CAUTION,",
  properties.filter((p) => p.decision === "HARD_FAIL").length,
  "HARD_FAIL",
);
