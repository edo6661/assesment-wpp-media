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
  const products = await prisma.product.findMany();
  const audiences = await prisma.audience.findMany();

  if (products.length > 0 && audiences.length > 0) {
    await prisma.campaign.create({
      data: {
        name: "Gen Z Glowing Campaign",
        budget: 5000000,
        product_id: products[0].id,
        audience_id: audiences[0].id,
        performance: {
          create: {
            impressions: 15000,
            clicks: 1200,
            conversions: 85,
          },
        },
      },
    });

    await prisma.campaign.create({
      data: {
        name: "Pro Gamer Gear Push",
        budget: 15000000,
        product_id: products[2].id,
        audience_id: audiences[1].id,
        performance: {
          create: {
            impressions: 45000,
            clicks: 3400,
            conversions: 210,
          },
        },
      },
    });
  }

  console.log("Finished seed.");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding data:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
