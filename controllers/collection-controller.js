import { validationResult } from "express-validator";

import { ApiError } from "../errors/api-error.js";
import collectionService from "../services/collection-service.js";

class CollectionController {
    async createCollection(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(
                    ApiError.badRequest("Ошибка валидации", errors.array())
                );
            }

            const { id: userId } = req.user;
            const { collection, description, isPrivate, QAPairs } = req.body;

            const createdCollection = await collectionService.createCollection(
                userId,
                collection,
                description,
                isPrivate,
                QAPairs
            );

            res.json({ collection: createdCollection });
        } catch (e) {
            next(e);
        }
    }

    async getUserCollections(req, res, next) {
        try {
            const { id: userId } = req.user;
            const { limit, offset } = req.query;

            const response = await collectionService.getUserCollections(
                userId,
                limit,
                offset
            );

            res.json(response);
        } catch (e) {
            next(e);
        }
    }

    async getCollectionById(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(
                    ApiError.badRequest("Ошибка валидации", errors.array())
                );
            }

            const { id: collectionId } = req.params;
            const { id: userId } = req.user;

            const collection = await collectionService.getCollectionById(
                collectionId,
                userId
            );

            res.json({ collection });
        } catch (e) {
            next(e);
        }
    }

    async deleteCollection(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(
                    ApiError.badRequest("Ошибка валидации", errors.array())
                );
            }

            const { id: userId } = req.user;
            const { id: collectionId } = req.params;

            const deletedCollection = await collectionService.deleteCollection(
                collectionId,
                userId
            );

            res.json({ collection: deletedCollection });
        } catch (e) {
            next(e);
        }
    }

    async updateCollectionById(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(
                    ApiError.badRequest("Ошибка валидации", errors.array())
                );
            }

            const {
                id: collectionId,
                collection,
                description,
                isPrivate,
                QAPairs,
            } = req.body;
            const { id: userId } = req.user;

            const updatedCollection =
                await collectionService.updateCollectionById(
                    collectionId,
                    userId,
                    collection,
                    description,
                    isPrivate,
                    QAPairs
                );

            res.json({ collection: updatedCollection });
        } catch (e) {
            next(e);
        }
    }
}

export default new CollectionController();
