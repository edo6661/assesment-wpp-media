import { prisma } from "../database/prisma.js";
import type { PrismaClient } from "@prisma/client/extension";

export const createContainer = (dbClient: PrismaClient) => {};

export const container = createContainer(prisma);
