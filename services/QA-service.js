import { QA } from "../db/models.js";
import { QADto } from "../dto/collection/QA-dto.js";

class QAService {
    async createQAFromPairs(QAPairs, collectionId) {
        return await Promise.all(
            QAPairs.map(async (QAItem) => {
                const { question, answer } = QAItem;

                await QA.create({
                    collectionId,
                    question,
                    answer,
                });
            })
        );
    }

    async getCollectionPairsCount(collectionId) {
        return await QA.count({ where: { collectionId } });
    }

    async getQAPairsByCollectionId(collectionId) {
        const QAItems = await QA.findAll({
            where: { collectionId },
        });

        return QAItems.map((QAItem) => new QADto(QAItem));
    }
}

export default new QAService();
