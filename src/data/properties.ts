export type Decision = 'Pass Platinum' | 'Pass Gold' | 'Pass Silver' | 'Hard Fail' | 'Caution';
export type Strategy = 'Retail Flip' | 'Section 8' | 'BRRR' | 'Owner Finance' | 'Wholesaling';

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
  // New fields for enhanced functionality
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

// Approximate lat/lng coordinates for East Texas cities
const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  'Longview': { lat: 32.5007, lng: -94.7405 },
  'Marshall': { lat: 32.5449, lng: -94.3674 },
  'Kilgore': { lat: 32.3863, lng: -94.8756 },
  'Tyler': { lat: 32.3513, lng: -95.3011 },
  'Gilmer': { lat: 32.7288, lng: -94.9424 },
  'Athens': { lat: 32.2049, lng: -95.8550 },
  'Quitman': { lat: 32.8479, lng: -95.4458 },
  'Henderson': { lat: 32.1532, lng: -94.7997 },
  'Jacksonville': { lat: 31.9635, lng: -95.2705 },
  'Mineola': { lat: 32.6626, lng: -95.4891 },
  'Tatum': { lat: 32.5868, lng: -94.5199 },
  'Hawkins': { lat: 32.5885, lng: -95.2044 },
  'Bullard': { lat: 32.1388, lng: -95.3219 },
  'Whitehouse': { lat: 32.2207, lng: -95.2219 },
  'Flint': { lat: 32.2040, lng: -95.3491 },
  'Lindale': { lat: 32.5157, lng: -95.4094 },
  'Rusk': { lat: 31.7957, lng: -95.1505 },
  'Overton': { lat: 32.2757, lng: -94.9427 },
  'Arp': { lat: 32.2274, lng: -95.0544 },
  'Chandler': { lat: 32.3032, lng: -95.4794 },
  'Frankston': { lat: 32.0524, lng: -95.5058 },
  'Avinger': { lat: 32.5457, lng: -94.5488 },
  'Laneville': { lat: 32.2346, lng: -94.8852 },
  'Ore City': { lat: 32.7999, lng: -94.7216 },
  'Big Sandy': { lat: 32.5818, lng: -95.0769 },
  'Winona': { lat: 32.3299, lng: -95.1172 },
  'Diana': { lat: 32.7010, lng: -94.7155 },
  'Brownsboro': { lat: 32.3018, lng: -95.6133 },
  'Mount Enterprise': { lat: 31.9310, lng: -94.6841 },
  'Troup': { lat: 32.1507, lng: -95.1227 },
  'Mt Enterprise': { lat: 31.9310, lng: -94.6841 },
};

// Helper to add small random offset for map visibility
const addOffset = (coord: number, offset: number = 0.01): number => {
  return coord + (Math.random() - 0.5) * offset;
};

// Parse specs string like "3bd/3ba/1700sqft"
const parseSpecs = (specs: string): { bedrooms: number; bathrooms: number; sqft: number } => {
  const bedroomMatch = specs.match(/(\d+)bd/);
  const bathroomMatch = specs.match(/(\d+\.?\d*)ba/);
  const sqftMatch = specs.match(/(\d+)sqft/);

  return {
    bedrooms: bedroomMatch ? parseInt(bedroomMatch[1]) : 0,
    bathrooms: bathroomMatch ? parseFloat(bathroomMatch[1]) : 0,
    sqft: sqftMatch ? parseInt(sqftMatch[1]) : 0,
  };
};

// Parse price string like "$149,900" or "Auction"
const parsePrice = (priceStr: string): number => {
  if (priceStr.toLowerCase() === 'auction') return 0;
  const cleaned = priceStr.replace(/[$,]/g, '');
  return parseInt(cleaned) || 0;
};

// Map CSV decision to our Decision type
const mapDecision = (decision: string): Decision => {
  const upper = decision.toUpperCase();
  if (upper.includes('PLATINUM')) return 'Pass Platinum';
  if (upper.includes('GOLD')) return 'Pass Gold';
  if (upper.includes('SILVER')) return 'Pass Silver';
  if (upper.includes('HARD_FAIL') || upper.includes('HARD FAIL')) return 'Hard Fail';
  if (upper === 'CAUTION') return 'Caution';
  return 'Pass Gold'; // Default for "PASS" without level
};

// Map CSV strategy to our Strategy type (choose primary)
const mapStrategy = (strategy: string): Strategy => {
  const upper = strategy.toUpperCase();
  if (upper.includes('RETAIL FLIP')) return 'Retail Flip';
  if (upper.includes('SECTION 8')) return 'Section 8';
  if (upper.includes('BRRR')) return 'BRRR';
  if (upper.includes('OWNER FINANCE')) return 'Owner Finance';
  if (upper.includes('WHOLESALING') || upper.includes('WHOLETAIL')) return 'Wholesaling';
  return 'Retail Flip'; // Default
};

// Default values for new Property fields
const defaultProps = {
  images: [] as string[],
  estimatedRent: 0,
  annualTaxes: 0,
  annualInsurance: 0,
  renovationBudget: 0,
  afterRepairValue: 0,
  notes: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// CSV data parsed and converted to Property objects
export const properties: Property[] = [];

// Helper functions for data analysis
export const getPricePerSqft = (property: Property): number => {
  if (property.sqft <= 0) return 0;
  return property.listPrice / property.sqft;
};

export const getPricePerDoor = (property: Property): number => {
  if (property.bedrooms <= 0) return 0;
  return property.listPrice / property.bedrooms;
};

// Financial calculation functions
export const calculateCapRate = (property: Property): number => {
  if (property.listPrice <= 0) return 0;
  const annualRent = property.estimatedRent * 12;
  const noi = annualRent - property.annualTaxes - property.annualInsurance;
  return (noi / property.listPrice) * 100;
};

export const calculateCashOnCashReturn = (
  property: Property, 
  downPaymentPercent: number = 25,
  interestRate: number = 7.5
): number => {
  const downPayment = property.listPrice * (downPaymentPercent / 100);
  const loanAmount = property.listPrice - downPayment;
  const monthlyPayment = (loanAmount * (interestRate / 100 / 12)) / (1 - Math.pow(1 + interestRate / 100 / 12, -360));
  const annualMortgage = monthlyPayment * 12;
  const annualRent = property.estimatedRent * 12;
  const noi = annualRent - property.annualTaxes - property.annualInsurance;
  const annualCashFlow = noi - annualMortgage;
  const totalCashInvested = downPayment + property.renovationBudget + property.annualTaxes + property.annualInsurance;
  if (totalCashInvested <= 0) return 0;
  return (annualCashFlow / totalCashInvested) * 100;
};

export const calculateMAO = (
  property: Property,
  targetProfitPercent: number = 20
): number => {
  if (property.afterRepairValue <= 0) return 0;
  const mao = property.afterRepairValue * (1 - targetProfitPercent / 100) - property.renovationBudget;
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
    case 'Pass Platinum':
      return '#10b981'; // green
    case 'Pass Gold':
      return '#f59e0b'; // yellow/gold
    case 'Pass Silver':
      return '#f97316'; // orange
    case 'Hard Fail':
      return '#ef4444'; // red
    case 'Caution':
      return '#8b5cf6'; // purple
    default:
      return '#64748b'; // gray
  }
};
