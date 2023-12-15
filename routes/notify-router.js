import { Router } from "express";

import { accessTokenMiddleware } from "../middlewares/access-token-middleware.js";
import { blockedMiddleware } from "../middlewares/blocked-middleware.js";
import { paginationMiddleware } from "../middlewares/pagination-middleware.js";
import notifyController from "../controllers/notify-controller.js";
import { limiter } from "../middlewares/limiter-middleware.js";

export const notifyRouter = new Router();

notifyRouter.get('/',
    limiter,
    paginationMiddleware,
    accessTokenMiddleware,
    blockedMiddleware,
    notifyController.getNotifies);

notifyRouter.put('/read',
    accessTokenMiddleware,
    blockedMiddleware,
    notifyController.readNotify);

notifyRouter.put('/read-all',
    paginationMiddleware,
    accessTokenMiddleware,
    blockedMiddleware,
    notifyController.readAllNotifies);