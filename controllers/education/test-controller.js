import { validationResult } from "express-validator";

import testService from "../../services/education/test-service.js";
import { ApiError } from "../../errors/api-error.js";

class TestController {
    async getUserTests(req, res, next) {
        try {
            const { id: userId } = req.user;
            const { limit, offset } = req.query;

            const response = await testService.getUserTests(userId, limit, offset);

            res.json(response);
        } catch (e) {
            next(e);
        }
    }

    async geTestById(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('Ошибка валидации', errors.array()));
            }

            const { id } = req.params;

            const test = await testService.geTestById(id);

            res.json({ test });
        } catch (e) {
            next(e);
        }
    }

    async generateExamTest(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('Ошибка валидации', errors.array()));
            }

            const { subjectId, isPrivate, isOfficial } = req.body;
            const { id: userId } = req.user;

            const test = await testService.generateExamTest(subjectId, isPrivate, isOfficial, userId);

            res.json({ test });
        } catch (e) {
            next(e);
        }
    }

    async generateCustomTest(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('Ошибка валидации', errors.array()));
            }

            const { subjectId, isPrivate, subjectTasks } = req.body;
            const { id: userId } = req.user;

            const test = await testService.generateCustomTest(subjectId, isPrivate, subjectTasks, userId);

            res.json(({ test }));
        } catch (e) {
            next(e);
        }
    }

    async deleteTestById(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('Ошибка валидации', errors.array()));
            }

            const { id } = req.params;
            const { id: userId } = req.user;

            const test = await testService.deleteTestById(id, userId);

            res.json({ test });
        } catch (e) {
            next(e);
        }
    }

    async getDetailedAnswerTasksByTestId(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('Ошибка валидации', errors.array()));
            }

            const { id } = req.params;

            const tasks = await testService.getDetailedAnswerTasksByTestId(id);

            res.json({ tasks });
        } catch (e) {
            next(e);
        }
    }

    async getTestResult(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('Ошибка валидации', errors.array()));
            }

            const { id, spentSeconds, tasksWithoutDetailedAnswer, tasksWithDetailedAnswer } = req.body;

            const result = await testService.getTestResult(
                id,
                spentSeconds,
                tasksWithoutDetailedAnswer,
                tasksWithDetailedAnswer
            );

            res.json(result);
        } catch (e) {
            next(e);
        }
    }

    async getOfficialTestsBySubjectId(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('Ошибка валидации', errors.array()));
            }

            const { id: subjectId } = req.params;
            const { limit, offset } = req.query;

            const response = await testService.getOfficialTestsBySubjectId(subjectId, limit, offset);

            res.json(response);
        } catch (e) {
            next(e);
        }
    }

    async getTests(req, res, next) {
        try {
            const { limit, offset, isOfficial, subjectId, userId } = req.query;

            const response = await testService.getTests(limit, offset, isOfficial, subjectId, userId);

            res.json(response);
        } catch (e) {
            next(e);
        }
    }
}

export default new TestController();
