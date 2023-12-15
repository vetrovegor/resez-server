import { Router } from "express";

import { healthRouter } from "./health-router.js";
import { authRouter } from "./auth-router.js";
import { collectionRouter } from "./collection-router.js";
import { adminRouter } from "./admin-router.js";
import { notifyRouter } from "./notify-router.js";

export const router = new Router();

router.use("/health", healthRouter);

router.use("/auth", authRouter);

router.use("/collection", collectionRouter);

router.use('/admin', adminRouter);

router.use('/user', userRouter);

router.use('/notify', notifyRouter);