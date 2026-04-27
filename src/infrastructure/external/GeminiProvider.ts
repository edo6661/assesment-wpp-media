import {
  GoogleGenerativeAI,
  type Schema,
  SchemaType,
} from "@google/generative-ai";
import { env } from "../../config/env.js";
import type { IAiProvider } from "../../domain/external/IAiProvider.js";
import {
  predictionSchema,
  type PredictionResult,
} from "../../domain/dtos/PredictionDTO.js";
import { AppError } from "../../domain/errors/AppError.js";
import { StatusCodes } from "http-status-codes";

export class GeminiProvider implements IAiProvider {
  private genAI: GoogleGenerativeAI;

  private modelName = "gemini-3.1-flash";

  constructor() {
    this.genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  }

  async extractIntentAndEntities(prompt: string): Promise<PredictionResult> {
    try {
      const responseSchema: Schema = {
        type: SchemaType.OBJECT,
        properties: {
          intent: {
            type: SchemaType.STRING,
            description:
              "Klasifikasikan intent user ke salah satu dari: product_search, audience_search, campaign_search, performance_query, atau unknown.",
          },
          entities: {
            type: SchemaType.OBJECT,
            properties: {
              category: {
                type: SchemaType.STRING,
                description:
                  "Kategori produk, misal: skincare, laptop, sepatu.",
              },
              target: {
                type: SchemaType.STRING,
                description: "Target audiens, misal: gen z, remaja, dewasa.",
              },
              price_max: {
                type: SchemaType.NUMBER,
                description: "Harga maksimal yang disebutkan dalam angka.",
              },
              brand: {
                type: SchemaType.STRING,
                description: "Merek spesifik yang disebutkan.",
              },
              budget_max: {
                type: SchemaType.NUMBER,
                description: "Budget maksimal untuk campaign dalam angka.",
              },
            },
          },
        },
        required: ["intent", "entities"],
      };

      const model = this.genAI.getGenerativeModel({
        model: this.modelName,
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: responseSchema,
        },
      });

      const systemInstruction = `Kamu adalah sistem AI pengekstrak informasi. 
      Tugasmu adalah mengubah input natural language dari user menjadi format JSON yang terstruktur. 
      Jangan berasumsi, jika entitas tidak disebutkan, biarkan kosong.`;

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        systemInstruction: {
          role: "system",
          parts: [{ text: systemInstruction }],
        },
      });

      const textResponse = result.response.text();

      const parsedJson = JSON.parse(textResponse);

      const validatedData = predictionSchema.parse(parsedJson);

      return validatedData;
    } catch (error) {
      throw new AppError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Gagal mengekstrak informasi dari input. Pastikan input jelas.",
      );
    }
  }
}
