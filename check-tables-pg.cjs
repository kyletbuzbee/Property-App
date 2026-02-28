const { Pool } = require("pg");

const pool = new Pool({
  connectionString:
    "postgresql://postgres.uoulozqwxsfmsbesjmke:Buzzbuzbee93!@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true",
});

async function main() {
  const result = await pool.query(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;",
  );
  console.log("Tables in public schema:");
  result.rows.forEach((t) => console.log(" - " + t.table_name));
  await pool.end();
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
