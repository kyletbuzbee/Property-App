/**
 * API Route: Market Data
 * Provides ZHVI and market forecast data for client components
 * This keeps KnowledgeBundle (fs-dependent) server-side only
 */

import { NextRequest, NextResponse } from "next/server";
import {
  getMarketHealth,
  predictExitValue,
  getZHVI,
  getCountyFromZip,
  getFHFA_HPI,
} from "@/lib/ai/marketForecast.server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const zip = searchParams.get("zip");
    const arv = searchParams.get("arv");
    const holdMonths = searchParams.get("holdMonths") || "4";

    if (!zip) {
      return NextResponse.json(
        { success: false, error: "Zip code is required" },
        { status: 400 },
      );
    }

    // Get market health
    const health = getMarketHealth(zip);

    // Get exit forecast if ARV provided
    let forecast = null;
    if (arv) {
      const arvNum = parseFloat(arv);
      const monthsNum = parseInt(holdMonths, 10);
      if (!isNaN(arvNum) && !isNaN(monthsNum)) {
        forecast = predictExitValue(zip, arvNum, monthsNum);
      }
    }

    // Get raw ZHVI data for client-side use
    const zhviData = getZHVI(zip);
    const fhfaData = getFHFA_HPI(getCountyFromZip(zip));

    return NextResponse.json({
      success: true,
      data: {
        zip,
        health,
        forecast,
        zhvi: zhviData,
        fhfa: fhfaData,
      },
    });
  } catch (error) {
    console.error("Market data API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch market data" },
      { status: 500 },
    );
  }
}

/**
 * Batch endpoint for multiple zip codes
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { zips } = body as { zips: string[] };

    if (!Array.isArray(zips) || zips.length === 0) {
      return NextResponse.json(
        { success: false, error: "Array of zip codes is required" },
        { status: 400 },
      );
    }

    // Deduplicate zips
    const uniqueZips = [...new Set(zips)];

    // Fetch data for all zips
    const results = uniqueZips.map((zip) => ({
      zip,
      health: getMarketHealth(zip),
      zhvi: getZHVI(zip),
      fhfa: getFHFA_HPI(getCountyFromZip(zip)),
    }));

    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error("Market data batch API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch market data" },
      { status: 500 },
    );
  }
}
