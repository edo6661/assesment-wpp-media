import type { PredictionResult } from "../dtos/PredictionDTO.js";
import type { Product, Audience } from "@prisma/client";

export type QueryDataResult = Product[] | Audience[];

export interface IDataRepository {
  fetchDataByIntentAndEntities(
    prediction: PredictionResult,
  ): Promise<QueryDataResult>;
}
