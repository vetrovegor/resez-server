import { Router } from "express";
import { body, param } from "express-validator";

import { accessTokenMiddleware } from "../../middlewares/access-token-middleware.js";
import { blockedMiddleware } from "../../middlewares/blocked-middleware.js";
import testController from "../../controllers/education/test-controller.js";
import { testLimitMiddleware } from "../../middlewares/test-limit-middleware.js";
import { paginationMiddleware } from "../../middlewares/pagination-middleware.js";
import { officialTestMiddleware } from "../../middlewares/officialTestMiddleware.js";

export const testRouter = new Router();

testRouter.get('/',
    accessTokenMiddleware,
    blockedMiddleware,
    paginationMiddleware,
    testController.getUserTests);

testRouter.get('/:id',
    param('id').isNumeric(),
    testController.geTestById);

testRouter.post('/generate-exam',
    body('subjectId').isNumeric(),
    body('isPrivate').isBoolean(),
    body('isOfficial').isBoolean(),
    accessTokenMiddleware,
    blockedMiddleware,
    officialTestMiddleware,
    testLimitMiddleware,
    testController.generateExamTest);

testRouter.post('/generate-custom',
    body('subjectId').isNumeric(),
    body('isPrivate').isBoolean(),
    body('subjectTasks').isArray({ min: 1 }),
    body('subjectTasks.*').isObject(),
    body('subjectTasks.*.id').isNumeric(),
    body('subjectTasks.*.count').isNumeric(),
    body('subjectTasks.*.subThemes').isArray(),
    body('subjectTasks.*.subThemes.*').isNumeric(),
    accessTokenMiddleware,
    blockedMiddleware,
    testLimitMiddleware,
    testController.generateCustomTest);

testRouter.delete('/:id',
    param('id').isNumeric(),
    accessTokenMiddleware,
    blockedMiddleware,
    testController.deleteTestById);

testRouter.get('/:id/detailed-answer-tasks',
    param('id').isNumeric(),
    testController.getDetailedAnswerTasksByTestId);

testRouter.post('/check',
    body('id').isNumeric(),
    body('spentSeconds').isNumeric(),
    body('tasksWithoutDetailedAnswer').isArray().optional(),
    body('tasksWithoutDetailedAnswer.*').isObject(),
    body('tasksWithoutDetailedAnswer.*.id').isNumeric(),
    body('tasksWithoutDetailedAnswer.*.answer').isString(),
    body('tasksWithDetailedAnswer').isArray().optional(),
    body('tasksWithDetailedAnswer.*').isObject(),
    body('tasksWithDetailedAnswer.*.id').isNumeric(),
    body('tasksWithDetailedAnswer.*.primaryScore').isNumeric(),
    testController.getTestResult);
