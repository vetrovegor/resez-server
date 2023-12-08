import { QA } from "../db/models.js";

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
}

export default new QAService();
