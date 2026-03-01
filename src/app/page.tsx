import { supabase } from "@/app/lib/db";
import DashboardClient from "@/components/DashboardClient";
import { PropertyProvider } from "@/context/PropertyContext";
import {
  PropertyWithCalculations,
  addCalculations,
  serializeProperties,
} from "@/lib/calculations";
import { properties as localProperties } from "@/data/properties";
import { KnowledgeBundle } from "@/lib/knowledgeBundle";
import { analyzePropertyFlip } from "@/lib/ai/enhancedScoring";

export const dynamic = "force-dynamic";

/**
 * Fetch properties from the database and apply AI analysis.
 */
async function getProperties(): Promise<PropertyWithCalculations[]> {
  try {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return getLocalPropertiesWithCalculations();
    }

    const converted = data.map((prop: any) => ({
      ...prop,
      listPrice: prop.list_price,
      equityGap: prop.equity_gap,
      isOwned: prop.is_owned,
      purchasePrice: prop.purchase_price,
      purchaseDate: prop.purchase_date ? new Date(prop.purchase_date) : null,
      rehabCompleted: prop.rehab_completed ? new Date(prop.rehab_completed) : null,
      isFavorite: prop.is_favorite,
      favoriteNotes: prop.favorite_notes,
      dealScore: prop.deal_score,
      riskLevel: prop.risk_level,
      status: prop.status || prop.property_status || "NEW_LEAD",
      createdAt: new Date(prop.created_at),
      updatedAt: new Date(prop.updated_at),
    }));

    const serialized = serializeProperties(converted);

    // Apply AI Analysis to every property
    const enriched = await Promise.all(serialized.map(async (p) => {
      // @ts-ignore
      const calculated = addCalculations(p);
      const aiResult = await analyzePropertyFlip({
        address: p.address,
        zip: p.zip,
        sqft: p.sqft,
        listPrice: p.listPrice,
        images: p.images || [],
      });

      const comps = KnowledgeBundle.getSoldComps(p.zip, p.sqft);
      const velocity = KnowledgeBundle.getMarketVelocity(p.zip, "Standard");
      const avmList = KnowledgeBundle.getAttomAvm(p.zip, p.sqft);

      return {
        ...calculated,
        decision: aiResult.data.decision,
        afterRepairValue: aiResult.data.arv,
        mao25k: aiResult.data.mao25k,
        mao50k: aiResult.data.mao50k,
        renovationBudget: aiResult.data.rehabEstimate,
        rehabTier: aiResult.data.rehabTier,
        rationale: aiResult.narrative,
        comps,
        velocity,
        avm: avmList[0] || null,
      };
    }));

    return enriched;
  } catch (error) {
    console.error("Fetch error:", error);
    return getLocalPropertiesWithCalculations();
  }
}

/**
 * Get local properties processed by the AI engine.
 */
async function getLocalPropertiesWithCalculations(): Promise<PropertyWithCalculations[]> {
  const serialized = serializeProperties(localProperties);
  
  return await Promise.all(serialized.map(async (p) => {
    // @ts-ignore
    const calculated = addCalculations(p);
    const aiResult = await analyzePropertyFlip({
      address: p.address,
      zip: p.zip,
      sqft: p.sqft,
      listPrice: p.listPrice,
      images: p.images || [],
    });

    const comps = KnowledgeBundle.getSoldComps(p.zip, p.sqft);
    const velocity = KnowledgeBundle.getMarketVelocity(p.zip, "Standard");
    const avmList = KnowledgeBundle.getAttomAvm(p.zip, p.sqft);

    return {
      ...calculated,
      status: p.status || "NEW_LEAD",
      decision: aiResult.data.decision,
      afterRepairValue: aiResult.data.arv,
      mao25k: aiResult.data.mao25k,
      mao50k: aiResult.data.mao50k,
      renovationBudget: aiResult.data.rehabEstimate,
      rehabTier: aiResult.data.rehabTier,
      rationale: aiResult.narrative,
      comps,
      velocity,
      avm: avmList[0] || null,
    };
  }));
}

export default async function Page() {
  const properties = await getProperties();

  return (
    <PropertyProvider initialData={properties}>
      <DashboardClient />
    </PropertyProvider>
  );
}
