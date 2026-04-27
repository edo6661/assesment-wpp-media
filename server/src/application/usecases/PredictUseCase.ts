import type { IAiProvider } from "../../domain/external/IAiProvider.js";
import type { IDataRepository } from "../../domain/repositories/IDataRepository.js";

export class PredictUseCase {
  constructor(
    private aiProvider: IAiProvider,
    private dataRepository: IDataRepository,
  ) {}

  async execute(text: string, limit = 10) {
    const prediction = await this.aiProvider.extractIntentAndEntities(text);

    const data = await this.dataRepository.fetchDataByIntentAndEntities(
      prediction,
      limit,
    );

    return {
      structured_output: prediction,
      retrieved_data: data,
    };
  }
}
