import { z } from "zod";

export const predictRequestSchema = {
  body: z.object({
    text: z
      .string({ error: "Text input is required" })
      .min(3, "Text is too short"),
    limit: z.number().min(1).max(100).optional(),
  }),
};
