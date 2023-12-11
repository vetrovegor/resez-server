import { Op } from "sequelize";

import { SubjectTask } from "../../model/model.js";
import subThemeService from "./sub-theme-service.js";
import { SubjectTaskDto } from '../../dto/education/subject-task-dto.js'
import { ApiError } from "../../errors/api-error.js";
import subjectService from "./subject-service.js";
import { sequelize } from "../../db.js";

export class SubjectTaskService {
    async createSubjectTask(number, theme, isDetailedAnswer, primaryScore, subjectId) {
        return await SubjectTask.create({
            number,
            theme,
            isDetailedAnswer,
            primaryScore,
            subjectId
        });
    }

    async createSubjectTasks(subjectTasks, subjectId) {
        let totalPrimaryScore = 0;
        let count = 1;

        for (const subjectTask of subjectTasks) {
            const { theme, isDetailedAnswer, primaryScore, subThemes } = subjectTask;

            const createSubjectTask = await this.createSubjectTask(
                count++,
                theme,
                isDetailedAnswer,
                primaryScore,
                subjectId
            );

            totalPrimaryScore += primaryScore;

            const subjectTaskId = createSubjectTask.id;

            for (const { subTheme } of subThemes) {
                console.log(`subTheme: ${subTheme}`);
                await subThemeService.createSubTheme(subTheme, subjectTaskId);
            }
        }

        return totalPrimaryScore;
    }

    async updateSubjectTasks(subjectTasks, subjectId) {
        let subjectTaskIDs = [];
        let count = 1;

        for (const subjectTask of subjectTasks) {
            let { id: subjectTaskId, theme, isDetailedAnswer, primaryScore, subThemes } = subjectTask;

            const existedSubjectTask = await SubjectTask.findByPk(subjectTaskId);

            if (existedSubjectTask && existedSubjectTask.subjectId != subjectId) {
                throw ApiError.badRequest('Некорректное id задания предмета');
            }

            if (existedSubjectTask) {
                existedSubjectTask.number = count++;
                existedSubjectTask.theme = theme;
                existedSubjectTask.isDetailedAnswer = isDetailedAnswer;
                existedSubjectTask.primaryScore = primaryScore;
                await existedSubjectTask.save();
            } else {
                // вынести в отдельный метод
                const createSubjectTask = await this.createSubjectTask(
                    count++,
                    theme,
                    isDetailedAnswer,
                    primaryScore,
                    subjectId
                );

                subjectTaskId = createSubjectTask.id;
            }

            await subThemeService.updateSubThemes(subThemes, subjectTaskId);

            subjectTaskIDs = [...subjectTaskIDs, subjectTaskId];
        }

        await SubjectTask.destroy({
            where: {
                subjectId,
                id: {
                    [Op.notIn]: subjectTaskIDs
                }
            }
        });
    }

    async getSubjectTasksCount(subjectId) {
        return await SubjectTask.count({
            where: {
                subjectId
            }
        });
    }

    async getSubjectTasksBySubjectId(subjectId) {
        const subjectTasks = await SubjectTask.findAll({
            where: {
                subjectId
            },
            order: [['number', 'ASC']]
        });

        if (!subjectTasks.length) {
            throw ApiError.notFound('Заданий не найдено');
        }

        return subjectTasks.map(subjectTask =>
            new SubjectTaskDto(subjectTask)
        );
    }

    async getSubjectTaskById(subjectTaskId) {
        return await SubjectTask.findByPk(subjectTaskId);
    }

    async getTasksInfoBySubjectId(subjectId) {
        const subject = await subjectService.getSubjectById(subjectId);

        if (!subject) {
            throw ApiError.notFound('Предмет не найден');
        }

        const subjectTasksData = await SubjectTask.findAll({
            where: {
                subjectId
            },
            attributes: {
                exclude: ['subjectId']
            },
            order: [['number']]
        });

        const subjectTasks = await Promise.all(
            subjectTasksData.map(async subjectTaskData => {
                const { id, number, theme, primaryScore, isDetailedAnswer } = subjectTaskData;

                const { totalCount, subThemes } = await subThemeService
                    .getSubThemesWithTasksCountBySubjectTaskId(id);

                return {
                    id,
                    number,
                    theme,
                    primaryScore,
                    isDetailedAnswer,
                    totalCount,
                    subThemes
                };
            })
        );

        return subjectTasks;
    }

    async getTotalPrimaryScoreBySubjectId(subjectId) {
        const totalPrimaryScore = await SubjectTask.sum('primaryScore', {
            where: {
                subjectId
            }
        });

        return totalPrimaryScore || 0;
    }

    throwSubjectTaskNotFoundError() {
        throw ApiError.notFound('Задание предмета не найдено');
    }
}

export default new SubjectTaskService();