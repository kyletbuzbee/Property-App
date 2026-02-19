const seedProperties = [
  {
    address: '309 E Brandon St',
    city: 'Overton',
    state: 'TX',
    zip: '75684',
    lat: 32.2757,
    lng: -94.9427,
    listPrice: 149900,
    equityGap: 25000,
    sqft: 1700,
    bedrooms: 3,
    bathrooms: 3,
    decision: 'Pass Platinum',
    strategy: 'Section 8',
    rationale: 'Multi-family potential in rental desert; high yield',
    type: 'Multi-family home for sale',
    realtor: null,
    url: null,
    details: null,
    images: [],
    estimatedRent: 0,
    annualTaxes: 0,
    annualInsurance: 0,
    renovationBudget: 0,
    afterRepairValue: 0,
    notes: '',
  },
  {
    address: '2319 Luther St',
    city: 'Tyler',
    state: 'TX',
    zip: '75701',
    lat: 32.3513,
    lng: -95.3011,
    listPrice: 99999,
    equityGap: 125001,
    sqft: 1909,
    bedrooms: 4,
    bathrooms: 2,
    decision: 'Pass Platinum',
    strategy: 'Retail Flip',
    rationale: 'Massive equity gap; tax value $225k vs $100k list',
    type: 'House for sale',
    realtor: null,
    url: null,
    details: null,
    images: [],
    estimatedRent: 0,
    annualTaxes: 0,
    annualInsurance: 0,
    renovationBudget: 0,
    afterRepairValue: 0,
    notes: '',
  },
];

import { supabase } from '../../app/lib/db';

async function main() {
  console.log('Starting seed...');

  // Clear existing properties
  const { error: deleteError } = await supabase
    .from('properties')
    .delete()
    .match({ id: { '!=': null } })

  if (deleteError) {
    console.error('Error clearing properties:', deleteError)
    return
  }
  console.log('Cleared existing properties');

  // Insert properties from the data file
  for (const property of seedProperties) {
    const { error: insertError } = await supabase
      .from('properties')
      .insert(property)

    if (insertError) {
      console.error('Error inserting property:', insertError)
      return
    }
  }

  console.log(`Seeded ${seedProperties.length} properties`);
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await supabase.$disconnect();
  });
