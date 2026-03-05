import { NextRequest, NextResponse } from "next/server";
import { analyzePropertyFlip } from "@/lib/ai/enhancedScoring";

/**
 * POST /api/properties/bulk-import
 * Bulk import properties from CSV or JSON data
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { properties, format = "json" } = body;

    if (!properties || !Array.isArray(properties) || properties.length === 0) {
      return NextResponse.json(
        { success: false, error: "No properties provided" },
        { status: 400 }
      );
    }

    // Limit to 100 properties at a time
    if (properties.length > 100) {
      return NextResponse.json(
        { success: false, error: "Maximum 100 properties per import" },
        { status: 400 }
      );
    }

    const results = {
      imported: [] as any[],
      failed: [] as { index: number; error: string; data: any }[],
      summary: {
        total: properties.length,
        success: 0,
        failed: 0,
        pass: 0,
        caution: 0,
        hardFail: 0,
      },
    };

    // Process each property
    for (let i = 0; i < properties.length; i++) {
      const rawProperty = properties[i];

      try {
        // Normalize property data (handle different CSV/JSON formats)
        const normalized = normalizePropertyData(rawProperty, format);

        // Validate required fields
        if (!normalized.address || !normalized.listPrice || !normalized.sqft) {
          throw new Error("Missing required fields: address, price/listPrice, sqft");
        }

        // Run AI analysis
        const aiResult = await analyzePropertyFlip({
          address: normalized.address,
          zip: normalized.zip,
          sqft: normalized.sqft,
          listPrice: normalized.listPrice,
          yearBuilt: normalized.yearBuilt,
        });

        // Create property object with AI analysis
        const property = {
          id: normalized.id || generateId(normalized.address),
          address: normalized.address,
          city: normalized.city,
          state: normalized.state || "TX",
          zip: normalized.zip,
          lat: normalized.lat || 0,
          lng: normalized.lng || 0,
          listPrice: normalized.listPrice,
          equityGap: Math.round(aiResult.data.arv * 0.2),
          sqft: normalized.sqft,
          bedrooms: normalized.bedrooms || 0,
          bathrooms: normalized.bathrooms || 0,
          decision: aiResult.data.decision,
          strategy: normalized.strategy || "Retail Flip",
          status: "NEW_LEAD",
          yearBuilt: normalized.yearBuilt || null,
          rationale: aiResult.narrative,
          type: normalized.type || "Single Family Residence",
          realtor: normalized.realtor || null,
          url: normalized.url || null,
          details: normalized.details || null,
          images: normalized.images || [],
          annualTaxes: normalized.annualTaxes || Math.round(normalized.listPrice * 0.02),
          annualInsurance: normalized.annualInsurance || 1200,
          renovationBudget: aiResult.data.rehabEstimate,
          afterRepairValue: aiResult.data.arv,
          notes: normalized.notes || `Imported ${new Date().toLocaleDateString()}`,
          mao25k: aiResult.data.mao25k,
          mao50k: aiResult.data.mao50k,
          holdingCosts: Math.round(normalized.listPrice * 0.05),
          closingCosts: Math.round(normalized.listPrice * 0.1),
          rehabTier: aiResult.data.rehabTier,
          arvSource: "AI_ANALYSIS",
          isOwned: false,
          purchasePrice: 0,
          isFavorite: false,
          favoriteNotes: "",
          dealScore: aiResult.data.dealScore,
          riskLevel: aiResult.data.decision === "HARD_FAIL" ? "High" : "Medium",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        results.imported.push(property);
        results.summary.success++;

        // Track decisions
        if (aiResult.data.decision === "PASS") results.summary.pass++;
        else if (aiResult.data.decision === "CAUTION") results.summary.caution++;
        else results.summary.hardFail++;
      } catch (error) {
        results.failed.push({
          index: i,
          error: error instanceof Error ? error.message : "Unknown error",
          data: rawProperty,
        });
        results.summary.failed++;
      }
    }

    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error("Bulk import error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Import failed",
      },
      { status: 500 }
    );
  }
}

/**
 * Normalize property data from various formats
 */
function normalizePropertyData(data: any, format: string) {
  const normalized: any = {};

  // Address handling
  if (data.address) {
    normalized.address = String(data.address).trim();
  } else if (data.street) {
    normalized.address = String(data.street).trim();
  }

  // Price handling (various formats)
  const priceValue =
    data.listPrice ||
    data.list_price ||
    data.price ||
    data.Price ||
    data["List Price"] ||
    data["Sale Price"];
  normalized.listPrice = parseCurrency(priceValue);

  // Sqft handling
  const sqftValue =
    data.sqft || data.sqFt || data.Sqft || data["Sq Ft"] || data["Total Sqft"];
  normalized.sqft = parseNumber(sqftValue);

  // City, State, Zip
  normalized.city = data.city || data.City || "";
  normalized.state = data.state || data.State || "TX";
  normalized.zip = String(data.zip || data.zip_code || data.Zip || data["Zip Code"] || "");

  // Parse address if it's a full address string
  if (normalized.address && normalized.address.includes(",")) {
    const parts = normalized.address.split(",").map((p: string) => p.trim());
    if (parts.length >= 2 && !normalized.city) {
      normalized.city = parts[parts.length - 2];
    }
    if (parts.length >= 1 && !normalized.zip) {
      const zipMatch = parts[parts.length - 1].match(/\d{5}/);
      if (zipMatch) normalized.zip = zipMatch[0];
    }
  }

  // Bedrooms/Bathrooms
  normalized.bedrooms = parseNumber(data.beds || data.bedrooms || data.Beds || 0);
  normalized.bathrooms = parseFloat(data.baths || data.bathrooms || data.Baths || 0) || 0;

  // Year built
  normalized.yearBuilt = parseNumber(
    data.yearBuilt || data.year_built || data["Year Built"] || null
  ) || null;

  // Type
  normalized.type =
    data.type ||
    data["Property Type"] ||
    data.propertyType ||
    "Single Family Residence";

  // Realtor/Brokerage
  normalized.realtor = data.realtor || data.brokerage || data.agent || data["Listing Agent"] || null;

  // URL
  normalized.url = data.url || data.link || data["Listing URL"] || data.zillow || null;

  // Notes/Details
  normalized.details = data.details || data.notes || data.description || data.Description || null;

  // Taxes/Insurance
  normalized.annualTaxes = parseNumber(data.annualTaxes || data.taxes || 0);
  normalized.annualInsurance = parseNumber(data.annualInsurance || 1200);

  // Images
  if (data.images) {
    normalized.images = Array.isArray(data.images) ? data.images : [data.images];
  }

  return normalized;
}

/**
 * Parse currency string or number
 */
function parseCurrency(value: any): number {
  if (typeof value === "number") return value;
  if (!value) return 0;

  const cleaned = String(value)
    .replace(/[$,]/g, "")
    .replace(/\s+/g, "")
    .trim();

  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

/**
 * Parse number from various formats
 */
function parseNumber(value: any): number {
  if (typeof value === "number") return value;
  if (!value) return 0;

  const cleaned = String(value).replace(/[,]/g, "").trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

/**
 * Generate unique ID from address
 */
function generateId(address: string): string {
  return address
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 50);
}
