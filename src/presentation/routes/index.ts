import { Router } from "express";
import { container } from "../../infrastructure/di/container.js";

export const createMainRouter = (deps: typeof container): Router => {
  const router = Router();

  return router;
};

const router = createMainRouter(container);
export default router;
