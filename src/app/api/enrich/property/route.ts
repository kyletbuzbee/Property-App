/**
 * Property Enrichment API Endpoint
 *
 * POST /api/enrich/property
 * Body: { property: Property }
 *
 * Returns enriched property data with:
 * - School ratings (GreatSchools)
 * - Walk Score data
 * - Crime statistics
 * - Overall neighborhood score
 */

import { NextRequest, NextResponse } from "next/server";
import { Property } from "@/data/properties";
import {
  fetchPropertyEnrichment,
  fetchBatchEnrichment,
  getAPIHealthStatus,
} from "@/lib/ai/externalAPIs";

export const dynamic = "force-dynamic";

// POST /api/enrich/property - Enrich a single property
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { property } = body;

    if (!property) {
      return NextResponse.json(
        { error: "Property is required" },
        { status: 400 },
      );
    }

    // Validate property has required fields
    const requiredFields = ["id", "address", "city", "state", "lat", "lng"];
    const missingFields = requiredFields.filter((field) => !property[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 },
      );
    }

    // Fetch enrichment data
    const enrichmentData = await fetchPropertyEnrichment(property as Property);

    return NextResponse.json({
      success: true,
      data: enrichmentData,
      apiStatus: getAPIHealthStatus(),
    });
  } catch (error) {
    console.error("[Enrichment API] Error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch enrichment data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// GET /api/enrich/property - Health check and status
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Property Enrichment API",
    version: "1.0.0",
    apiStatus: getAPIHealthStatus(),
    features: [
      "GreatSchools school ratings",
      "Walk Score walkability data",
      "Crime statistics (mock)",
      "Neighborhood scoring",
    ],
    documentation: {
      endpoint: "/api/enrich/property",
      method: "POST",
      body: {
        property: "Property object with id, address, city, state, lat, lng",
      },
    },
  });
}
