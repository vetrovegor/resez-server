import { Router } from "express";
import { body, param } from "express-validator";

import { accessTokenMiddleware } from "../middlewares/access-token-middleware.js";
import { blockedMiddleware } from "../middlewares/blocked-middleware.js";
import { paginationMiddleware } from "../middlewares/pagination-middleware.js";
import collectionController from "../controllers/collection-controller.js";

export const collectionRouter = new Router();

collectionRouter.post(
    "/",
    body("collection").isString().isLength({ max: 75 }),
    body("description").isString().optional().isLength({ max: 500 }),
    body("isPrivate").isBoolean(),
    body("QAPairs").isArray({ min: 2 }),
    body("QAPairs.*.question").isString().isLength({ max: 250 }),
    body("QAPairs.*.answer").isString().isLength({ max: 250 }),
    accessTokenMiddleware,
    blockedMiddleware,
    collectionController.createCollection
);

collectionRouter.get(
    "/",
    paginationMiddleware,
    accessTokenMiddleware,
    blockedMiddleware,
    collectionController.getUserCollections
);

collectionRouter.get(
    "/:id",
    param("id").isNumeric(),
    accessTokenMiddleware,
    blockedMiddleware,
    collectionController.getCollectionById
);

collectionRouter.delete(
    "/:id",
    param("id").isNumeric(),
    accessTokenMiddleware,
    blockedMiddleware,
    collectionController.deleteCollection
);
