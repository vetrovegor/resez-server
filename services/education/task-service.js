import { Op } from "sequelize";

import { TaskFullInfo } from "../../dto/education/task-full-info.js";
import { TaskShortInfo } from "../../dto/education/task-short-info.js";
import { ApiError } from "../../errors/api-error.js";
import { Task, TestTask } from "../../model/model.js";
import userService from "../user-service.js";
import subThemeService from "./sub-theme-service.js";
import subjectService from "./subject-service.js";
import subjectTaskService from "./subject-task-service.js";
import { sequelize } from "../../db.js";
import { PaginationDto } from "../../dto/pagination-dto.js";

class TaskService {
    async createTask(subThemeId, task, solution, answer, isVerified, userId) {
        const subTheme = await subThemeService.getSubThemeById(subThemeId);

        if (!subTheme) {
            subThemeService.throwSubThemeNotFoundError();
        }

        const existedTask = await Task.findOne({
            where: {
                task,
                subThemeId
            }
        });

        if (existedTask) {
            this.throwTaskAlreadyExistsError();
        }

        const { subjectTaskId } = subTheme;

        const { isDetailedAnswer, subjectId } = await subjectTaskService.getSubjectTaskById(subjectTaskId);

        if (isDetailedAnswer && !solution) {
            throw ApiError.badRequest('Задание с развернутым ответом должно содержать решение');
        }

        if (!isDetailedAnswer && !answer) {
            throw ApiError.badRequest('Задание без развернутого ответа должно содержать ответ');
        }

        const createdTask = await Task.create({
            subjectId,
            subjectTaskId,
            subThemeId,
            task,
            solution,
            answer,
            isVerified,
            userId,
            date: Date.now()
        });

        return await this.createTaskFullInfo(createdTask);
    }

    async getTaskById(taskId) {
        return await Task.findByPk(taskId);
    }

    async createTaskFullInfo(task) {
        const { subThemeId, userId } = task;
        const { subjectTaskId, subTheme } = await subThemeService.getSubThemeById(subThemeId);
        const { subjectId, theme, number } = await subjectTaskService.getSubjectTaskById(subjectTaskId);
        const { subject } = await subjectService.getSubjectById(subjectId);
        const user = await userService.getUserById(userId);

        return new TaskFullInfo(task, number, subject, theme, subTheme, user);
    }

    async getTasks(limit, offset, subjectId, subjectTaskId, subThemeId, isVerified, userId) {
        const whereOptions = {
            ...(subjectId && { subjectId }),
            ...(subjectTaskId && { subjectTaskId }),
            ...(subThemeId && { subThemeId }),
            ...(isVerified && { isVerified }),
            ...(userId && { userId })
        };

        const tasks = await Task.findAll({
            where: whereOptions,
            order: [['date', 'DESC']],
            limit,
            offset
        });

        const taskDtos = await Promise.all(
            tasks.map(async task =>
                await this.createTaskFullInfo(task)
            )
        );

        const totalCount = await Task.count({
            where: whereOptions
        });

        return new PaginationDto("tasks", taskDtos, totalCount, limit, offset);
    }

    async deleteTaskById(taskId) {
        const task = await Task.findByPk(taskId);

        if (!task) {
            this.throwTaskNotFoundError();
        }

        const taskDto = await this.createTaskFullInfo(task);

        await task.destroy();

        return taskDto;
    }

    async getTaskAdminInfoById(taskId) {
        const taskData = await this.getTaskById(taskId);

        if (!taskData) {
            this.throwTaskNotFoundError();
        }

        const { id, isVerified, task, solution, answer, subThemeId } = taskData;
        const { subjectTaskId, subTheme } = await subThemeService.getSubThemeById(subThemeId);
        const { subjectId, number, theme } = await subjectTaskService.getSubjectTaskById(subjectTaskId);
        const { subject } = await subjectService.getSubjectById(subjectId);

        // taskAdminInfo
        return {
            id,
            subject: {
                id: subjectId,
                subject
            },
            subjectTask: {
                id: subjectTaskId,
                number,
                theme
            },
            subTheme: {
                id: subThemeId,
                subTheme
            },
            isVerified,
            task,
            solution,
            answer
        };
    }

    async updateTaskById(taskId, subThemeId, task, solution, answer, isVerified) {
        const taskData = await Task.findByPk(taskId);

        if (!taskData) {
            this.throwTaskNotFoundError();
        }

        const subTheme = await subThemeService.getSubThemeById(subThemeId);

        if (!subTheme) {
            subThemeService.throwSubThemeNotFoundError();
        }

        const existedTask = await Task.findOne({
            where: {
                task,
                subThemeId,
                id: {
                    [Op.ne]: taskId
                }
            }
        });

        if (existedTask) {
            this.throwTaskAlreadyExistsError();
        }

        const { subjectTaskId } = subTheme;

        const { isDetailedAnswer } = await subjectTaskService.getSubjectTaskById(subjectTaskId);

        if (isDetailedAnswer && !solution) {
            throw ApiError.badRequest('Задание с развернутым ответом должно содержать решение');
        }

        if (!isDetailedAnswer && !answer) {
            throw ApiError.badRequest('Задание без развернутого ответа должно содержать ответ');
        }

        taskData.subThemeId = subThemeId;
        taskData.task = task;
        taskData.solution = solution;
        taskData.answer = answer;
        taskData.isVerified = isVerified;
        await taskData.save();

        return await this.createTaskFullInfo(taskData);
    }

    async verifyTaskById(taskId) {
        const task = await this.getTaskById(taskId);

        if (!task) {
            this.throwTaskNotFoundError();
        }

        task.isVerified = true;
        await task.save();

        return await this.createTaskFullInfo(task);
    }

    async getVerifiedTasksCountBySubThemeId(subThemeId) {
        return await Task.count({
            where: {
                subThemeId,
                isVerified: true
            }
        });
    }

    async getRandomVerifiedTaskBySubThemeId(subThemeId) {
        return await Task.findOne({
            order: sequelize.random(),
            where: {
                subThemeId,
                isVerified: true
            }
        });
    }

    async getRandomVerifiedTaskBySubThemeIDs(subThemeIDs, limit) {
        return await Task.findAll({
            order: sequelize.random(),
            where: {
                subThemeId: {
                    [Op.in]: subThemeIDs
                },
                isVerified: true
            },
            limit
        });
    }

    async getVerifiedTaskById(taskId) {
        const taskData = await Task.findOne({
            where: {
                id: taskId,
                isVerified: true
            }
        });

        if (!taskData) {
            this.throwTaskNotFoundError();
        }

        const { id, subThemeId, task, solution, answer } = taskData;
        const { subjectTaskId, subTheme } = await subThemeService.getSubThemeById(subThemeId);
        const { subjectId, theme, number } = await subjectTaskService.getSubjectTaskById(subjectTaskId);
        const { subject, isPublished, isArchive } = await subjectService.getSubjectById(subjectId);

        if (!isPublished || isArchive) {
            this.throwTaskNotFoundError();
        }

        const taskShortInfo = new TaskShortInfo(taskData, subject, number, theme, subTheme);

        return {
            subject,
            number,
            theme,
            subTheme,
            tasks: [
                taskShortInfo
            ]
        }
    }

    async getVerifiedTasksBySubThemeId(subThemeId, limit, offset) {
        const subThemeData = await subThemeService.getSubThemeById(subThemeId);

        if (!subThemeData) {
            this.throwTasksNotFoundError();
        }

        const { subjectTaskId, subTheme } = subThemeData;
        const { subjectId, theme, number } = await subjectTaskService.getSubjectTaskById(subjectTaskId);
        const { subject, isPublished } = await subjectService.getSubjectById(subjectId);

        if (!isPublished) {
            this.throwTasksNotFoundError();
        }

        // вернуть тут limit
        const tasks = await Task.findAll({
            order: [['date', 'DESC']],
            where: {
                subThemeId,
                isVerified: true
            },
            // limit,
            offset
        });

        const taskDtos = await Promise.all(
            tasks.map(async task =>
                new TaskShortInfo(task, subject, number, theme, subTheme)
            )
        );

        const totalCount = await Task.count({
            where: {
                subThemeId,
                isVerified: true,
            }
        });

        const tasksPagination = new PaginationDto("tasks", taskDtos, totalCount, limit, offset);

        return {
            subject,
            number,
            theme,
            subTheme,
            ...tasksPagination
        };
    }

    async getTasksByTestId(testId) {
        const testTasks = await TestTask.findAll({
            where: {
                testId
            }
        });

        const tasks = await Promise.all(
            testTasks.map(async testTask => {
                const { taskId } = testTask;
                const { id, task, subThemeId } = await this.getTaskById(taskId);
                const { subTheme, subjectTaskId } = await subThemeService.getSubThemeById(subThemeId);
                const { number, theme, isDetailedAnswer } = await subjectTaskService.getSubjectTaskById(subjectTaskId);

                return {
                    id,
                    number,
                    theme,
                    isDetailedAnswer,
                    subTheme,
                    task
                };
            })
        );

        const sortedTasks = this.sortTasksByNumber(tasks);

        return sortedTasks;
    }

    async getDetailedAnswerTasksByIDs(taskIDs) {
        let tasks = [];

        await Promise.all(
            taskIDs.map(async taskId => {
                const taskData = await this.getTaskById(taskId);

                const { id, task, solution, answer, subThemeId } = taskData;
                const { subjectTaskId, subTheme } = await subThemeService.getSubThemeById(subThemeId);
                const { theme, number, primaryScore: maxPrimaryScore, isDetailedAnswer } = await subjectTaskService.getSubjectTaskById(subjectTaskId);

                if (isDetailedAnswer) {
                    tasks.push({
                        id,
                        number,
                        theme,
                        subTheme,
                        task,
                        solution,
                        answer,
                        maxPrimaryScore
                    });
                }
            })
        );

        const sortedTasks = this.sortTasksByNumber(tasks);

        return sortedTasks;
    }

    sortTasksByNumber(tasks) {
        tasks.sort(function (a, b) {
            return a.number - b.number;
        });

        return tasks;
    }

    async getTasksCountBySubjectId(subjectId) {
        return await Task.count({
            where: {
                subjectId
            }
        });
    }

    throwTaskNotFoundError() {
        throw ApiError.badRequest('Задание не найдено');
    }

    throwTasksNotFoundError() {
        throw ApiError.badRequest('Заданий не найдено');
    }

    throwTaskAlreadyExistsError() {
        throw ApiError.badRequest('Данное задание уже существует');
    }
}

export default new TaskService();