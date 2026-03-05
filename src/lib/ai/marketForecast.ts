/**
 * Market Forecast Module - Client-Safe Version
 * Provides exit value predictions and market phase analysis for fix-and-flip investments
 * 
 * This module does NOT import KnowledgeBundle directly - it receives data via props
 * to remain client-safe. Server components should use marketForecast.server.ts
 */

export interface ExitValuePrediction {
  current_arv: number;
  predicted_exit_arv: number;
  confidence_low: number;
  confidence_high: number;
  market_phase: "hot" | "warm" | "stable" | "cooling" | "declining";
  optimal_exit_month: number;
  days_on_market_estimate: number;
  months_ahead: number;
}

export interface MarketHealth {
  zip_code: string;
  phase: "hot" | "warm" | "stable" | "cooling" | "declining";
  zhvi_growth_12mo: number;
  forecast_6mo: number;
  inventory_trend: "rising" | "stable" | "falling";
  confidence: number;
  last_updated: string;
}

export interface ZHVIData {
  zip_code: string;
  current_value: number;
  yoy_growth: number;
  monthly_history: Record<string, number>;
}

export interface FHFA_HPI {
  county: string;
  year: number;
  annual_change: number;
  hpi: number;
}

/**
 * Predict exit value for a property after holding period
 * Client-safe version - requires ZHVI data to be passed in
 */
export function predictExitValue(
  zip: string,
  current_arv: number,
  hold_months: number = 4,
  zhviData?: ZHVIData | null
): ExitValuePrediction {
  if (!zhviData) {
    // No data - return conservative estimate
    return {
      current_arv,
      predicted_exit_arv: current_arv,
      confidence_low: current_arv * 0.95,
      confidence_high: current_arv * 1.05,
      market_phase: "stable",
      optimal_exit_month: hold_months,
      days_on_market_estimate: 60,
      months_ahead: hold_months,
    };
  }

  // Calculate monthly growth rate from YoY
  const monthly_growth = zhviData.yoy_growth / 12;

  // Project forward
  const projected_growth = monthly_growth * hold_months;
  const predicted_arv = current_arv * (1 + projected_growth);

  // Calculate confidence interval (wider for longer holds)
  const uncertainty = 0.02 * (hold_months / 12); // 2% per year uncertainty
  const confidence_low = predicted_arv * (1 - uncertainty);
  const confidence_high = predicted_arv * (1 + uncertainty);

  // Determine market phase
  const phase = getMarketPhaseFromGrowth(zhviData.yoy_growth);

  // Estimate days on market based on phase
  const dom_estimate =
    phase === "hot" ? 30 : phase === "warm" ? 45 : phase === "stable" ? 60 : phase === "cooling" ? 75 : 90;

  // Optimal exit month (considering seasonality)
  const currentMonth = new Date().getMonth(); // 0-11
  const optimalMonth = calculateOptimalExitMonth(currentMonth, phase);

  return {
    current_arv,
    predicted_exit_arv: Math.round(predicted_arv),
    confidence_low: Math.round(confidence_low),
    confidence_high: Math.round(confidence_high),
    market_phase: phase,
    optimal_exit_month: optimalMonth,
    days_on_market_estimate: dom_estimate,
    months_ahead: hold_months,
  };
}

/**
 * Get market health metrics for a zip code
 * Client-safe version - requires ZHVI/FHFA data to be passed in
 */
export function getMarketHealth(
  zip: string,
  zhviData?: ZHVIData | null,
  fhfaData?: FHFA_HPI | null
): MarketHealth {
  if (!zhviData) {
    return {
      zip_code: zip,
      phase: "stable",
      zhvi_growth_12mo: 0,
      forecast_6mo: 0,
      inventory_trend: "stable",
      confidence: 0.6,
      last_updated: new Date().toISOString(),
    };
  }

  const phase = getMarketPhaseFromGrowth(zhviData.yoy_growth);

  // Calculate 6-month forecast
  const monthly_growth = zhviData.yoy_growth / 12;
  const forecast_6mo = monthly_growth * 6;

  // Determine inventory trend (simplified - could use actual inventory data)
  const inventory_trend = phase === "hot" ? "falling" : phase === "declining" ? "rising" : "stable";

  // Confidence based on data availability
  let confidence = 0.75;
  if (fhfaData) confidence += 0.1;
  if (zhviData.monthly_history) confidence += 0.1;
  confidence = Math.min(0.98, confidence);

  return {
    zip_code: zip,
    phase,
    zhvi_growth_12mo: Math.round(zhviData.yoy_growth * 100) / 100,
    forecast_6mo: Math.round(forecast_6mo * 100) / 100,
    inventory_trend,
    confidence: Math.round(confidence * 100) / 100,
    last_updated: new Date().toISOString(),
  };
}

/**
 * Determine market phase from growth rate
 */
function getMarketPhaseFromGrowth(yoy_growth: number): "hot" | "warm" | "stable" | "cooling" | "declining" {
  if (yoy_growth > 0.08) return "hot";
  if (yoy_growth > 0.05) return "warm";
  if (yoy_growth > -0.02) return "stable";
  if (yoy_growth > -0.05) return "cooling";
  return "declining";
}

/**
 * Calculate optimal exit month considering seasonality
 * Spring (March-May) and Fall (Sept-Nov) are typically best
 */
function calculateOptimalExitMonth(currentMonth: number, phase: string): number {
  // Seasonal adjustment: Spring is best for sellers
  const seasonalPreference = [2, 3, 4, 8, 9, 10]; // Mar-May, Sep-Nov

  // Find next optimal month
  for (let i = 0; i < 12; i++) {
    const checkMonth = (currentMonth + i) % 12;
    if (seasonalPreference.includes(checkMonth)) {
      return i + 1; // Return months from now
    }
  }

  return 3; // Default to 3 months
}

/**
 * Batch analyze multiple zip codes for market comparison
 * Client-safe version - requires data lookup function to be passed in
 */
export function compareMarkets(
  zips: string[],
  getZHVI: (zip: string) => ZHVIData | null,
  getFHFA: (county: string) => FHFA_HPI | null,
  getCountyFromZip: (zip: string) => string
): MarketHealth[] {
  return zips.map((zip) => {
    const zhviData = getZHVI(zip);
    const fhfaData = getFHFA(getCountyFromZip(zip));
    return getMarketHealth(zip, zhviData, fhfaData);
  });
}

/**
 * Get investment recommendation based on market conditions
 */
export function getMarketRecommendation(health: MarketHealth): {
  action: "buy" | "hold" | "caution";
  reason: string;
} {
  switch (health.phase) {
    case "hot":
      return {
        action: "buy",
        reason: "Hot market - fast sales and rising prices",
      };
    case "warm":
      return {
        action: "buy",
        reason: "Warm market - good conditions for flips",
      };
    case "stable":
      return {
        action: "buy",
        reason: "Stable market - predictable conditions",
      };
    case "cooling":
      return {
        action: "caution",
        reason: "Cooling market - longer hold times expected",
      };
    case "declining":
      return {
        action: "hold",
        reason: "Declining market - high risk, wait for bottom",
      };
    default:
      return {
        action: "caution",
        reason: "Unknown market conditions",
      };
  }
}

/**
 * Helper to get county from zip (simplified - would use actual mapping)
 */
export function getCountyFromZip(zip: string): string {
  // East Texas zip to county mapping
  const zipToCounty: Record<string, string> = {
    "75701": "Smith",
    "75702": "Smith",
    "75703": "Smith",
    "75601": "Gregg",
    "75602": "Gregg",
    "75604": "Gregg",
    "75605": "Gregg",
    "75662": "Gregg",
    "75663": "Gregg",
    "75704": "Smith",
    "75705": "Smith",
    "75706": "Smith",
    "75707": "Smith",
    "75708": "Smith",
    "75709": "Smith",
    "75710": "Smith",
    "75711": "Smith",
    "75712": "Smith",
    "75713": "Smith",
    "75750": "Wood",
    "75751": "Wood",
    "75752": "Wood",
    "75754": "Smith",
    "75755": "Smith",
    "75756": "Smith",
    "75757": "Wood",
    "75758": "Wood",
    "75759": "Wood",
    "75760": "Henderson",
    "75761": "Henderson",
    "75762": "Henderson",
    "75763": "Henderson",
    "75764": "Henderson",
    "75765": "Henderson",
    "75766": "Henderson",
    "75770": "Henderson",
    "75771": "Henderson",
    "75772": "Henderson",
    "75773": "Henderson",
    "75778": "Henderson",
    "75779": "Henderson",
    "75780": "Henderson",
    "75781": "Henderson",
    "75782": "Henderson",
    "75783": "Henderson",
    "75784": "Henderson",
    "75785": "Henderson",
    "75786": "Henderson",
    "75787": "Henderson",
    "75788": "Henderson",
    "75789": "Henderson",
    "75790": "Henderson",
    "75791": "Henderson",
    "75792": "Henderson",
    "75793": "Henderson",
    "75794": "Henderson",
    "75795": "Henderson",
    "75796": "Henderson",
    "75797": "Henderson",
    "75798": "Henderson",
    "75799": "Henderson",
  };

  return zipToCounty[zip] || "";
}
