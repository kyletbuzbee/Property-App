import { supabase } from "@/app/lib/db";
import DashboardClient from "@/components/DashboardClient";
import { PropertyProvider } from "@/context/PropertyContext";
import {
  PropertyWithCalculations,
  addCalculations,
  serializeProperties,
} from "@/lib/calculations";
import { properties as localProperties } from "@/data/properties";

export const dynamic = "force-dynamic";

/**
 * Fetch properties from the database and add calculations.
 * Falls back to local data if Supabase is unavailable.
 */
async function getProperties(): Promise<PropertyWithCalculations[]> {
  try {
    // Try Supabase first
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase error, using local data:", error.message);
      return getLocalPropertiesWithCalculations();
    }

    if (!data || data.length === 0) {
      console.warn("No data from Supabase, using local data");
      return getLocalPropertiesWithCalculations();
    }

    // Convert snake_case to camelCase and handle dates
    const converted = (data || []).map((prop: any) => ({
      ...prop,
      listPrice: prop.list_price,
      equityGap: prop.equity_gap,
      isOwned: prop.is_owned,
      purchasePrice: prop.purchase_price,
      purchaseDate: prop.purchase_date ? new Date(prop.purchase_date) : null,
      rehabCompleted: prop.rehab_completed
        ? new Date(prop.rehab_completed)
        : null,
      isFavorite: prop.is_favorite,
      favoriteNotes: prop.favorite_notes,
      dealScore: prop.deal_score,
      riskLevel: prop.risk_level,
      createdAt: new Date(prop.created_at),
      updatedAt: new Date(prop.updated_at),
    }));

    // Serialize Date objects to strings for client-side usage
    const serialized = serializeProperties(converted);

    // Add calculated fields using the shared utility
    // @ts-ignore - serializeProperties intentionally converts Date to string
    return serialized.map(addCalculations);
  } catch (error) {
    console.error("Database connection error, using local data:", error);
    return getLocalPropertiesWithCalculations();
  }
}

/**
 * Get local sample properties with calculations applied.
 */
function getLocalPropertiesWithCalculations(): PropertyWithCalculations[] {
  // @ts-ignore - localProperties has string dates, serializeProperties handles conversion
  const serialized = serializeProperties(localProperties);
  // @ts-ignore - serializeProperties intentionally converts Date to string
  return serialized.map(addCalculations);
}

export default async function Page() {
  // Fetch data on the server
  const properties = await getProperties();

  // Pass to the client component via context provider
  // This eliminates the "double fetch" pattern
  return (
    <PropertyProvider initialData={properties}>
      <DashboardClient />
    </PropertyProvider>
  );
}
