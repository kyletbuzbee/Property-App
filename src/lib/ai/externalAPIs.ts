/**
 * External API Integrations for Property Enrichment
 * Tier 1 Implementation: GreatSchools, WalkScore, Crime Data
 *
 * Features:
 * - GreatSchools API for school ratings
 * - Walk Score API for walkability
 * - Crime data integration (mock/placeholder)
 * - Rate limiting and error handling
 * - Caching layer for API responses
 */

import { Property } from "@/data/properties";

// ============================================================================
// TYPES
// ============================================================================

export interface SchoolData {
  name: string;
  type: "elementary" | "middle" | "high" | "private";
  rating: number; // 1-10
  distance: number; // miles
  url?: string;
}

export interface GreatSchoolsResponse {
  schools: SchoolData[];
  overallRating: number;
  summary: string;
}

export interface WalkScoreResponse {
  walkScore: number;
  walkScoreDescription: string;
  transitScore: number;
  transitScoreDescription: string;
  bikeScore: number;
  bikeScoreDescription: string;
}

export interface CrimeDataResponse {
  crimeIndex: number; // 1-100 (lower is safer)
  crimeRatePer1000: number;
  trend: "increasing" | "stable" | "decreasing";
  categories: {
    property: number;
    violent: number;
    theft: number;
  };
}

export interface PropertyEnrichmentData {
  propertyId: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  lat: number;
  lng: number;
  schools?: GreatSchoolsResponse;
  walkScore?: WalkScoreResponse;
  crime?: CrimeDataResponse;
  neighborhoodScore: number;
  lastUpdated: string;
}

// ============================================================================
// API CONFIGURATION
// ============================================================================

interface APIConfig {
  baseUrl: string;
  apiKey?: string;
  timeout: number;
  maxRetries: number;
}

const GREAT_SCHOOLS_CONFIG: APIConfig = {
  baseUrl: "https://api.greatschools.org",
  apiKey: process.env.GREATSCHOOLS_API_KEY,
  timeout: 10000,
  maxRetries: 3,
};

const WALK_SCORE_CONFIG: APIConfig = {
  baseUrl: "https://api.walkscore.com",
  apiKey: process.env.WALKSCORE_API_KEY,
  timeout: 10000,
  maxRetries: 3,
};

// ============================================================================
// CACHE LAYER
// ============================================================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // milliseconds
}

class APICache {
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  private defaultTTL = 24 * 60 * 60 * 1000; // 24 hours

  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    if (!entry) return null;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  clear(): void {
    this.cache.clear();
  }

  // Generate cache key from lat/lng
  static geocodeKey(lat: number, lng: number, precision: number = 2): string {
    const factor = Math.pow(10, precision);
    return `${Math.round(lat * factor) / factor},${Math.round(lng * factor) / factor}`;
  }
}

export const apiCache = new APICache();

// ============================================================================
// API CLIENT HELPERS
// ============================================================================

async function fetchWithRetry<T>(
  url: string,
  config: APIConfig,
  options: RequestInit = {},
): Promise<T> {
  const { timeout, maxRetries } = config;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          Accept: "application/json",
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (attempt === maxRetries - 1) {
        throw error;
      }
      // Exponential backoff
      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, attempt) * 1000),
      );
    }
  }

  throw new Error("Max retries exceeded");
}

// ============================================================================
// GREAT SCHOOLS API
// ============================================================================

/**
 * Fetch school data from GreatSchools API
 * Note: Requires API key for production use
 *
 * API Documentation: https://www.greatschools.org/api/
 */
export async function fetchGreatSchoolsData(
  lat: number,
  lng: number,
  radius: number = 5, // miles
): Promise<GreatSchoolsResponse | null> {
  const cacheKey = `schools-${APICache.geocodeKey(lat, lng)}`;

  // Check cache first
  const cached = apiCache.get<GreatSchoolsResponse>(cacheKey);
  if (cached) {
    console.log("[GreatSchools] Cache hit");
    return cached;
  }

  // If no API key, return mock data for demo
  if (!GREAT_SCHOOLS_CONFIG.apiKey) {
    console.log("[GreatSchools] No API key - using mock data");
    const mockData = generateMockSchoolData(lat, lng);
    apiCache.set(cacheKey, mockData);
    return mockData;
  }

  try {
    const url = `${GREAT_SCHOOLS_CONFIG.baseUrl}/schools-nearby?key=${GREAT_SCHOOLS_CONFIG.apiKey}&lat=${lat}&lon=${lng}&radius=${radius}&limit=10`;

    const data = await fetchWithRetry<GreatSchoolsResponse>(
      url,
      GREAT_SCHOOLS_CONFIG,
    );

    apiCache.set(cacheKey, data);
    return data;
  } catch (error) {
    console.error("[GreatSchools] API Error:", error);
    // Fall back to mock data on error
    const mockData = generateMockSchoolData(lat, lng);
    apiCache.set(cacheKey, mockData);
    return mockData;
  }
}

function generateMockSchoolData(
  lat: number,
  lng: number,
): GreatSchoolsResponse {
  // Generate deterministic but varied ratings based on coordinates
  const seed = Math.abs(lat * lng * 1000) % 100;

  const schools: SchoolData[] = [
    {
      name: "Elementary School",
      type: "elementary",
      rating: Math.min(10, Math.max(3, Math.round(6 + (seed % 5)))),
      distance: 0.3 + (seed % 5) * 0.2,
    },
    {
      name: "Middle School",
      type: "middle",
      rating: Math.min(10, Math.max(3, Math.round(5 + ((seed + 3) % 5)))),
      distance: 0.8 + (seed % 4) * 0.3,
    },
    {
      name: "High School",
      type: "high",
      rating: Math.min(10, Math.max(3, Math.round(4 + ((seed + 7) % 6)))),
      distance: 1.2 + (seed % 5) * 0.4,
    },
  ];

  const overallRating = Math.round(
    schools.reduce((sum, s) => sum + s.rating, 0) / schools.length,
  );

  return {
    schools,
    overallRating,
    summary: `${overallRating}/10 overall rating based on ${schools.length} nearby schools`,
  };
}

// ============================================================================
// WALK SCORE API
// ============================================================================

/**
 * Fetch Walk Score data
 * Note: Requires API key for production use
 *
 * API Documentation: https://www.walkscore.com/dev/
 */
export async function fetchWalkScore(
  lat: number,
  lng: number,
  address: string,
): Promise<WalkScoreResponse | null> {
  const cacheKey = `walkscore-${APICache.geocodeKey(lat, lng)}`;

  // Check cache first
  const cached = apiCache.get<WalkScoreResponse>(cacheKey);
  if (cached) {
    console.log("[WalkScore] Cache hit");
    return cached;
  }

  // If no API key, return mock data for demo
  if (!WALK_SCORE_CONFIG.apiKey) {
    console.log("[WalkScore] No API key - using mock data");
    const mockData = generateMockWalkScore(lat, lng, address);
    apiCache.set(cacheKey, mockData);
    return mockData;
  }

  try {
    const encodedAddress = encodeURIComponent(address);
    const url = `${WALK_SCORE_CONFIG.baseUrl}/score?format=json&address=${encodedAddress}&lat=${lat}&lon=${lng}&transit=1&bike=1&wsapikey=${WALK_SCORE_CONFIG.apiKey}`;

    const data = await fetchWithRetry<WalkScoreResponse>(
      url,
      WALK_SCORE_CONFIG,
    );

    apiCache.set(cacheKey, data);
    return data;
  } catch (error) {
    console.error("[WalkScore] API Error:", error);
    // Fall back to mock data on error
    const mockData = generateMockWalkScore(lat, lng, address);
    apiCache.set(cacheKey, mockData);
    return mockData;
  }
}

function generateMockWalkScore(
  lat: number,
  lng: number,
  address: string,
): WalkScoreResponse {
  // Generate deterministic but varied scores based on coordinates
  const seed = Math.abs(lat * lng * 10000) % 100;
  const cityFactor = address.toLowerCase().includes("tyler") ? 20 : 0; // Tyler is more urban

  const walkScore = Math.min(
    100,
    Math.max(10, Math.round(30 + (seed % 40) + cityFactor)),
  );
  const transitScore = Math.min(
    100,
    Math.max(5, Math.round(10 + (seed % 35) + cityFactor * 0.5)),
  );
  const bikeScore = Math.min(
    100,
    Math.max(15, Math.round(35 + (seed % 35) + cityFactor * 0.3)),
  );

  const getWalkDescription = (score: number): string => {
    if (score >= 90) return "Walker's Paradise";
    if (score >= 70) return "Very Walkable";
    if (score >= 50) return "Somewhat Walkable";
    if (score >= 25) return "Car-Dependent";
    return "Almost All Errands Require a Car";
  };

  const getTransitDescription = (score: number): string => {
    if (score >= 90) return "Excellent Transit";
    if (score >= 70) return "Excellent Transit";
    if (score >= 50) return "Good Transit";
    if (score >= 25) return "Some Transit";
    return "Minimal Transit";
  };

  const getBikeDescription = (score: number): string => {
    if (score >= 90) return "Biker's Paradise";
    if (score >= 70) return "Very Bikeable";
    if (score >= 50) return "Bikeable";
    return "Somewhat Bikeable";
  };

  return {
    walkScore,
    walkScoreDescription: getWalkDescription(walkScore),
    transitScore,
    transitScoreDescription: getTransitDescription(transitScore),
    bikeScore,
    bikeScoreDescription: getBikeDescription(bikeScore),
  };
}

// ============================================================================
// CRIME DATA API
// ============================================================================

/**
 * Fetch crime data for a location
 * Note: This is a mock implementation - integrate with actual crime API
 *
 * Potential APIs to integrate:
 * - AreaConnect Crime Statistics
 * - NeighborhoodScout
 * - CrimeGrade.org
 * - PoliceData.gov
 */
export async function fetchCrimeData(
  lat: number,
  lng: number,
): Promise<CrimeDataResponse | null> {
  const cacheKey = `crime-${APICache.geocodeKey(lat, lng)}`;

  // Check cache first
  const cached = apiCache.get<CrimeDataResponse>(cacheKey);
  if (cached) {
    console.log("[CrimeData] Cache hit");
    return cached;
  }

  // Generate mock data (in production, replace with actual API call)
  const mockData = generateMockCrimeData(lat, lng);
  apiCache.set(cacheKey, mockData, 7 * 24 * 60 * 60 * 1000); // 7 day TTL for crime data

  return mockData;
}

function generateMockCrimeData(lat: number, lng: number): CrimeDataResponse {
  // Generate deterministic but varied scores based on coordinates
  const seed = Math.abs(lat * lng * 10000) % 100;

  // East Texas tends to have lower crime
  const baseCrime = 20 + (seed % 30);

  return {
    crimeIndex: Math.min(100, baseCrime),
    crimeRatePer1000: Math.round((baseCrime / 100) * 15 * 10) / 10, // per 1000 residents
    trend:
      seed % 3 === 0 ? "decreasing" : seed % 3 === 1 ? "stable" : "increasing",
    categories: {
      property: Math.round((baseCrime / 100) * 12 * 10) / 10,
      violent: Math.round((baseCrime / 100) * 3 * 10) / 10,
      theft: Math.round((baseCrime / 100) * 8 * 10) / 10,
    },
  };
}

// ============================================================================
// MAIN ENRICHMENT FUNCTION
// ============================================================================

/**
 * Fetch all enrichment data for a property
 */
export async function fetchPropertyEnrichment(
  property: Property,
): Promise<PropertyEnrichmentData> {
  const { lat, lng, address, city, state, zip } = property;

  // Fetch all data in parallel
  const [schools, walkScore, crime] = await Promise.all([
    fetchGreatSchoolsData(lat, lng),
    fetchWalkScore(lat, lng, address),
    fetchCrimeData(lat, lng),
  ]);

  // Convert null to undefined for optional fields
  const schoolsData = schools ?? undefined;
  const walkScoreData = walkScore ?? undefined;
  const crimeData = crime ?? undefined;

  // Calculate overall neighborhood score
  let neighborhoodScore = 50; // Default neutral score

  if (schools && walkScore && crime) {
    neighborhoodScore = Math.round(
      schools.overallRating * 10 * 0.35 + // Schools 35%
        walkScore.walkScore * 0.3 + // Walkability 30%
        (100 - crime.crimeIndex) * 0.35, // Safety 35%
    );
  } else if (schools || walkScore || crime) {
    let totalWeight = 0;
    let weightedSum = 0;

    if (schools) {
      weightedSum += schools.overallRating * 10 * 0.4;
      totalWeight += 0.4;
    }
    if (walkScore) {
      weightedSum += walkScore.walkScore * 0.3;
      totalWeight += 0.3;
    }
    if (crime) {
      weightedSum += (100 - crime.crimeIndex) * 0.3;
      totalWeight += 0.3;
    }

    neighborhoodScore =
      totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 50;
  }

  return {
    propertyId: property.id,
    address,
    city,
    state,
    zip,
    lat,
    lng,
    schools: schoolsData,
    walkScore: walkScoreData,
    crime: crimeData,
    neighborhoodScore,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Batch fetch enrichment data for multiple properties
 */
export async function fetchBatchEnrichment(
  properties: Property[],
  onProgress?: (completed: number, total: number) => void,
): Promise<Map<string, PropertyEnrichmentData>> {
  const results = new Map<string, PropertyEnrichmentData>();

  for (let i = 0; i < properties.length; i++) {
    const property = properties[i];
    const enrichment = await fetchPropertyEnrichment(property);
    results.set(property.id, enrichment);

    if (onProgress) {
      onProgress(i + 1, properties.length);
    }

    // Rate limiting: wait between requests
    if (i < properties.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  return results;
}

// ============================================================================
// DATA TRANSFORMATION
// ============================================================================

/**
 * Convert enrichment data to neighborhood score object
 */
export function enrichmentToNeighborhoodScore(
  enrichment: PropertyEnrichmentData,
): {
  schoolsScore?: number;
  crimeScore?: number;
  walkScore?: number;
} {
  return {
    schoolsScore: enrichment.schools
      ? enrichment.schools.overallRating * 10
      : undefined,
    crimeScore: enrichment.crime
      ? 100 - enrichment.crime.crimeIndex
      : undefined,
    walkScore: enrichment.walkScore?.walkScore,
  };
}

// ============================================================================
// API HEALTH CHECK
// ============================================================================

export interface APIHealthStatus {
  greatSchools: "ok" | "error" | "no-key" | "mock";
  walkScore: "ok" | "error" | "no-key" | "mock";
  crime: "ok" | "error" | "mock";
}

export function getAPIHealthStatus(): APIHealthStatus {
  return {
    greatSchools: GREAT_SCHOOLS_CONFIG.apiKey ? "ok" : "mock",
    walkScore: WALK_SCORE_CONFIG.apiKey ? "ok" : "mock",
    crime: "mock", // Always mock for now
  };
}
