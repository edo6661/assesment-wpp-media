import { PrismaClient } from "@prisma/client";
import * as fs from "fs";

const prisma = new PrismaClient();

async function main() {
  console.log("Migrasi selesai!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
