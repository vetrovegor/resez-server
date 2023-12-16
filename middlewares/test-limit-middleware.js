import 'dotenv/config';

import { ApiError } from "../errors/api-error.js";
import testService from "../services/education/test-service.js";

export const testLimitMiddleware = async (req, res, next) => {
    const { id } = req.user;

    const testsCount = await testService.getTestsCountByUserId(id);

    if (testsCount >= process.env.MAX_TESTS_PER_USER) {
        return next(ApiError.badRequest(`Превышено максимальное количество тестов (${process.env.MAX_TESTS_PER_USER})`));
    }

    next();
}
