import { validationResult } from "express-validator";

import taskService from "../../services/education/task-service.js";
import { ApiError } from "../../errors/api-error.js";

class TaskController {
    async createTask(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('Ошибка валидации', errors.array()));
            }

            const { subThemeId, task, solution, answer, isVerified } = req.body;
            const { id: userId } = req.user;
            const createdTask = await taskService.createTask(subThemeId, task, solution, answer, isVerified, userId);
            res.json({ task: createdTask });
        } catch (e) {
            next(e);
        }
    }

    async getTasks(req, res, next) {
        try {
            const { limit, offset, subjectId, subjectTaskId, subThemeId, isVerified, userId } = req.query;
            const response = await taskService.getTasks(limit, offset, subjectId, subjectTaskId, subThemeId, isVerified, userId);
            res.json(response);
        } catch (e) {
            next(e);
        }
    }

    async deleteTaskById(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('Ошибка валидации', errors.array()));
            }

            const { id } = req.params;

            const deletedTask = await taskService.deleteTaskById(id);

            res.json({ task: deletedTask });
        } catch (e) {
            next(e);
        }
    }

    async getTaskAdminInfoById(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('Ошибка валидации', errors.array()));
            }

            const { id } = req.params;

            const task = await taskService.getTaskAdminInfoById(id);

            res.json({ task });
        } catch (e) {
            next(e);
        }
    }

    async updateTaskById(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('Ошибка валидации', errors.array()));
            }

            const { id, subThemeId, task, solution, answer, isVerified } = req.body;

            const updatedTask = await taskService.updateTaskById(id, subThemeId, task, solution, answer, isVerified);

            res.json({ task: updatedTask });
        } catch (e) {
            next(e);
        }
    }

    async verifyTaskById(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('Ошибка валидации', errors.array()));
            }

            const { id } = req.params;

            const task = await taskService.verifyTaskById(id);

            res.json({ task });
        } catch (e) {
            next(e);
        }
    }

    async getVerifiedTaskById(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('Ошибка валидации', errors.array()));
            }

            const { id } = req.params;

            const response = await taskService.getVerifiedTaskById(id);

            res.json(response);
        } catch (e) {
            next(e);
        }
    }

    async getVerifiedTasksBySubThemeId(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('Ошибка валидации', errors.array()));
            }

            const { id } = req.params;
            const { limit, offset } = req.query;

            const response = await taskService.getVerifiedTasksBySubThemeId(id, limit, offset);

            res.json(response);
        } catch (e) {
            next(e);
        }
    }
}

export default new TaskController();