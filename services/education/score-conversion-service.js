import { ApiError } from "../../errors/api-error.js";
import { ScoreConversion } from "../../model/model.js";
import subjectService from "./subject-service.js";
import subjectTaskService from "./subject-task-service.js";

export class ScoreConversionService {
    async saveScoreConversion(subjectId, scoreConversion) {
        const existedSubject = await subjectService.getSubjectById(subjectId);

        if (!existedSubject) {
            subjectService.throwSubjectNotFoundError();
        }

        if (!existedSubject.isMark) {
            // случай, когда по предмету балловая система
            const subjectTotalPrimaryScore = await subjectTaskService
                .getTotalPrimaryScoreBySubjectId(subjectId);

            if (subjectTotalPrimaryScore != scoreConversion.length) {
                throw ApiError.badRequest('Некорректная сумма первичных баллов');
            }

            // добавить валидацию цвета ячейки
            let expectedPrimaryScore = 1;
            let previousSecondaryScore = null;

            scoreConversion.forEach(item => {
                let { primaryScore, secondaryScore } = item;

                if (primaryScore == undefined || secondaryScore == undefined) {
                    throw ApiError.badRequest('Ошибка валидации');
                }

                primaryScore = Number(primaryScore);
                secondaryScore = Number(secondaryScore);

                if (primaryScore != expectedPrimaryScore) {
                    throw ApiError.badRequest('Первичные баллы идут в неправильном порядке');
                }

                if (previousSecondaryScore && previousSecondaryScore > secondaryScore) {
                    throw ApiError.badRequest('Вторичные баллы идут в неправильном порядке');
                }

                expectedPrimaryScore++;
                previousSecondaryScore = secondaryScore;
            });

            if (previousSecondaryScore != 100) {
                throw ApiError.badRequest('Максимальный вторичный балл должен быть равен 100');
            }

            await this.deleteScoreConversionBySubjectId(subjectId);

            return await scoreConversion.forEach(
                async item => {
                    const { primaryScore, secondaryScore, isRed, isGreen } = item;

                    await ScoreConversion.create({
                        subjectId,
                        primaryScore,
                        secondaryScore,
                        isRed,
                        isGreen
                    });
                }
            );
        } else {
            const subjectTotalPrimaryScore = await subjectTaskService
                .getTotalPrimaryScoreBySubjectId(subjectId);

            if (scoreConversion[0].grade != 2) {
                throw ApiError.badRequest('Минимальная оценка должна быть равна 2');
            }

            if (scoreConversion[scoreConversion.length - 1].grade != 5) {
                throw ApiError.badRequest('Максимальная оценка должна быть равна 5');
            }

            if (scoreConversion[scoreConversion.length - 1].maxScore != subjectTotalPrimaryScore) {
                throw ApiError.badRequest('Некорректная сумма первичных баллов');
            }

            let expectedGrade = 2;
            let expectedScore = 0;

            scoreConversion.forEach(item => {
                let { minScore, maxScore, grade } = item;

                if (minScore == undefined || maxScore == undefined || grade == undefined) {
                    throw ApiError.badRequest('Ошибка валидации');
                }

                minScore = Number(minScore);
                maxScore = Number(maxScore);
                grade = Number(grade);

                if (grade != expectedGrade) {
                    throw ApiError.badRequest('Оценки идут в неправильном порядке');
                }

                if (minScore > maxScore) {
                    throw ApiError.badRequest('Нижняя граница не может быть больше верхней');
                }

                if (minScore != expectedScore) {
                    throw ApiError.badRequest('Баллы идут в неправильном порядке');
                }

                expectedGrade++;
                expectedScore = maxScore + 1;
            });

            await this.deleteScoreConversionBySubjectId(subjectId);

            return await scoreConversion.forEach(
                async item => {
                    const { minScore, maxScore, grade, isRed, isGreen } = item;

                    await ScoreConversion.create({
                        subjectId,
                        minScore,
                        maxScore,
                        grade,
                        isRed,
                        isGreen
                    });
                }
            );
        }
    }

    async deleteScoreConversionBySubjectId(subjectId) {
        return await ScoreConversion.destroy({
            where: {
                subjectId
            }
        });
    }

    async getScoreInfoBySubjectId(subjectId) {
        const existedSubject = await subjectService.getSubjectById(subjectId);

        if (!existedSubject || !existedSubject.isPublished || existedSubject.isArchive) {
            throw ApiError.notFound('Таблица перевода баллов не найдена');
        }

        const { isMark } = existedSubject;

        const scoreConversionData = await ScoreConversion.findAll({
            where: {
                subjectId
            }
        });

        // вынести
        const scoreConversion = scoreConversionData.map(item => {
            const { id, primaryScore, secondaryScore, minScore, maxScore, grade, isRed, isGreen } = item;

            if (!existedSubject.isMark) {
                return {
                    id,
                    primaryScore,
                    secondaryScore,
                    isRed,
                    isGreen
                };
            }

            return {
                id,
                minScore,
                maxScore,
                grade,
                isRed,
                isGreen
            };
        });

        const subjectTasksData = await subjectTaskService.getSubjectTasksBySubjectId(subjectId);

        const subjectTasks = subjectTasksData.map(subjectTask => {
            const { id, number, primaryScore } = subjectTask;

            return {
                id,
                number,
                primaryScore
            }
        })

        return {
            isMark,
            scoreConversion,
            subjectTasks
        };
    }

    async getScoreConversionBySubjectId(subjectId) {
        const existedSubject = await subjectService.getSubjectById(subjectId);

        if (!existedSubject) {
            throw ApiError.notFound('Таблица перевода баллов не найдена');
        }

        const scoreConversionData = await ScoreConversion.findAll({
            where: {
                subjectId
            },
            attributes: {
                exclude: ['subjectId']
            }
        });

        // вынести
        return scoreConversionData.map(item => {
            const { id, primaryScore, secondaryScore, minScore, maxScore, grade, isRed, isGreen } = item;

            if (!existedSubject.isMark) {
                return {
                    id,
                    primaryScore,
                    secondaryScore,
                    isRed,
                    isGreen
                };
            }

            return {
                id,
                minScore,
                maxScore,
                grade,
                isRed,
                isGreen
            };
        });
    }

    async calculateSecondaryScore(subjectId, primaryScore) {
        if (primaryScore == 0) {
            return 0;
        }

        const scoreConversion = await ScoreConversion.findOne({
            where: {
                subjectId,
                primaryScore
            }
        });

        if (!scoreConversion) {
            return null;
        }

        const { secondaryScore } = scoreConversion;

        return secondaryScore;
    }
}

export default new ScoreConversionService();
