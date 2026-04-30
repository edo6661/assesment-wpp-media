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
      {
        name: "Mechanical Keyboard X1",
        category: "electronics",
        price: 1250000,
        brand: "TechGear",
      },
      {
        name: "Whey Protein Isolate 1kg",
        category: "health",
        price: 850000,
        brand: "MusclePro",
      },
      {
        name: "Pre-Workout Formula",
        category: "health",
        price: 350000,
        brand: "MusclePro",
      },
      {
        name: "Cold Brew Arabica Beans 250g",
        category: "food & beverage",
        price: 95000,
        brand: "RoastDaily",
      },
      {
        name: "Manual Coffee Grinder",
        category: "equipment",
        price: 250000,
        brand: "BrewMaster",
      },
      {
        name: "Running Shoes Ultra",
        category: "apparel",
        price: 1500000,
        brand: "AeroStep",
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
      {
        name: "Fitness & Bodybuilding Community",
        age_range: "adults",
        preferences: "high-protein, muscle gain, gym lifestyle",
      },
      {
        name: "Home Brewing Enthusiasts",
        age_range: "millennial",
        preferences: "specialty coffee, manual brew, aesthetics",
      },
      {
        name: "Active Marathon Runners",
        age_range: "all ages",
        preferences: "endurance, lightweight, comfort",
      },
    ],
  });

  const products = await prisma.product.findMany();
  const audiences = await prisma.audience.findMany();

  if (products.length > 0 && audiences.length > 0) {
    const getProductId = (name: string) =>
      products.find((p) => p.name === name)?.id || products[0].id;
    const getAudienceId = (name: string) =>
      audiences.find((a) => a.name === name)?.id || audiences[0].id;

    await prisma.campaign.create({
      data: {
        name: "Gen Z Glowing Campaign",
        budget: 5000000,
        product_id: getProductId("Glow Up Serum"),
        audience_id: getAudienceId("Gen Z Skincare Enthusiasts"),
        performance: {
          create: { impressions: 15000, clicks: 1200, conversions: 85 },
        },
      },
    });

    await prisma.campaign.create({
      data: {
        name: "Pro Gamer Gear Push",
        budget: 15000000,
        product_id: getProductId("Pro Gaming Mouse"),
        audience_id: getAudienceId("Millennial Gamers"),
        performance: {
          create: { impressions: 45000, clicks: 3400, conversions: 210 },
        },
      },
    });

    await prisma.campaign.create({
      data: {
        name: "Summer Muscle Gain",
        budget: 8000000,
        product_id: getProductId("Whey Protein Isolate 1kg"),
        audience_id: getAudienceId("Fitness & Bodybuilding Community"),
        performance: {
          create: { impressions: 32000, clicks: 2100, conversions: 150 },
        },
      },
    });

    await prisma.campaign.create({
      data: {
        name: "Morning Cold Brew Promo",
        budget: 3500000,
        product_id: getProductId("Cold Brew Arabica Beans 250g"),
        audience_id: getAudienceId("Home Brewing Enthusiasts"),
        performance: {
          create: { impressions: 12000, clicks: 800, conversions: 65 },
        },
      },
    });
  }

  console.log("✅ Finished seeding database with expanded data.");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding data:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
