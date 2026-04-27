import { prisma } from "../database/prisma.js";
import type { PrismaClient } from "@prisma/client/extension";
import { GeminiProvider } from "../external/GeminiProvider.js";
import { DataRepository } from "../database/repositories/DataRepository.js";
import { PredictUseCase } from "../../application/usecases/PredictUseCase.js";
import { PredictController } from "../../presentation/controllers/PredictController.js";

export const createContainer = (dbClient: PrismaClient) => {
  const aiProvider = new GeminiProvider();
  const dataRepository = new DataRepository(dbClient);

  const predictUseCase = new PredictUseCase(aiProvider, dataRepository);

  const predictController = new PredictController(predictUseCase);

  return {
    db: dbClient,
    aiProvider,
    predictController,
  };
};

export const container = createContainer(prisma);
