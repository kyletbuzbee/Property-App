import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

/**
 * GET /api/predictions
 * Returns BRRR predictions for properties
 *
 * Query params:
 * - city: Filter by city
 * - minYield: Minimum gross yield threshold
 * - propertyId: Get specific property
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city");
    const minYield = searchParams.get("minYield");
    const propertyId = searchParams.get("propertyId");

    // Load predictions from JSON file
    const predictionsPath = path.join(
      process.cwd(),
      "predictions_for_app.json",
    );

    if (!fs.existsSync(predictionsPath)) {
      return NextResponse.json(
        {
          success: false,
          error: "Predictions not available. Run predict_production.py first.",
        },
        { status: 404 },
      );
    }

    const predictionsData = fs.readFileSync(predictionsPath, "utf-8");
    let predictions = JSON.parse(predictionsData);

    // Filter by property ID
    if (propertyId) {
      predictions = predictions.filter(
        (p: any) => p.property_id === propertyId,
      );
      if (predictions.length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: "Property not found",
          },
          { status: 404 },
        );
      }
      return NextResponse.json({ success: true, data: predictions[0] });
    }

    // Filter by city
    if (city) {
      predictions = predictions.filter(
        (p: any) => p.city?.toLowerCase() === city.toLowerCase(),
      );
    }

    // Filter by minimum yield
    if (minYield) {
      const minYieldNum = parseFloat(minYield);
      predictions = predictions.filter(
        (p: any) => p.gross_yield && p.gross_yield >= minYieldNum,
      );
    }

    // Sort by yield (highest first)
    predictions.sort(
      (a: any, b: any) => (b.gross_yield || 0) - (a.gross_yield || 0),
    );

    // Add ranking
    predictions = predictions.map((p: any, idx: number) => ({
      ...p,
      yield_rank: idx + 1,
    }));

    return NextResponse.json({
      success: true,
      data: predictions,
      count: predictions.length,
    });
  } catch (error) {
    console.error("Predictions API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch predictions",
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/predictions
 * Get predictions for a single property based on input features
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { price, sqft, beds, baths, city, zip, zhvi } = body;

    // Simple heuristic-based prediction for new properties
    // In production, this would call a Python model or ML service

    let predictedRent = null;
    let predictedARV = null;
    let grossYield = null;
    let confidence = 0.5;

    // Rent estimation: $/sqft by city (from training data)
    const rentPerSqft: Record<string, number> = {
      Kilgore: 0.71,
      Gilmer: 0.85,
      Quitman: 0.55,
      Overton: 0.6,
      Mineola: 0.6,
      Rusk: 0.6,
      Winona: 0.6,
      Lindale: 0.6,
    };

    const cityKey = city || "Unknown";
    const rate = rentPerSqft[cityKey] || 0.6;

    if (sqft && sqft > 0) {
      predictedRent = Math.round(sqft * rate);
      confidence += 0.2;
    }

    // ARV estimation
    if (zhvi && zhvi > 0) {
      predictedARV = Math.round(zhvi * 0.9);
      confidence += 0.2;
    } else if (price && price > 0) {
      predictedARV = Math.round(price * 1.15); // Assume 15% equity
      confidence += 0.1;
    }

    // Yield calculation
    if (price && price > 0 && predictedRent) {
      grossYield = ((predictedRent * 12) / price) * 100;
    }

    const result = {
      input: { price, sqft, beds, baths, city },
      predicted_rent: predictedRent,
      predicted_arv: predictedARV,
      gross_yield: grossYield ? Math.round(grossYield * 100) / 100 : null,
      confidence: Math.min(confidence, 1.0),
      source: "api_heuristic",
    };

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Prediction calculation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to calculate prediction",
      },
      { status: 500 },
    );
  }
}
