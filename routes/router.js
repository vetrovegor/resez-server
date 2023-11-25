import { Router } from "express";

import { healthRouter } from "./health-router.js";
import { authRouter } from "./auth-router.js";

export const router = new Router();

router.use('/health', healthRouter);

router.use('/auth', authRouter);