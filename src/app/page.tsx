import { supabase } from '@/app/lib/db';
import DashboardClient from '@/components/DashboardClient';
import { PropertyProvider } from '@/context/PropertyContext';
import { 
  PropertyWithCalculations, 
  addCalculations, 
  serializeProperties 
} from '@/lib/calculations';

export const dynamic = 'force-dynamic';

/**
 * Fetch properties from the database and add calculations.
 * Uses Supabase client for reliable connection.
 * Returns empty array if database is unavailable.
 */
async function getProperties(): Promise<PropertyWithCalculations[]> {
  try {
    // Use Supabase client instead of Prisma to avoid pooler auth issues
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Supabase error:', error)
      return []
    }
    
    // Convert snake_case to camelCase and handle dates
    const converted = (data || []).map((prop: any) => ({
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
      createdAt: new Date(prop.created_at),
      updatedAt: new Date(prop.updated_at),
    }))

    // Serialize Date objects to strings for client-side usage
    const serialized = serializeProperties(converted);
    
    // Add calculated fields using the shared utility
    // @ts-ignore - serializeProperties intentionally converts Date to string
    return serialized.map(addCalculations);
  } catch (error) {
    console.error('Database connection error:', error);
    // Return empty array if database is unavailable
    // The client will fetch from API if needed
    return [];
  }
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
