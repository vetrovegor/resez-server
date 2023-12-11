import { Op } from "sequelize";

import { ApiError } from "../../errors/api-error.js";
import { SubTheme } from "../../model/model.js";
import taskService from "./task-service.js";
import { SubThemeDto } from '../../dto/education/sub-theme-dto.js';
import { sequelize } from "../../db.js";

export class SubThemeService {
    async createSubTheme(subTheme, subjectTaskId) {
        return await SubTheme.create({ subTheme, subjectTaskId });
    }

    async updateSubThemes(subThemes, subjectTaskId) {
        let subThemeIDs = [];

        for (const subThemeItem of subThemes) {
            let { id: subThemeId, subTheme } = subThemeItem;

            const existedSubTheme = await SubTheme.findByPk(subThemeId);

            if (existedSubTheme && existedSubTheme.subjectTaskId != subjectTaskId) {
                throw ApiError.badRequest('Некорректное id подтемы');
            }

            if (existedSubTheme) {
                existedSubTheme.subTheme = subTheme;
                await existedSubTheme.save();
            } else {
                const createdSubTheme = await this.createSubTheme(subTheme, subjectTaskId);
                subThemeId = createdSubTheme.id;
            }

            subThemeIDs = [...subThemeIDs, subThemeId];
        }

        await SubTheme.destroy({
            where: {
                subjectTaskId,
                id: {
                    [Op.notIn]: subThemeIDs
                }
            }
        });
    }

    async getSubThemeById(subThemeId) {
        return await SubTheme.findByPk(subThemeId);
    }

    async getSubThemesBySubjectTaskId(subjectTaskId) {
        const subThemes = await SubTheme.findAll({
            where: {
                subjectTaskId
            }
        });

        if (!subThemes.length) {
            throw ApiError.notFound('Подтемы не найдены');
        }

        return subThemes.map(subTheme =>
            new SubThemeDto(subTheme)
        );
    }

    async getSubThemesWithTasksCountBySubjectTaskId(subjectTaskId) {
        const subThemes = await SubTheme.findAll({
            where: {
                subjectTaskId
            },
            attributes: {
                exclude: ['subjectTaskId']
            },
            order: [['id']]
        });

        let totalCount = 0;

        const subThemesWithTasksCount = await Promise.all(
            subThemes.map(async subThemeData => {
                const { id, subTheme } = subThemeData;

                const tasksCount = await taskService.getVerifiedTasksCountBySubThemeId(id);

                totalCount += tasksCount;

                return {
                    id,
                    subTheme,
                    tasksCount
                }
            })
        );

        return {
            totalCount,
            subThemes: subThemesWithTasksCount
        };
    }

    throwSubThemeNotFoundError() {
        throw ApiError.notFound('Подтема не найдена');
    }
}

export default new SubThemeService();