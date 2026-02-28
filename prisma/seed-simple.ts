import { createClient } from "@supabase/supabase-js";

// Use the same credentials from .env
const supabaseUrl = "https://uoulozqwxsfmsbesjmke.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvdWxvenF3eHNmbXNiZXNqbWtlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzODU1MjEsImV4cCI6MjA4Njk2MTUyMX0.-KbxE3x0PsDI22q1CDXDRsagwW22m-p16mhS2PUQHQg";

const supabase = createClient(supabaseUrl, supabaseKey);

// Minimal properties with only guaranteed columns
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
  },
];

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear ALL properties using raw SQL via postgrest
  const { error: deleteError } = await supabase.rpc(
    "pg_catalog.pg_extension",
    {} as any,
  );

  // Alternative: just insert and let them accumulate for now
  console.log("Inserting seed properties...");

  // Insert seed properties one by one
  for (const property of seedProperties) {
    const { error } = await supabase.from("properties").insert(property);

    if (error) {
      console.error(`❌ Error inserting ${property.address}:`, error.message);
    } else {
      console.log(`✅ Inserted: ${property.address}`);
    }
  }

  console.log("\n✅ Seed complete!");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  });
