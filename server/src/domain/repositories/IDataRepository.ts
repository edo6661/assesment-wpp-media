import type { PredictionResult } from "../dtos/PredictionDTO.js";
import type { Product, Audience, Campaign, Performance } from "@prisma/client";

export type QueryDataResult =
  | Product[]
  | Audience[]
  | Campaign[]
  | Performance[];

export interface IDataRepository {
  fetchDataByIntentAndEntities(
    prediction: PredictionResult,
  ): Promise<QueryDataResult>;
}
