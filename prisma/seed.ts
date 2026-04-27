import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.performance.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.product.deleteMany();
  await prisma.audience.deleteMany();

  await prisma.product.createMany({
    data: [
      {
        name: "Glow Up Serum",
        category: "skincare",
        price: 85000,
        brand: "SkinJoy",
      },
      {
        name: "Acne Clear Toner",
        category: "skincare",
        price: 120000,
        brand: "DermaCare",
      },
      {
        name: "Pro Gaming Mouse",
        category: "electronics",
        price: 450000,
        brand: "TechGear",
      },
    ],
  });

  await prisma.audience.createMany({
    data: [
      {
        name: "Gen Z Skincare Enthusiasts",
        age_range: "gen z",
        preferences: "cruelty-free, vegan, affordable",
      },
      {
        name: "Millennial Gamers",
        age_range: "millennial",
        preferences: "performance, rgb, ergonomic",
      },
    ],
  });
  console.log("Finished seed.");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
