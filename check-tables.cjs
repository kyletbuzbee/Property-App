const {
  PrismaClient,
} = require("D:/Properties4Creation/Property App/src/generated/client");

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:Buzzbuzbee93!@db.uoulozqwxsfmsbesjmke.supabase.co:5432/postgres",
    },
  },
});

async function main() {
  const tables = await prisma.$queryRaw`
    SELECT table_name FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
  `;
  console.log("Tables in public schema:");
  tables.forEach((t) => console.log(" - " + t.table_name));
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
