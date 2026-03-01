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
import { properties as localProperties } from "@/data/properties";

/**
 * GET /api/properties
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

    if (id) {
      let property;
      try {
        property = await prisma.property.findUnique({
          where: { id },
        });
      } catch (dbError) {
        console.warn("Prisma error, falling back to local data:", dbError);
        property = localProperties.find((p) => p.id === id);
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
        // @ts-ignore
        calculated = addCalculations(serialized as any);
      } catch (e) {
        // Fallback: at least return the serialized data if calculations fail
        calculated = {
          ...serialized,
          pricePerSqft: 0,
          pricePerDoor: 0,
        } as any;
      }

      if (enrich) {
        loadMarketData();
        const benchmarks = getDynamicBenchmarks(
          calculated.city,
          calculated.state,
        );
        const comps = KnowledgeBundle.getSoldComps(calculated.zip, calculated.sqft);
        const velocity = KnowledgeBundle.getMarketVelocity(calculated.zip, "Standard");
        const avmList = KnowledgeBundle.getAttomAvm(calculated.zip, calculated.sqft);
        const avm = avmList.length > 0 ? avmList[0] : null;

        // Apply AI Analysis
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
        } as any;
        
        const enrichedList = enrichWithPredictions([calculated as any]);
        calculated = enrichedList[0] as any;
      }

      return NextResponse.json({ success: true, data: calculated });
    }

    const where: any = {};
    if (strategy) where.strategy = strategy;
    if (decision) where.decision = decision;
    if (city) where.city = { contains: city, mode: "insensitive" };

    if (search) {
      where.OR = [
        { address: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
        { rationale: { contains: search, mode: "insensitive" } },
        { details: { contains: search, mode: "insensitive" } },
      ];
    }

    let properties = [];
    try {
      properties = await prisma.property.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });
    } catch (dbError) {
      console.warn("Prisma error, falling back to local data:", dbError);
      // Basic local filtering
      properties = localProperties.filter((p) => {
        if (strategy && p.strategy !== strategy) return false;
        if (decision && p.decision !== decision) return false;
        if (city && !p.city.toLowerCase().includes(city.toLowerCase()))
          return false;
        if (search) {
          const s = search.toLowerCase();
          return (
            p.address.toLowerCase().includes(s) ||
            p.city.toLowerCase().includes(s) ||
            p.rationale.toLowerCase().includes(s)
          );
        }
        return true;
      });
    }

    const serialized = properties.map((p) =>
      serializeProperty(p as any),
    ) as PropertyBase[];
    let calculated = addCalculationsToAll(serialized);

    if (enrich) {
      loadMarketData();
      calculated = await Promise.all(calculated.map(async (prop) => {
        const benchmarks = getDynamicBenchmarks(prop.city, prop.state);
        const comps = KnowledgeBundle.getSoldComps(prop.zip, prop.sqft);
        const velocity = KnowledgeBundle.getMarketVelocity(prop.zip, "Standard");
        const avmList = KnowledgeBundle.getAttomAvm(prop.zip, prop.sqft);
        const avm = avmList.length > 0 ? avmList[0] : null;

        try {
          // Apply AI Analysis with error handling
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
          // Return property without AI enrichment
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
 * Triggers AI Analysis automatically.
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

    const serialized = serializeProperty(newProperty as any);
    // @ts-ignore
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

    const serialized = serializeProperty(updatedProperty as any);
    // @ts-ignore
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
