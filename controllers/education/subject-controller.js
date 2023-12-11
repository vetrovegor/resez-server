import { validationResult } from "express-validator";

import { ApiError } from "../../errors/api-error.js";
import subjectService from "../../services/education/subject-service.js";

class SubjectController {
    async createSubject(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('Ошибка валидации', errors.array()));
            }

            const { subject, subjectTasks, durationMinutes, isMark, isPublished } = req.body;

            const createdSubject = await subjectService.createSubject(
                req,
                subject,
                subjectTasks,
                durationMinutes,
                isMark,
                isPublished
            );

            res.json({ subject: createdSubject });
        } catch (e) {
            next(e);
        }
    }

    async updateSubjectById(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('Ошибка валидации', errors.array()));
            }

            const { id, subject, subjectTasks, durationMinutes, isMark, isPublished } = req.body;

            const updatedSubject = await subjectService.updateSubjectById(
                req,
                id,
                subject,
                subjectTasks,
                durationMinutes,
                isMark,
                isPublished
            );

            res.json({ subject: updatedSubject });
        } catch (e) {
            next(e);
        }
    }

    async getSubjectFullInfo(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('Ошибка валидации', errors.array()));
            }

            const { id } = req.params;

            const subject = await subjectService.getSubjectFullInfo(id);

            res.json({ subject });
        } catch (e) {
            next(e);
        }
    }

    async deleteSubjectById(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('Ошибка валидации', errors.array()));
            }

            const { id } = req.params;

            const subject = await subjectService.deleteSubjectById(req, id);

            res.json({ subject });
        } catch (e) {
            next(e);
        }
    }

    async getSubjectShortInfoElements(req, res, next) {
        try {
            const response = await subjectService.getSubjectShortInfoElements();
            res.json(response);
        } catch (e) {
            next(e);
        }
    }
}

export default new SubjectController();