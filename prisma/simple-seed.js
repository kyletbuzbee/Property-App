import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Clear existing properties
  await prisma.property.deleteMany({});
  console.log('Cleared existing properties');

  // Insert properties from the data file
  const properties = [
    {
      id: 'brrr-1',
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    // Add more properties here...
  ];

  for (const property of properties) {
    await prisma.property.create({
      data: property,
    });
  }

  console.log(`Seeded ${properties.length} properties`);
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });