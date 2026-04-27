import { describe, it, expect, vi, beforeEach } from "vitest";
import { mock } from "vitest-mock-extended";
import { PredictUseCase } from "../../../application/usecases/PredictUseCase";
import type { IAiProvider } from "../../../domain/external/IAiProvider";
import type { IDataRepository } from "../../../domain/repositories/IDataRepository";
import { Decimal } from "@prisma/client/runtime/library";

describe("PredictUseCase", () => {
  let predictUseCase: PredictUseCase;
  let mockAiProvider: IAiProvider;
  let mockDataRepository: IDataRepository;

  beforeEach(() => {
    mockAiProvider = mock<IAiProvider>();
    mockDataRepository = mock<IDataRepository>();
    predictUseCase = new PredictUseCase(mockAiProvider, mockDataRepository);
  });

  it("should return structured output and retrieved data successfully", async () => {
    const inputText = "show me skincare products under 100k";
    const mockPrediction = {
      intent: "product_search" as const,
      entities: {
        category: "skincare",
        price_max: 100000,
      },
    };
    const mockData = [
      {
        id: "1",
        name: "Glow Up Serum",
        category: "skincare",
        price: new Decimal(85000),
        brand: "SkinJoy",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    vi.mocked(mockAiProvider.extractIntentAndEntities).mockResolvedValue(
      mockPrediction,
    );
    vi.mocked(
      mockDataRepository.fetchDataByIntentAndEntities,
    ).mockResolvedValue(mockData);

    const result = await predictUseCase.execute(inputText, 10);

    expect(mockAiProvider.extractIntentAndEntities).toHaveBeenCalledWith(
      inputText,
    );
    expect(
      mockDataRepository.fetchDataByIntentAndEntities,
    ).toHaveBeenCalledWith(mockPrediction, 10);
    expect(result).toEqual({
      structured_output: mockPrediction,
      retrieved_data: mockData,
    });
  });

  it("should throw an error if AI Provider fails", async () => {
    const inputText = "invalid text";
    const errorMessage = "Failed to extract information";
    vi.mocked(mockAiProvider.extractIntentAndEntities).mockRejectedValue(
      new Error(errorMessage),
    );

    await expect(predictUseCase.execute(inputText)).rejects.toThrow(
      errorMessage,
    );
    expect(
      mockDataRepository.fetchDataByIntentAndEntities,
    ).not.toHaveBeenCalled();
  });
});
