/**
 * Market Forecast Module - Server-Safe Version
 * Server components and API routes should import from here
 * This version can safely use KnowledgeBundle which requires fs
 */

import { KnowledgeBundle } from "../knowledgeBundle";
import {
  ExitValuePrediction,
  MarketHealth,
  ZHVIData,
  FHFA_HPI,
  getMarketHealth as getMarketHealthClient,
  predictExitValue as predictExitValueClient,
  getMarketRecommendation,
  getCountyFromZip,
  compareMarkets as compareMarketsClient,
} from "./marketForecast";

// Re-export types
export type { ExitValuePrediction, MarketHealth, ZHVIData, FHFA_HPI };
export { getMarketRecommendation, getCountyFromZip };

/**
 * Predict exit value for a property after holding period
 * Server version - uses KnowledgeBundle directly
 */
export function predictExitValue(
  zip: string,
  current_arv: number,
  hold_months: number = 4
): ExitValuePrediction {
  const zhviData = KnowledgeBundle.getZHVI(zip);
  return predictExitValueClient(zip, current_arv, hold_months, zhviData);
}

/**
 * Get market health metrics for a zip code
 * Server version - uses KnowledgeBundle directly
 */
export function getMarketHealth(zip: string): MarketHealth {
  const zhviData = KnowledgeBundle.getZHVI(zip);
  const fhfaData = KnowledgeBundle.getFHFA_HPI(getCountyFromZip(zip));
  return getMarketHealthClient(zip, zhviData, fhfaData);
}

/**
 * Batch analyze multiple zip codes for market comparison
 * Server version - uses KnowledgeBundle directly
 */
export function compareMarkets(zips: string[]): MarketHealth[] {
  return zips.map((zip) => getMarketHealth(zip));
}

/**
 * Get ZHVI data for a zip code
 * Server version - exposes raw data for client hydration
 */
export function getZHVI(zip: string): ZHVIData | null {
  const data = KnowledgeBundle.getZHVI(zip);
  if (!data) return null;
  return {
    zip_code: data.zip_code,
    current_value: data.current_value,
    yoy_growth: data.yoy_growth,
    monthly_history: data.monthly_history,
  };
}

/**
 * Get FHFA HPI data for a county
 * Server version - exposes raw data for client hydration
 */
export function getFHFA_HPI(county: string): FHFA_HPI | null {
  const data = KnowledgeBundle.getFHFA_HPI(county);
  if (!data) return null;
  return {
    county: data.county,
    year: data.year,
    annual_change: data.annual_change,
    hpi: data.hpi,
  };
}
