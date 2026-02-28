import fs from "fs";
import path from "path";

export interface MLPrediction {
  property_id?: string;
  address?: string;
  city?: string;
  price?: number;
  sqft?: number;
  beds?: number;
  baths?: number;
  county?: string;
  predicted_arv?: number;
  predicted_rent?: number;
  gross_yield?: number;
  equity_potential?: number;
  confidence?: number;
  deal_score?: number;
  recommendation?: "PLATINUM" | "GOLD" | "SILVER" | "CAUTION" | "HARD_FAIL";
}

let predictionsCache: MLPrediction[] | null = null;
let predictionsMapCache: Map<string, MLPrediction> | null = null;

/**
 * Load predictions from JSON file
 */
export function loadPredictions(): MLPrediction[] {
  if (predictionsCache) return predictionsCache;

  const predictionsPath = path.join(process.cwd(), "predictions_for_app.json");

  try {
    if (fs.existsSync(predictionsPath)) {
      const data = fs.readFileSync(predictionsPath, "utf-8");
      predictionsCache = JSON.parse(data);

      // Build map by address/city or property_id for O(1) lookups
      predictionsMapCache = new Map();
      predictionsCache!.forEach((p) => {
        if (p.property_id) {
          predictionsMapCache!.set(p.property_id, p);
        }
        // Also map by a composite key (address + city) to match db properties
        if (p.address && p.city) {
          // Keep first part of address for matching (e.g. '115 County Road' from '115 County Road, Hughes Springs, TX')
          const streetAddress = p.address.split(",")[0].trim().toLowerCase();
          const key = `${streetAddress}-${p.city.toLowerCase()}`;
          predictionsMapCache!.set(key, p);
        }
      });

      return predictionsCache!;
    }
  } catch (error) {
    console.error("Failed to load predictions:", error);
  }

  return [];
}

/**
 * Get prediction for a specific property
 */
export function getPredictionForProperty(
  propertyId: string,
  address?: string,
  city?: string,
): MLPrediction | null {
  loadPredictions();
  if (!predictionsMapCache) return null;

  // Try ID lookup
  if (predictionsMapCache.has(propertyId)) {
    return predictionsMapCache.get(propertyId)!;
  }

  // Try address/city lookup
  if (address && city) {
    const streetAddress = address.split(",")[0].trim().toLowerCase();
    const key = `${streetAddress}-${city.toLowerCase()}`;
    if (predictionsMapCache.has(key)) {
      return predictionsMapCache.get(key)!;
    }
  }

  return null;
}

/**
 * Batch enriches properties with AI predictions
 */
export function enrichWithPredictions<
  T extends { id: string; address: string; city: string },
>(properties: T[]): (T & { aiPrediction?: MLPrediction })[] {
  loadPredictions();

  return properties.map((property) => {
    const prediction = getPredictionForProperty(
      property.id,
      property.address,
      property.city,
    );
    if (prediction) {
      return { ...property, aiPrediction: prediction };
    }
    return property;
  });
}
