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
  rationale: string;
  type: string;
  realtor: string;
  url: string;
  details: string;
  images: string[];
  estimatedRent: number;
  annualTaxes: number;
  annualInsurance: number;
  renovationBudget: number;
  afterRepairValue: number;
  notes: string;
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
};

function parsePrice(priceStr: string): number {
  if (
    priceStr.toLowerCase().includes("auction") ||
    priceStr.toLowerCase().includes("undisclosed")
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
  const zipMatch = address.match(/\d{5}/);
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

function estimateRent(listPrice: number): number {
  return Math.round(listPrice * 0.008);
}

function estimateTaxes(listPrice: number): number {
  return Math.round(listPrice * 0.02);
}

function estimateInsurance(): number {
  return 1200;
}

function determineDecision(price: number, sqft: number): string {
  const pricePerSqft = sqft > 0 ? price / sqft : 0;
  if (pricePerSqft < 80 && price < 150000) return "Pass Platinum";
  if (pricePerSqft < 100 && price < 200000) return "Pass Gold";
  if (pricePerSqft < 120) return "Pass Silver";
  return "Caution";
}

function determineStrategy(type: string): string {
  const lower = type.toLowerCase();
  if (lower.includes("multi")) return "Section 8";
  if (lower.includes("auction") || lower.includes("foreclosure"))
    return "Wholesaling";
  return "Retail Flip";
}

function convertProperty(raw: RawProperty): Property {
  const { city, state, zip } = parseAddress(raw.address);
  const coords = getCoordinates(city);
  const listPrice = parsePrice(raw.price);
  const sqft = parseInt(raw.sqft.replace(/,/g, "")) || 0;
  const bedrooms = parseInt(raw.beds) || 0;
  const bathrooms = parseFloat(raw.baths) || 0;
  const estimatedRent = estimateRent(listPrice);
  const annualTaxes = estimateTaxes(listPrice);
  const annualInsurance = estimateInsurance();
  const arv = listPrice > 0 ? Math.round(listPrice * 1.15) : 0;

  return {
    id: generateId(raw.address),
    address: raw.address.split(",")[0].trim(),
    city,
    state,
    zip,
    lat: coords.lat + (Math.random() - 0.5) * 0.02,
    lng: coords.lng + (Math.random() - 0.5) * 0.02,
    listPrice,
    equityGap: Math.round(arv * 0.2),
    sqft,
    bedrooms,
    bathrooms,
    decision: determineDecision(listPrice, sqft),
    strategy: determineStrategy(raw.type),
    rationale: `${raw.type}${raw.note ? `. ${raw.note}` : ""}`,
    type: raw.type,
    realtor: raw.brokerage || "",
    url: raw.link,
    details: raw.note,
    images: [],
    estimatedRent,
    annualTaxes,
    annualInsurance,
    renovationBudget: Math.round(listPrice * 0.1),
    afterRepairValue: arv,
    notes: raw.brokerage ? `Listed by ${raw.brokerage}` : "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

const rawData = JSON.parse(
  fs.readFileSync(
    path.join(process.cwd(), "processed", "properties.json"),
    "utf-8",
  ),
) as RawProperty[];

const properties = rawData.map(convertProperty);

// Generate TypeScript file
const header = `// Auto-generated from processed/properties.json
// Run: npx tsx scripts/convert-properties.ts to regenerate

export type Decision =
  | "Pass Platinum"
  | "Pass Gold"
  | "Pass Silver"
  | "Hard Fail"
  | "Caution";
export type Strategy =
  | "Retail Flip"
  | "Section 8"
  | "BRRR"
  | "Owner Finance"
  | "Wholesaling";

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
  estimatedRent: number;
  annualTaxes: number;
  annualInsurance: number;
  renovationBudget: number;
  afterRepairValue: number;
  notes: string;
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

export const calculateCapRate = (property: Property): number => {
  if (property.listPrice <= 0) return 0;
  const annualRent = property.estimatedRent * 12;
  const noi = annualRent - property.annualTaxes - property.annualInsurance;
  return (noi / property.listPrice) * 100;
};

export const calculateCashOnCashReturn = (
  property: Property,
  downPaymentPercent: number = 25,
  interestRate: number = 7.5,
): number => {
  const downPayment = property.listPrice * (downPaymentPercent / 100);
  const loanAmount = property.listPrice - downPayment;
  const monthlyPayment =
    (loanAmount * (interestRate / 100 / 12)) /
    (1 - Math.pow(1 + interestRate / 100 / 12, -360));
  const annualMortgage = monthlyPayment * 12;
  const annualRent = property.estimatedRent * 12;
  const noi = annualRent - property.annualTaxes - property.annualInsurance;
  const annualCashFlow = noi - annualMortgage;
  const totalCashInvested =
    downPayment +
    property.renovationBudget +
    property.annualTaxes +
    property.annualInsurance;
  if (totalCashInvested <= 0) return 0;
  return (annualCashFlow / totalCashInvested) * 100;
};

export const calculateMAO = (
  property: Property,
  targetProfitPercent: number = 20,
): number => {
  if (property.afterRepairValue <= 0) return 0;
  const mao =
    property.afterRepairValue * (1 - targetProfitPercent / 100) -
    property.renovationBudget;
  return Math.max(0, mao);
};

export const calculateOnePercentRule = (property: Property): boolean => {
  if (property.listPrice <= 0) return false;
  const monthlyRent = property.estimatedRent;
  return monthlyRent >= property.listPrice * 0.01;
};

export const calculateGrossYield = (property: Property): number => {
  if (property.listPrice <= 0) return 0;
  const annualRent = property.estimatedRent * 12;
  return (annualRent / property.listPrice) * 100;
};

export const getDecisionColor = (decision: Decision): string => {
  switch (decision) {
    case "Pass Platinum":
      return "#10b981";
    case "Pass Gold":
      return "#f59e0b";
    case "Pass Silver":
      return "#f97316";
    case "Hard Fail":
      return "#ef4444";
    case "Caution":
      return "#8b5cf6";
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
  "properties",
);
