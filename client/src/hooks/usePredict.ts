import { useMutation } from "@tanstack/react-query";
import api from "../lib/axios";
import type { ApiResponse } from "../types/api_response";
import type { PredictResponse } from "../types/predict";
import { handleApiError } from "../utils/errorHandler";

export const usePredict = () => {
  return useMutation({
    mutationFn: async (text: string) => {
      try {
        const { data } = await api.post<ApiResponse<PredictResponse>>(
          "/predict",
          { text },
        );
        return data.data;
      } catch (error) {
        const parsedError = handleApiError(error);
        throw new Error(parsedError.message);
      }
    },
  });
};
