import fs from "fs";
import path from "path";
import {
  MarketIntelligence,
  RegionalBenchmarks,
} from "@/types/marketIntelligence";

// In-memory cache
let marketDataCache: Map<string, MarketIntelligence> | null = null;
let benchmarkCache: Map<string, RegionalBenchmarks> | null = null;

// Default benchmarks for fallback
const DEFAULT_BENCHMARKS: RegionalBenchmarks = {
  city: "Default",
  state: "TX",
  capRate: { min: 5, good: 7, excellent: 10 },
  cashOnCash: { min: 5, good: 10, excellent: 15 },
  grossYield: { min: 5, good: 8, excellent: 12 },
  pricePerSqft: { min: 100, good: 150, excellent: 200 },
  pricePerDoor: { min: 50000, good: 80000, excellent: 120000 },
  onePercentRule: true,
  daysOnMarketAvg: 45,
  vacancyRateAvg: 0.08,
  appreciationRate: 0.035,
};

/**
 * Loads and processes market data from CSVs into memory
 */
export function loadMarketData(): Map<string, MarketIntelligence> {
  if (marketDataCache) return marketDataCache;

  const dataMap = new Map<string, MarketIntelligence>();
  const processedDir = path.join(process.cwd(), "processed");

  try {
    const enrichedPath = path.join(
      processedDir,
      "brrr_training_enriched_cleaned.csv",
    );
    if (fs.existsSync(enrichedPath)) {
      const content = fs.readFileSync(enrichedPath, "utf-8");
      const lines = content.split("\n").slice(1);

      for (const line of lines) {
        if (!line.trim()) continue;
        const cols = line.split(",");
        const city = cols[1]?.trim();
        if (!city) continue;

        const zhviCurrent = parseFloat(cols[11]) || 0;
        const zhvi1YrGrowth = parseFloat(cols[14]) || 0;
        const zoriCurrent = parseFloat(cols[17]) || zhviCurrent * 0.008;

        if (zhviCurrent > 0) {
          dataMap.set(city.toLowerCase(), {
            city,
            zhviCurrent,
            zhvi1YrGrowth,
            zoriCurrent,
            censusMedianHomeValue: parseFloat(cols[23]) || 0,
            censusMedianGrossRent: parseFloat(cols[24]) || 0,
          });
        }
      }
    }
  } catch (err) {
    console.error("Failed to load market data:", err);
  }

  marketDataCache = dataMap;
  return dataMap;
}

/**
 * Generates regional benchmarks dynamically based on market data
 */
export function getDynamicBenchmarks(
  city: string,
  state: string = "TX",
): RegionalBenchmarks {
  if (!benchmarkCache) benchmarkCache = new Map();
  const cacheKey = `${city.toLowerCase()}-${state.toLowerCase()}`;
  if (benchmarkCache.has(cacheKey)) return benchmarkCache.get(cacheKey)!;

  const marketData = loadMarketData();
  const cityData = marketData.get(city.toLowerCase());

  if (!cityData) {
    return { ...DEFAULT_BENCHMARKS, city, state };
  }

  const pricePerSqftTarget = cityData.zhviCurrent / 1800;
  const grossYieldTarget =
    ((cityData.zoriCurrent * 12) / cityData.zhviCurrent) * 100;

  const benchmarks: RegionalBenchmarks = {
    city,
    state,
    capRate: {
      min: Math.max(4, grossYieldTarget - 4),
      good: Math.max(6, grossYieldTarget - 2),
      excellent: Math.max(8, grossYieldTarget),
    },
    cashOnCash: {
      min: Math.max(5, grossYieldTarget - 2),
      good: Math.max(8, grossYieldTarget + 1),
      excellent: Math.max(12, grossYieldTarget + 4),
    },
    grossYield: {
      min: Math.max(5, grossYieldTarget - 1),
      good: Math.max(8, grossYieldTarget + 1),
      excellent: Math.max(10, grossYieldTarget + 3),
    },
    pricePerSqft: {
      min: Math.round(pricePerSqftTarget * 0.8),
      good: Math.round(pricePerSqftTarget),
      excellent: Math.round(pricePerSqftTarget * 1.2),
    },
    pricePerDoor: {
      min: Math.round(cityData.zhviCurrent * 0.3),
      good: Math.round(cityData.zhviCurrent * 0.5),
      excellent: Math.round(cityData.zhviCurrent * 0.7),
    },
    onePercentRule: grossYieldTarget >= 12,
    daysOnMarketAvg: 40,
    vacancyRateAvg: 0.07,
    appreciationRate:
      cityData.zhvi1YrGrowth > -10 && cityData.zhvi1YrGrowth < 10
        ? cityData.zhvi1YrGrowth / 100
        : 0.035,
  };

  benchmarkCache.set(cacheKey, benchmarks);
  return benchmarks;
}

export function getZHVIForLocation(city: string): number | null {
  return loadMarketData().get(city.toLowerCase())?.zhviCurrent || null;
}

export function getZORIForLocation(city: string): number | null {
  return loadMarketData().get(city.toLowerCase())?.zoriCurrent || null;
}
