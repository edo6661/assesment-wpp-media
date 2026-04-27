import { Router } from "express";
import { container } from "../../infrastructure/di/container.js";
import { validate } from "../../middlewares/validate.js";
import { predictRequestSchema } from "../../domain/dtos/PredictRequestDTO.js";

export const createMainRouter = (deps: typeof container): Router => {
  const router = Router();

  router.post(
    "/predict",
    validate(predictRequestSchema),
    deps.predictController.predict,
  );

  return router;
};

const router = createMainRouter(container);
export default router;
