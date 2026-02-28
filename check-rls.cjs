const { Pool } = require("pg");

const pool = new Pool({
  connectionString:
    "postgresql://postgres.uoulozqwxsfmsbesjmke:Buzzbuzbee93!@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true",
});

async function main() {
  // Check RLS status on users table
  const rlsStatus = await pool.query(`
    SELECT relname, relrowsecurity 
    FROM pg_class 
    WHERE relname = 'users'
  `);
  console.log("RLS Status on users table:");
  rlsStatus.rows.forEach((t) =>
    console.log(
      " - " + t.relname + ": " + (t.relrowsecurity ? "ENABLED" : "DISABLED"),
    ),
  );

  // Check RLS policies on users table
  const policies = await pool.query(`
    SELECT polname, polpermissive, polroles, polcmd, polqual::text
    FROM pg_policy
    WHERE polrelid = 'users'::regclass
  `);
  console.log("\nRLS Policies on users table:");
  if (policies.rows.length === 0) {
    console.log(" - No policies defined");
  } else {
    policies.rows.forEach((p) =>
      console.log(" - " + p.polname + ": " + p.polcmd),
    );
  }

  // Try to select from users table with anon role
  console.log("\nTrying to SELECT from users table...");
  try {
    const users = await pool.query("SELECT id, email FROM users LIMIT 5");
    console.log("Success! Found " + users.rows.length + " users");
  } catch (e) {
    console.log("Error: " + e.message);
  }

  await pool.end();
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
