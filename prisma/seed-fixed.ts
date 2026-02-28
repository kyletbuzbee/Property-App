import { createClient } from "@supabase/supabase-js";

// Use the same credentials from .env
const supabaseUrl = "https://uoulozqwxsfmsbesjmke.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvdWxvenF3eHNmbXNiZXNqbWtlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzODU1MjEsImV4cCI6MjA4Njk2MTUyMX0.-KbxE3x0PsDI22q1CDXDRsagwW22m-p16mhS2PUQHQg";

const supabase = createClient(supabaseUrl, supabaseKey);

const seedProperties = [
  {
    address: "309 E Brandon St",
    city: "Overton",
    state: "TX",
    zip: "75684",
    lat: 32.2757,
    lng: -94.9427,
    list_price: 149900,
    equity_gap: 25000,
    sqft: 1700,
    bedrooms: 3,
    bathrooms: 3,
    decision: "Pass Platinum",
    strategy: "Section 8",
    rationale: "Multi-family potential in rental desert; high yield",
    type: "Multi-family home for sale",
    estimated_rent: 1400,
    annual_taxes: 3500,
    annual_insurance: 1200,
    renovation_budget: 15000,
    after_repair_value: 195000,
  },
  {
    address: "2319 Luther St",
    city: "Tyler",
    state: "TX",
    zip: "75701",
    lat: 32.3513,
    lng: -95.3011,
    list_price: 99999,
    equity_gap: 125001,
    sqft: 1909,
    bedrooms: 4,
    bathrooms: 2,
    decision: "Pass Platinum",
    strategy: "Retail Flip",
    rationale: "Massive equity gap; tax value $225k vs $100k list",
    type: "House for sale",
    estimated_rent: 1800,
    annual_taxes: 4200,
    annual_insurance: 1500,
    renovation_budget: 35000,
    after_repair_value: 225000,
  },
  {
    address: "1525 Stone Creek Blvd",
    city: "Longview",
    state: "TX",
    zip: "75601",
    lat: 32.5007,
    lng: -94.7405,
    list_price: 185000,
    equity_gap: 45000,
    sqft: 2200,
    bedrooms: 4,
    bathrooms: 2.5,
    decision: "Pass Gold",
    strategy: "BRRR",
    rationale: "Strong rental market; good cash flow potential",
    type: "House for sale",
    estimated_rent: 1650,
    annual_taxes: 4800,
    annual_insurance: 1800,
    renovation_budget: 25000,
    after_repair_value: 230000,
  },
  {
    address: "8902 Sunnyvale Dr",
    city: "Tyler",
    state: "TX",
    zip: "75703",
    lat: 32.3513,
    lng: -95.3011,
    list_price: 215000,
    equity_gap: 35000,
    sqft: 1950,
    bedrooms: 3,
    bathrooms: 2,
    decision: "Pass Gold",
    strategy: "Owner Finance",
    rationale: "Owner financing available; great location near schools",
    type: "House for sale",
    estimated_rent: 1750,
    annual_taxes: 5200,
    annual_insurance: 1600,
    renovation_budget: 18000,
    after_repair_value: 250000,
  },
  {
    address: "456 Oak Street",
    city: "Marshall",
    state: "TX",
    zip: "75670",
    lat: 32.5449,
    lng: -94.3674,
    list_price: 89500,
    equity_gap: 30000,
    sqft: 1450,
    bedrooms: 3,
    bathrooms: 2,
    decision: "Pass Gold",
    strategy: "Wholesaling",
    rationale: "Below market value; motivated seller",
    type: "House for sale",
    estimated_rent: 950,
    annual_taxes: 2200,
    annual_insurance: 900,
    renovation_budget: 12000,
    after_repair_value: 120000,
  },
];

async function main() {
  console.log("🌱 Starting database seed...");

  // Delete all existing properties
  const { error: deleteError } = await supabase
    .from("properties")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all - using invalid UUID as workaround

  if (deleteError) {
    console.log(
      "Note: Could not clear properties (may be empty):",
      deleteError.message,
    );
  } else {
    console.log("✓ Cleared existing properties");
  }

  // Insert seed properties
  const { data, error } = await supabase
    .from("properties")
    .upsert(seedProperties, { onConflict: "address" })
    .select();

  if (error) {
    console.error("❌ Error seeding properties:", error);
    process.exit(1);
  }

  console.log(`✅ Successfully seeded ${seedProperties.length} properties!`);
  console.log("\nProperties:");
  seedProperties.forEach((p) => {
    console.log(
      `  - ${p.address}, ${p.city} - $${p.list_price.toLocaleString()}`,
    );
  });
}

main()
  .then(() => {
    console.log("\n✨ Seed complete!");
    process.exit(0);
  })
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  });
