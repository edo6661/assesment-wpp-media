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

  private modelName = "gemini-2.5-flash";
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
              "Classify the user intent into one of the following: product_search, audience_search, campaign_search, performance_query, or unknown.",
          },
          entities: {
            type: SchemaType.OBJECT,
            properties: {
              category: {
                type: SchemaType.STRING,
                description: "Product category, e.g., skincare, laptop, shoes.",
              },
              target: {
                type: SchemaType.STRING,
                description: "Target audience, e.g., gen z, teens, adults.",
              },
              price_max: {
                type: SchemaType.NUMBER,
                description: "Maximum price mentioned as a number.",
              },
              brand: {
                type: SchemaType.STRING,
                description: "Specific brand mentioned.",
              },
              budget_max: {
                type: SchemaType.NUMBER,
                description: "Maximum budget for the campaign as a number.",
              },
              campaign_name: {
                type: SchemaType.STRING,
                description: "Specific name of the queried campaign.",
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

      const systemInstruction = `You are an AI information extraction system. 
      Your task is to convert natural language input from the user into a structured JSON format. 
      Do not make assumptions; if an entity is not explicitly mentioned, leave it empty.`;

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        systemInstruction: {
          role: "system",
          parts: [{ text: systemInstruction }],
        },
      });

      const textResponse = result.response.text();

      const cleanedText = textResponse
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      const parsedJson = JSON.parse(cleanedText);
      const validatedData = predictionSchema.parse(parsedJson);
      return validatedData;
    } catch (e) {
      console.error(e);
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Failed to extract information. Please ensure your prompt is clear and relevant.",
      );
    }
  }
}
