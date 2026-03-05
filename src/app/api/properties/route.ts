import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";
import {
  addCalculations,
  addCalculationsToAll,
  serializeProperty,
  PropertyBase,
  PropertyWithCalculations,
} from "@/lib/calculations";
import { getDynamicBenchmarks, loadMarketData } from "@/lib/marketData";
import { KnowledgeBundle } from "@/lib/knowledgeBundle";
import { enrichWithPredictions } from "@/lib/ai/predictionService";
import { analyzePropertyFlip } from "@/lib/ai/enhancedScoring";
import { properties as localProperties, Property } from "@/data/properties";

// Helper to filter local properties
function filterLocalProperties(
  properties: Property[],
  filters: {
    search?: string | null;
    strategy?: string | null;
    decision?: string | null;
    city?: string | null;
  }
): Property[] {
  return properties.filter((p) => {
    if (filters.strategy && p.strategy !== filters.strategy) return false;
    if (filters.decision && p.decision !== filters.decision) return false;
    if (filters.city && !p.city.toLowerCase().includes(filters.city.toLowerCase()))
      return false;
    if (filters.search) {
      const s = filters.search.toLowerCase();
      return (
        p.address.toLowerCase().includes(s) ||
        p.city.toLowerCase().includes(s) ||
        p.rationale.toLowerCase().includes(s) ||
        p.zip.includes(s)
      );
    }
    return true;
  });
}

/**
 * GET /api/properties
 * PRIMARY: Uses local processed/properties.json data
 * FALLBACK: Supabase/Prisma (when local data unavailable)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const search = searchParams.get("search");
    const strategy = searchParams.get("strategy");
    const decision = searchParams.get("decision");
    const city = searchParams.get("city");
    const enrich = searchParams.get("enrich") === "true";
    const source = searchParams.get("source") || "local"; // 'local' | 'database'

    // SINGLE PROPERTY FETCH
    if (id) {
      // Try local first (primary source)
      let property = localProperties.find((p) => p.id === id);
      let fromLocal = true;

      // Fallback to database if not found locally
      if (!property && source !== "local") {
        try {
          property = await prisma.property.findUnique({
            where: { id },
          }) as unknown as Property;
          fromLocal = false;
        } catch (dbError) {
          console.warn("Database fetch failed:", dbError);
        }
      }

      if (!property) {
        return NextResponse.json(
          { success: false, error: "Property not found" },
          { status: 404 },
        );
      }

      const serialized = serializeProperty(property as any);
      let calculated: PropertyWithCalculations;
      
      try {
        calculated = addCalculations(serialized as any) as PropertyWithCalculations;
      } catch (e) {
        calculated = {
          ...serialized,
          pricePerSqft: 0,
          pricePerDoor: 0,
        } as PropertyWithCalculations;
      }

      // Apply AI enrichment if requested
      if (enrich && fromLocal) {
        loadMarketData();
        const benchmarks = getDynamicBenchmarks(calculated.city, calculated.state);
        const comps = KnowledgeBundle.getSoldComps(calculated.zip, calculated.sqft);
        const velocity = KnowledgeBundle.getMarketVelocity(calculated.zip, "Standard");
        const avmList = KnowledgeBundle.getAttomAvm(calculated.zip, calculated.sqft);
        const avm = avmList.length > 0 ? avmList[0] : null;

        try {
          const aiResult = await analyzePropertyFlip({
            address: calculated.address,
            zip: calculated.zip,
            sqft: calculated.sqft,
            listPrice: calculated.listPrice,
            images: calculated.images || [],
          });

          calculated = {
            ...calculated,
            marketIntelligence: { benchmarks },
            comps,
            velocity,
            avm,
            decision: aiResult.data.decision,
            afterRepairValue: aiResult.data.arv,
            mao25k: aiResult.data.mao25k,
            mao50k: aiResult.data.mao50k,
            renovationBudget: aiResult.data.rehabEstimate,
            rehabTier: aiResult.data.rehabTier,
            rationale: aiResult.narrative,
          } as PropertyWithCalculations;
          
          const enrichedList = enrichWithPredictions([calculated as any]);
          calculated = enrichedList[0] as PropertyWithCalculations;
        } catch (aiError) {
          console.warn("AI enrichment failed:", aiError);
          calculated = {
            ...calculated,
            marketIntelligence: { benchmarks },
            comps,
            velocity,
            avm,
          } as PropertyWithCalculations;
        }
      }

      return NextResponse.json({ success: true, data: calculated });
    }

    // LIST PROPERTIES - PRIMARY: Local data
    let properties: Property[] = [];
    let fromLocal = true;

    if (source === "database") {
      // Explicit request for database data
      try {
        const where: any = {};
        if (strategy) where.strategy = strategy;
        if (decision) where.decision = decision;
        if (city) where.city = { contains: city, mode: "insensitive" };
        if (search) {
          where.OR = [
            { address: { contains: search, mode: "insensitive" } },
            { city: { contains: search, mode: "insensitive" } },
            { rationale: { contains: search, mode: "insensitive" } },
          ];
        }

        properties = await prisma.property.findMany({
          where,
          orderBy: { createdAt: "desc" },
        }) as unknown as Property[];
        fromLocal = false;
      } catch (dbError) {
        console.warn("Database query failed, falling back to local:", dbError);
        properties = filterLocalProperties(localProperties, { search, strategy, decision, city });
      }
    } else {
      // Default: Use local data (primary source)
      properties = filterLocalProperties(localProperties, { search, strategy, decision, city });
      
      // Sort by deal score (best deals first)
      properties.sort((a, b) => (b.dealScore || 0) - (a.dealScore || 0));
    }

    const serialized = properties.map((p) =>
      serializeProperty(p as any),
    ) as PropertyBase[];
    let calculated = addCalculationsToAll(serialized);

    // Apply AI enrichment if requested (for local data)
    if (enrich && fromLocal) {
      loadMarketData();
      calculated = await Promise.all(calculated.map(async (prop) => {
        const benchmarks = getDynamicBenchmarks(prop.city, prop.state);
        const comps = KnowledgeBundle.getSoldComps(prop.zip, prop.sqft);
        const velocity = KnowledgeBundle.getMarketVelocity(prop.zip, "Standard");
        const avmList = KnowledgeBundle.getAttomAvm(prop.zip, prop.sqft);
        const avm = avmList.length > 0 ? avmList[0] : null;

        try {
          const aiResult = await analyzePropertyFlip({
            address: prop.address,
            zip: prop.zip,
            sqft: prop.sqft,
            listPrice: prop.listPrice,
            images: prop.images || [],
          });

          return { 
            ...prop, 
            marketIntelligence: { benchmarks }, 
            comps, 
            velocity, 
            avm,
            decision: aiResult.data.decision,
            afterRepairValue: aiResult.data.arv,
            mao25k: aiResult.data.mao25k,
            mao50k: aiResult.data.mao50k,
            renovationBudget: aiResult.data.rehabEstimate,
            rehabTier: aiResult.data.rehabTier,
            rationale: aiResult.narrative,
          };
        } catch (aiError) {
          console.error(`AI analysis failed for property ${prop.id}:`, aiError);
          return {
            ...prop,
            marketIntelligence: { benchmarks },
            comps,
            velocity,
            avm,
          };
        }
      }));
      calculated = enrichWithPredictions(calculated as any) as any;
    }

    return NextResponse.json({
      success: true,
      data: calculated,
      count: calculated.length,
      source: fromLocal ? "local" : "database",
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch properties" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/properties
 * Creates property in database (for tracking owned/in-progress deals)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, createdAt, updatedAt, ...data } = body;

    // Trigger AI Analysis before saving
    const analysis = await analyzePropertyFlip({
      address: data.address,
      zip: data.zip,
      sqft: Number(data.sqft),
      listPrice: Number(data.listPrice),
      images: data.images || [],
    });

    const newProperty = await prisma.property.create({
      data: {
        address: data.address,
        city: data.city,
        state: data.state || "TX",
        zip: data.zip || "",
        lat: data.lat || 0,
        lng: data.lng || 0,
        listPrice: Number(data.listPrice) || 0,
        sqft: Number(data.sqft) || 0,
        bedrooms: data.bedrooms || 0,
        bathrooms: data.bathrooms || 0,
        // AI Results
        decision: analysis.data.decision,
        rationale: analysis.narrative,
        afterRepairValue: analysis.data.arv,
        mao25k: analysis.data.mao25k,
        mao50k: analysis.data.mao50k,
        renovationBudget: analysis.data.rehabEstimate,
        rehabTier: analysis.data.rehabTier,
        arvSource: "AI_KNOWLEDGE_BUNDLE",
        // Other fields
        strategy: data.strategy || "Retail Flip",
        type: data.type || "House for sale",
        realtor: data.realtor || null,
        url: data.url || null,
        details: data.details || null,
        images: data.images || [],
        annualTaxes: data.annualTaxes || 0,
        annualInsurance: data.annualInsurance || 0,
        notes: data.notes || "",
        isOwned: data.isOwned || false,
        purchasePrice: data.purchasePrice || 0,
        isFavorite: data.isFavorite || false,
        favoriteNotes: data.favoriteNotes || "",
        dealScore: analysis.data.confidence * 100,
        riskLevel: analysis.data.decision === "HARD_FAIL" ? "High" : "Medium",
      },
    });

    const serialized = serializeProperty(newProperty as any) as PropertyBase;
    const calculated = addCalculations(serialized);

    return NextResponse.json(
      { success: true, data: calculated },
      { status: 201 },
    );
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create property" },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/properties
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, createdAt, updatedAt, triggerAnalysis, ...data } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Property ID is required" },
        { status: 400 },
      );
    }

    let analysisUpdate = {};
    if (triggerAnalysis) {
      const analysis = await analyzePropertyFlip({
        address: data.address || "",
        zip: data.zip || "",
        sqft: Number(data.sqft) || 0,
        listPrice: Number(data.listPrice) || 0,
        images: data.images || [],
      });
      analysisUpdate = {
        decision: analysis.data.decision,
        rationale: analysis.narrative,
        afterRepairValue: analysis.data.arv,
        mao25k: analysis.data.mao25k,
        mao50k: analysis.data.mao50k,
        renovationBudget: analysis.data.rehabEstimate,
        rehabTier: analysis.data.rehabTier,
        dealScore: analysis.data.confidence * 100,
      };
    }

    const updateData: any = {
      ...data,
      ...analysisUpdate,
      listPrice:
        data.listPrice !== undefined ? Number(data.listPrice) : undefined,
      sqft: data.sqft !== undefined ? Number(data.sqft) : undefined,
      purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : undefined,
      rehabCompleted: data.rehabCompleted
        ? new Date(data.rehabCompleted)
        : undefined,
    };

    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key],
    );

    const updatedProperty = await prisma.property.update({
      where: { id },
      data: updateData,
    });

    const serialized = serializeProperty(updatedProperty as any) as PropertyBase;
    const calculated = addCalculations(serialized);

    return NextResponse.json({ success: true, data: calculated });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update property" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/properties
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id)
      return NextResponse.json(
        { success: false, error: "Property ID is required" },
        { status: 400 },
      );
    await prisma.property.delete({ where: { id } });
    return NextResponse.json({
      success: true,
      message: "Property deleted successfully",
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete property" },
      { status: 500 },
    );
  }
}
