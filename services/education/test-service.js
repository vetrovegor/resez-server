import { Op } from "sequelize";

import { TestShortInfo } from "../../dto/education/test-short-info.js";
import { TestFullInfo } from "../../dto/education/test-full-info.js";
import { ApiError } from "../../errors/api-error.js";
import { Test, TestTask } from "../../model/model.js";
import { getRandomElementFromArray } from "../../utils/array-utils.js";
import subjectService from "./subject-service.js";
import taskService from "./task-service.js";
import userService from "../user-service.js";
import subjectTaskService from "./subject-task-service.js";
import subThemeService from "./sub-theme-service.js";
import { PaginationDto } from "../../dto/pagination-dto.js";
import scoreConversionService from "./score-conversion-service.js";
import { PERMISSIONS } from "../../consts/PERMISSIONS.js";

class TestService {
    async createTest(subjectId, isPrivate, isOfficial, isExam, userId) {
        return await Test.create({
            isPrivate,
            isOfficial,
            isExam,
            subjectId,
            userId,
            date: Date.now()
        });
    }

    async createTestTask(testId, taskId) {
        return await TestTask.create({
            testId,
            taskId
        });
    }

    async getTestTasksCountByTestId(testId) {
        return await TestTask.count({
            where: {
                testId
            }
        });
    }

    async createTestShortInfo(test) {
        const { id: testId, subjectId } = test;

        const { subject } = await subjectService.getSubjectById(subjectId);

        const tasksCount = await this.getTestTasksCountByTestId(testId);

        return new TestShortInfo(test, subject, tasksCount);
    }

    async createTestFullInfo(test) {
        const { id: testId, subjectId, userId } = test;

        const subject = await subjectService.getSubjectById(subjectId);

        const tasksCount = await this.getTestTasksCountByTestId(testId);

        const user = await userService.getUserById(userId);

        const tasks = await taskService.getTasksByTestId(testId);

        return new TestFullInfo(test, subject, tasksCount, user, tasks);
    }

    async getUserTests(userId, limit, offset) {
        const tests = await Test.findAll({
            where: { userId },
            order: [['date', 'DESC']],
            limit,
            offset
        });

        const testDtos = await Promise.all(
            tests.map(async test =>
                await this.createTestShortInfo(test)
            ));

        const totalCount = await Test.count({
            where: { userId }
        });

        return new PaginationDto("tests", testDtos, totalCount, limit, offset);
    }

    async geTestById(testId) {
        const test = await Test.findByPk(testId);

        if (!test) {
            this.throwTestNotFoundError();
        }

        return await this.createTestFullInfo(test);
    }

    async generateExamTest(subjectId, isPrivate, isOfficial, userId) {
        const existedSubject = await subjectService.getSubjectFullInfo(subjectId);

        if (!existedSubject) {
            throw subjectService.throwSubjectNotFoundError();
        }

        const { subjectTasks } = existedSubject;

        // необязательно
        if (!subjectTasks.length) {
            this.throwNotfoundTasksToGenerateTest();
        }

        const subjectTasksWithZeroTasks = subjectTasks.filter(
            subjectTask => subjectTask.totalCount == 0
        );

        if (subjectTasksWithZeroTasks.length) {
            this.throwNotfoundTasksToGenerateTest();
        }

        const test = await this.createTest(
            subjectId,
            isPrivate,
            isOfficial,
            true,
            userId
        );

        subjectTasks.forEach(async subjectTask => {
            const { subThemes } = subjectTask;

            const subThemesWithTasks = subThemes.filter(
                subTheme => subTheme.tasksCount > 0
            );

            const randomSubTheme = getRandomElementFromArray(subThemesWithTasks);

            const randomTask = await taskService
                .getRandomVerifiedTaskBySubThemeId(randomSubTheme.id);

            await this.createTestTask(test.id, randomTask.id);
        });

        return new TestShortInfo(test, existedSubject.subject, subjectTasks.length);
    }

    async generateCustomTest(subjectId, isPrivate, subjectTasks, userId) {
        const existedSubject = await subjectService.getSubjectById(subjectId);

        if (!existedSubject) {
            subjectService.throwSubjectNotFoundError();
        }

        let providedTasksCount = 0;

        // валидация заданий предмета, подтем
        for (const subjectTask of subjectTasks) {
            const { id: subjectTaskId, count, subThemes } = subjectTask;

            const subjectTaskData = await subjectTaskService.getSubjectTaskById(subjectTaskId);

            if (!subjectTaskData || subjectTaskData.subjectId !== subjectId) {
                subjectTaskService.throwSubjectTaskNotFoundError();
            }

            for (const subThemeId of subThemes) {
                const subThemeData = await subThemeService.getSubThemeById(subThemeId);

                if (!subThemeData || subThemeData.subjectTaskId !== subjectTaskId) {
                    subThemeService.throwSubThemeNotFoundError();
                }
            }

            providedTasksCount += count;
        }

        if (providedTasksCount < 1) {
            this.throwGenerateTestError();
        }

        const tasksIDs = [];

        for (const subjectTask of subjectTasks) {
            const { subThemes, count } = subjectTask;
            const randomTasks = await taskService.getRandomVerifiedTaskBySubThemeIDs(subThemes, count);

            for (const task of randomTasks) {
                tasksIDs.push(task.id);
            }
        }

        if (tasksIDs.length < 1) {
            this.throwGenerateTestError();
        }

        const test = await this.createTest(
            subjectId,
            isPrivate,
            false,
            false,
            userId
        );

        for (const taskId of tasksIDs) {
            await this.createTestTask(test.id, taskId);
        }

        return new TestShortInfo(test, existedSubject.subject, tasksIDs.length);
    }

    async deleteTestById(id, userId) {
        const test = await Test.findByPk(id);

        if (!test) {
            this.throwTestNotFoundError();
        }

        const hasPermission = await userService.checkUserPermission(userId, PERMISSIONS.DELETE_TESTS);

        if (test.userId != userId && !hasPermission) {
            this.throwTestNotFoundError();
        }

        const testShortInfo = new TestShortInfo(test);

        await test.destroy();

        return testShortInfo;
    }

    async getDetailedAnswerTasksByTestId(testId) {
        const existedTest = await Test.findByPk(testId);

        if (!existedTest) {
            this.throwTestNotFoundError();
        }

        const testTasks = await TestTask.findAll({
            where: {
                testId
            }
        });

        const taskIDs = testTasks.map(
            testTask => testTask.taskId
        );

        const tasks = await taskService.getDetailedAnswerTasksByIDs(taskIDs);

        return tasks;
    }

    // отрефакторить
    async getTestResult(testId, spentSeconds, tasksWithoutDetailedAnswer = [], tasksWithDetailedAnswer = []) {
        const existedTest = await Test.findByPk(testId);

        if (!existedTest) {
            this.throwTestNotFoundError();
        }

        if (spentSeconds < 1) {
            throw ApiError.badRequest('Длительность в секундах должна быть положительным числом');
        }

        // проверка, что переданы все задания теста и не передано лишних
        const allTestTasks = await TestTask.findAll({
            where: {
                testId
            }
        });

        const allTestTasksIDs = allTestTasks
            .map(task => task.taskId);

        const providedTasksIDs = tasksWithoutDetailedAnswer
            .concat(tasksWithDetailedAnswer)
            .map(task => task.id);

        const notFoundTaskIDs = allTestTasksIDs.filter(
            taskId => !providedTasksIDs.includes(taskId)
        );

        console.log(JSON.stringify(notFoundTaskIDs));

        if (notFoundTaskIDs.length) {
            throw ApiError.badRequest('Переданы не все задания теста');
        }

        const extraTaskIDs = providedTasksIDs.filter(
            taskId => !allTestTasksIDs.includes(taskId)
        );

        if (extraTaskIDs.length) {
            throw ApiError.badRequest('Переданы задания, которых нет в тесте');
        }

        // проверка заданий 1-й части
        const tasksWithoutDetailedAnswerResult = [];
        let totalPrimaryScore = 0;
        let maxPrimaryScore = 0;

        for (const task of tasksWithoutDetailedAnswer) {
            const { id, answer } = task;

            const existedTask = await taskService.getTaskById(id);

            const { subThemeId, answer: correctAsnwer } = existedTask;
            const { subjectTaskId } = await subThemeService.getSubThemeById(subThemeId);
            const { number, isDetailedAnswer, primaryScore: taskPrimaryScore } = await subjectTaskService.getSubjectTaskById(subjectTaskId);

            if (!existedTask || isDetailedAnswer) {
                taskService.throwTaskNotFoundError();
            }

            const formattedAnswer = answer.toLowerCase().replace(/\s/g, '');
            const formattedCorrectAsnwer = correctAsnwer.toLowerCase().replace(/\s/g, '');

            const isCorrect = formattedAnswer == formattedCorrectAsnwer;

            const primaryScore = isCorrect ? taskPrimaryScore : 0;

            tasksWithoutDetailedAnswerResult.push({
                id,
                number,
                answer: formattedAnswer,
                isCorrect,
                correctAsnwer: isCorrect ? formattedAnswer : formattedCorrectAsnwer,
                primaryScore
            });

            totalPrimaryScore += primaryScore;
            maxPrimaryScore += taskPrimaryScore;
        }

        // проверка заданий 2-й части
        const tasksWithDetailedAnswerResult = [];

        for (const task of tasksWithDetailedAnswer) {
            const { id, primaryScore } = task;

            const existedTask = await taskService.getTaskById(id);

            const { subjectTaskId } = await subThemeService.getSubThemeById(existedTask.subThemeId);
            const { number, isDetailedAnswer, primaryScore: taskPrimaryScore } = await subjectTaskService.getSubjectTaskById(subjectTaskId);

            if (!existedTask || !isDetailedAnswer) {
                taskService.throwTaskNotFoundError();
            }

            if (primaryScore < 0 || primaryScore > taskPrimaryScore) {
                throw ApiError.badRequest('Первичный балл больше чем возможно');
            }

            tasksWithDetailedAnswerResult.push({
                id,
                number,
                primaryScore,
                maxPrimaryScore: taskPrimaryScore
            });

            totalPrimaryScore += primaryScore;
            maxPrimaryScore += taskPrimaryScore;
        }

        // подсчет баллов
        const { subjectId, isExam } = existedTest;

        if (isExam) {
            // удалить
            // var maxPrimaryScore = await scoreConversionService.getMaxPrimaryScoreBySubjectId(subjectId);

            var totalSecondaryScore = await scoreConversionService.calculateSecondaryScore(
                subjectId,
                totalPrimaryScore
            );
        }

        return {
            isExam,
            tasksWithoutDetailedAnswerResult,
            tasksWithDetailedAnswerResult,
            totalPrimaryScore,
            maxPrimaryScore,
            totalSecondaryScore
        };
    }

    async getTestsCountByUserId(userId) {
        return await Test.count({
            where: {
                userId
            }
        });
    }

    async getTestTask(testId, taskId) {
        return await TestTask.findOne({
            where: {
                testId,
                taskId
            }
        });
    }

    async getOfficialTestsBySubjectId(subjectId, limit, offset) {
        const existedSubject = await subjectService.getSubjectById(subjectId);

        if (!existedSubject) {
            subjectService.throwSubjectNotFoundError();
        }

        const whereOptions = {
            isOfficial: true,
            subjectId
        }

        const tests = await Test.findAll({
            where: whereOptions,
            order: [['date', 'DESC']],
            limit,
            offset
        });

        const testDtos = await Promise.all(
            tests.map(async test =>
                await this.createTestShortInfo(test)
            ));

        const totalCount = await Test.count({
            where: whereOptions
        });

        return new PaginationDto("tests", testDtos, totalCount, limit, offset);
    }

    async getTests(limit, offset, isOfficial, subjectId, userId) {
        const whereOptions = {
            ...(isOfficial && { isOfficial }),
            ...(subjectId && { subjectId }),
            ...(userId && { userId })
        };

        const tests = await Test.findAll({
            where: whereOptions,
            order: [['date', 'DESC']],
            limit,
            offset
        });

        const testDtos = await Promise.all(
            tests.map(async test =>
                await this.createTestShortInfo(test)
            )
        );

        const totalCount = await Test.count({
            where: whereOptions
        });

        return new PaginationDto("tasks", testDtos, totalCount, limit, offset);
    }

    throwGenerateTestError() {
        throw ApiError.notFound('Не удалось сгенерировать тест');
    }

    throwNotfoundTasksToGenerateTest() {
        throw ApiError.notFound('Заданий в базе недостаточно, чтобы сгенерировать тест');
    }

    throwTestNotFoundError() {
        throw ApiError.notFound('Тест не найден');
    }
}

export default new TestService();