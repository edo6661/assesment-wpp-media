import type { PredictionResult } from "../dtos/PredictionDTO.js";

export interface IAiProvider {
  extractIntentAndEntities(prompt: string): Promise<PredictionResult>;
}
