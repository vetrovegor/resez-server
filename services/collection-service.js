import { Collection } from "../db/models.js";
import QAService from "./QA-service.js";
import userService from "./user-service.js";
import { CollectionShortInfo } from "../dto/collection/collection-short-info.js";
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
}

export default new CollectionService();
