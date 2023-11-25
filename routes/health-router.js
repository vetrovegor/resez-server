import { Router } from "express";

import healthController from "../controllers/health-controller.js";

export const healthRouter = new Router();

healthRouter.get(
    '/health',
    healthController.checkHealth
);