import type { PrismaClient, Prisma } from "@prisma/client";
import type {
  IDataRepository,
  QueryDataResult,
} from "../../../domain/repositories/IDataRepository.js";
import type { PredictionResult } from "../../../domain/dtos/PredictionDTO.js";

export class DataRepository implements IDataRepository {
  constructor(private prisma: PrismaClient) {}

  async fetchDataByIntentAndEntities(
    prediction: PredictionResult,
  ): Promise<QueryDataResult> {
    const { intent, entities } = prediction;

    switch (intent) {
      case "product_search": {
        const where: Prisma.ProductWhereInput = {};
        if (entities.category) {
          where.category = { contains: entities.category };
        }
        if (entities.brand) {
          where.brand = { contains: entities.brand };
        }
        if (entities.price_max) {
          where.price = { lte: entities.price_max };
        }
        return await this.prisma.product.findMany({
          where,
          take: 10,
        });
      }

      case "audience_search": {
        const where: Prisma.AudienceWhereInput = {};
        if (entities.target) {
          where.age_range = { contains: entities.target };
        }
        return await this.prisma.audience.findMany({ where, take: 10 });
      }

      case "campaign_search": {
        const where: Prisma.CampaignWhereInput = {};
        if (entities.budget_max) {
          where.budget = { lte: entities.budget_max };
        }

        return await this.prisma.campaign.findMany({
          where,
          include: {
            product: true,
            audience: true,
          },
          take: 10,
        });
      }

      case "performance_query": {
        return await this.prisma.performance.findMany({
          include: {
            campaign: {
              include: {
                product: true,
              },
            },
          },
          take: 10,
        });
      }

      default:
        return [];
    }
  }
}
