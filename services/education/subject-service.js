import { Op } from "sequelize";

import { Subject } from "../../model/model.js";
import { SubjectShortInfo } from '../../dto/education/subject-short-info.js';
import { SubjectFullInfo } from '../../dto/education/subject-full-info.js';
import { ApiError } from "../../errors/api-error.js";
import subjectTaskService from "./subject-task-service.js";
import taskService from "./task-service.js";
import scoreConversionService from "./score-conversion-service.js";
import { PaginationDto } from "../../dto/pagination-dto.js";

class SubjectService {
    async getSubjectById(subjectId) {
        return await Subject.findByPk(subjectId);
    }

    async createSubject(req, subject, subjectTasks, durationMinutes, isMark, isPublished) {
        const existedSubject = await Subject.findOne({ where: { subject } });

        if (existedSubject) {
            this.throwSubjectAlreadyExistsError();
        }

        if (durationMinutes < 1) {
            throw ApiError.badRequest('Длительность в минутах должна быть положительным числом');
        }

        const createdSubject = await Subject.create({
            subject,
            isPublished,
            durationMinutes,
            isMark
        });

        await subjectTaskService.createSubjectTasks(subjectTasks, createdSubject.id);

        await logService.createSubjectLogEntry(req, 'Создал', subject);

        return new SubjectShortInfo(createdSubject, subjectTasks.length);
    }

    async updateSubjectById(req, subjectId, subject, subjectTasks, durationMinutes, isMark, isPublished) {
        const subjectData = await Subject.findByPk(subjectId);

        if (!subjectData) {
            this.throwSubjectNotFoundError();
        }

        const existedSubject = await Subject.findOne({
            where: {
                id: { [Op.ne]: subjectId },
                subject
            }
        });

        if (existedSubject) {
            this.throwSubjectAlreadyExistsError();
        }

        if (durationMinutes < 1) {
            throw ApiError.badRequest('Длительность в минутах должна быть положительным числом');
        }

        if (subjectData.isMark != isMark) {
            await scoreConversionService.deleteScoreConversionBySubjectId(subjectId);
        }

        subjectData.subject = subject;
        subjectData.durationMinutes = durationMinutes;
        subjectData.isMark = isMark;
        subjectData.isPublished = isPublished;
        await subjectData.save();

        // обновление тем, подтем
        subjectTaskService.updateSubjectTasks(subjectTasks, subjectId);

        await logService.createSubjectLogEntry(req, 'Отредактировал', subject);

        return new SubjectShortInfo(subjectData, subjectTasks.length);
    }

    async getSubjectFullInfo(subjectId) {
        const subject = await Subject.findByPk(subjectId);

        if (!subject) {
            this.throwSubjectNotFoundError();
        }

        const subjectTasks = await subjectTaskService
            .getTasksInfoBySubjectId(subject.id);

        return new SubjectFullInfo(subject, subjectTasks);
    }

    async createSubjectShortInfo(subject) {
        const { id: subjectId } = subject;

        const subjectTasksCount = await subjectTaskService.getSubjectTasksCount(subjectId);
        const tasksCount = await taskService.getTasksCountBySubjectId(subjectId);

        return new SubjectShortInfo(subject, subjectTasksCount, tasksCount);
    }

    async deleteSubjectById(req, subjectId) {
        const subject = await Subject.findByPk(subjectId);

        if (!subject) {
            this.throwSubjectNotFoundError();
        }

        const subjectShortInfo = await this.createSubjectShortInfo(subject);

        await subject.destroy();

        await logService.createSubjectLogEntry(req, 'Удалил', subject.subject);

        return subjectShortInfo;
    }

    async getPublishedSubjects() {
        return await Subject.findAll({
            where: {
                isPublished: true,
                isArchive: false
            },
            order: [['id', 'DESC']],
            attributes: ['id', 'subject']
        });
    }

    async getSubjectShortInfoElements() {
        const subjects = await Subject.findAll({
            where: {
                isArchive: false
            },
            order: [['id', 'DESC']]
        });

        const subjectShortInfoElements = await Promise.all(
            subjects.map(async subject =>
                await this.createSubjectShortInfo(subject)
            )
        );

        return {
            totalCount: subjectShortInfoElements.length,
            subjects: subjectShortInfoElements
        }
    }

    throwSubjectNotFoundError() {
        throw ApiError.notFound('Предмет не найден');
    }

    throwSubjectAlreadyExistsError() {
        throw ApiError.badRequest('Предмет с таким названием уже существует');
    }
}

export default new SubjectService();
