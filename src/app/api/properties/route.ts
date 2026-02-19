import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/db';
import { prisma } from '@/app/lib/db';
import { 
  addCalculations, 
  serializeProperty,
  PropertyBase,
  PropertyWithCalculations 
} from '@/lib/calculations';

// Helper to generate slug from name
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 50)
}

/**
 * GET /api/properties
 * Fetch properties with optional filtering.
 * Returns properties with calculated fields.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const search = searchParams.get('search');
    const strategy = searchParams.get('strategy');
    const decision = searchParams.get('decision');
    const city = searchParams.get('city');

    // 1. Handle Single Property Fetch
    if (id) {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error || !data) {
        return NextResponse.json(
          { success: false, error: 'Property not found' }, 
          { status: 404 }
        );
      }
      
      // Convert, serialize and add calculations
      const converted = convertSupabaseProperty(data)
      const serialized = serializeProperty(converted);
      // @ts-ignore - serializeProperty intentionally converts Date to string
      const calculated = addCalculations(serialized);
      return NextResponse.json({ success: true, data: calculated });
    }

    // 2. Build query with filters
    let query = supabase.from('properties').select('*')
    
    if (strategy) query = query.eq('strategy', strategy)
    if (decision) query = query.eq('decision', decision)
    if (city) query = query.ilike('city', city)
    
    if (search) {
      query = query.or(`address.ilike.%${search}%,city.ilike.%${search}%,rationale.ilike.%${search}%,details.ilike.%${search}%`)
    }
    
    query = query.order('created_at', { ascending: false })

    // 3. Execute query
    const { data, error } = await query
    
    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch properties' }, 
        { status: 500 }
      );
    }

    // 4. Convert, serialize and add calculations
    const converted = (data || []).map(convertSupabaseProperty)
    const serialized = converted.map(serializeProperty) as PropertyBase[];
    const calculated = serialized.map(addCalculations);

    return NextResponse.json({ 
      success: true, 
      data: calculated, 
      count: calculated.length 
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch properties' }, 
      { status: 500 }
    );
  }
}

// Helper to convert Supabase snake_case to camelCase
function convertSupabaseProperty(prop: any): any {
  return {
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
  }
}

/**
 * POST /api/properties
 * Create a new property.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, createdAt, updatedAt, ...data } = body;

    // Convert camelCase to snake_case for Supabase
    const insertData = {
      address: data.address,
      city: data.city,
      state: data.state || 'TX',
      zip: data.zip || '',
      lat: data.lat || 0,
      lng: data.lng || 0,
      list_price: Number(data.listPrice) || 0,
      equity_gap: data.equityGap || 0,
      sqft: Number(data.sqft) || 0,
      bedrooms: data.bedrooms || 0,
      bathrooms: data.bathrooms || 0,
      decision: data.decision || 'Review',
      strategy: data.strategy || 'None',
      rationale: data.rationale || '',
      type: data.type || 'House for sale',
      realtor: data.realtor || null,
      url: data.url || null,
      details: data.details || null,
      images: data.images || [],
      estimatedRent: Number(data.estimatedRent) || 0,
      annualTaxes: data.annualTaxes || 0,
      annualInsurance: data.annualInsurance || 0,
      renovationBudget: data.renovationBudget || 0,
      afterRepairValue: data.afterRepairValue || 0,
      notes: data.notes || '',
      is_owned: data.isOwned || false,
      purchase_price: data.purchasePrice || 0,
      purchase_date: data.purchaseDate || null,
      rehab_completed: data.rehabCompleted || null,
      is_favorite: data.isFavorite || false,
      favorite_notes: data.favoriteNotes || '',
      deal_score: data.dealScore || 0,
      risk_level: data.riskLevel || 'Medium',
    }

    const { data: newProperty, error } = await supabase
      .from('properties')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to create property' }, 
        { status: 500 }
      );
    }

    // Convert, serialize and add calculations
    const converted = convertSupabaseProperty(newProperty)
    const serialized = serializeProperty(converted);
    // @ts-ignore - serializeProperty intentionally converts Date to string
    const calculated = addCalculations(serialized);

    return NextResponse.json({ success: true, data: calculated }, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create property' }, 
      { status: 500 }
    );
  }
}

/**
 * PUT /api/properties
 * Update an existing property.
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, createdAt, updatedAt, ...data } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Property ID is required' }, 
        { status: 400 }
      );
    }

    // Convert camelCase to snake_case for fields that need it
    const updateData: any = {}
    
    if (data.listPrice !== undefined) updateData.list_price = Number(data.listPrice)
    if (data.equityGap !== undefined) updateData.equity_gap = data.equityGap
    if (data.isOwned !== undefined) updateData.is_owned = data.isOwned
    if (data.purchasePrice !== undefined) updateData.purchase_price = data.purchasePrice
    if (data.purchaseDate !== undefined) updateData.purchase_date = data.purchaseDate
    if (data.rehabCompleted !== undefined) updateData.rehab_completed = data.rehabCompleted
    if (data.isFavorite !== undefined) updateData.is_favorite = data.isFavorite
    if (data.favoriteNotes !== undefined) updateData.favorite_notes = data.favoriteNotes
    if (data.dealScore !== undefined) updateData.deal_score = data.dealScore
    if (data.riskLevel !== undefined) updateData.risk_level = data.riskLevel
    
    // Copy over fields that don't need conversion
    const directFields = ['address', 'city', 'state', 'zip', 'lat', 'lng', 'sqft', 
      'bedrooms', 'bathrooms', 'decision', 'strategy', 'rationale', 'type', 
      'realtor', 'url', 'details', 'images', 'estimatedRent', 'annualTaxes', 
      'annualInsurance', 'renovationBudget', 'afterRepairValue', 'notes']
    
    directFields.forEach(field => {
      if (data[field] !== undefined) updateData[field] = data[field]
    })

    const { data: updatedProperty, error } = await supabase
      .from('properties')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Supabase update error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to update property' }, 
        { status: 500 }
      );
    }

    // Convert, serialize and add calculations
    const converted = convertSupabaseProperty(updatedProperty)
    const serialized = serializeProperty(converted);
    // @ts-ignore - serializeProperty intentionally converts Date to string
    const calculated = addCalculations(serialized);

    return NextResponse.json({ success: true, data: calculated });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update property' }, 
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/properties
 * Delete a property by ID.
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Property ID is required' }, 
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Supabase delete error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to delete property' }, 
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Property deleted successfully' });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete property' }, 
      { status: 500 }
    );
  }
}
