import { Op } from "sequelize";

import { Collection } from "../db/models.js";
import { ApiError } from "../errors/api-error.js";
import QAService from "./QA-service.js";
import userService from "./user-service.js";
import { CollectionShortInfo } from "../dto/collection/collection-short-info.js";
import { CollectionFullInfo } from "../dto/collection/collection-full-info.js";
import { PaginationDto } from "../dto/pagination-dto.js";

class CollectionService {
    async createCollectionDto(collection, pairsCount) {
        if (!pairsCount) {
            pairsCount = await QAService.getCollectionPairsCount(collection.id);
        }

        const user = await userService.getUserById(collection.userId);

        return new CollectionShortInfo(collection, pairsCount, user);
    }

    async createCollection(
        userId,
        collection,
        description,
        isPrivate,
        QAPairs
    ) {
        const createdCollection = await Collection.create({
            userId,
            collection,
            description,
            isPrivate,
            date: Date.now(),
        });

        const { id: collectionId } = createdCollection;

        await QAService.createQAFromPairs(QAPairs, collectionId);

        return await this.createCollectionDto(
            createdCollection,
            QAPairs.length
        );
    }

    async getUserCollections(userId, limit, offset) {
        const collections = await Collection.findAll({
            where: { userId },
            order: [["date", "DESC"]],
            limit,
            offset,
        });

        const collectionDtos = await Promise.all(
            collections.map(
                async (collection) => await this.createCollectionDto(collection)
            )
        );

        const totalCount = await Collection.count({
            where: { userId },
        });

        return new PaginationDto(
            "collections",
            collectionDtos,
            totalCount,
            limit,
            offset
        );
    }

    async getCollectionById(collectionId, userId) {
        const existedCollection = await Collection.findOne({
            where: {
                id: collectionId,
                [Op.or]: [{ isPrivate: false }, { userId: userId }],
            },
        });

        if (!existedCollection) {
            throw ApiError.notFound("Коллекция не найдена");
        }

        const QAPairs = await QAService.getQAPairsByCollectionId(collectionId);

        const user = await userService.getUserById(existedCollection.userId);

        return new CollectionFullInfo(existedCollection, user, QAPairs);
    }

    async findUserCollection(collectionId, userId) {
        return await Collection.findOne({
            where: {
                id: collectionId,
                userId,
            },
        });
    }

    async deleteCollection(collectionId, userId) {
        const collection = await this.findUserCollection(collectionId, userId);

        if (!collection) {
            throw ApiError.notFound("Коллекция не найдена");
        }

        const pairsCount = await QAService.getCollectionPairsCount(
            collectionId
        );

        await collection.destroy();

        return await this.createCollectionDto(collection, pairsCount);
    }
}

export default new CollectionService();
