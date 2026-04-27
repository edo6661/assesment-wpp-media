import type { Request, Response, NextFunction } from "express";
import type { PredictUseCase } from "../../application/usecases/PredictUseCase.js";
import { sendResponse } from "../../utils/response.js";
import { StatusCodes } from "http-status-codes";

export class PredictController {
  constructor(private predictUseCase: PredictUseCase) {}

  predict = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { text } = req.body;
      const result = await this.predictUseCase.execute(text);

      sendResponse(
        res,
        StatusCodes.OK,
        "Prediction and data retrieval successful",
        result,
      );
    } catch (error) {
      next(error);
    }
  };
}
