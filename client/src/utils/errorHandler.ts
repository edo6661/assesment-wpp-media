import { isAxiosError } from "axios";
import type { ActionResult } from "../types/common";

export const handleApiError = (error: unknown): ActionResult => {
  if (import.meta.env.DEV) {
    console.error("API Request failed:", error);
  }
  if (isAxiosError(error)) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "A server error occurred. Please try again.",
      errors: error.response?.data?.error,
    };
  }

  return {
    success: false,
    message:
      error instanceof Error ? error.message : "An unexpected error occurred.",
  };
};
