import { z } from "zod";

export const predictionSchema = z.object({
  intent: z.enum([
    "product_search",
    "audience_search",
    "campaign_search",
    "performance_query",
    "unknown",
  ]),
  entities: z.object({
    category: z.string().optional(),
    target: z.string().optional(),
    price_max: z.number().optional(),
    brand: z.string().optional(),
    budget_max: z.number().optional(),
  }),
});

export type PredictionResult = z.infer<typeof predictionSchema>;
