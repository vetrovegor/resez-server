import { validationResult } from "express-validator";

import scoreConversionService from "../../services/education/score-conversion-service.js";
import { ApiError } from "../../errors/api-error.js";

class ScoreConversionController {
    async saveScoreConversion(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('Ошибка валидации', errors.array()));
            }

            const { subjectId, scoreConversion } = req.body;

            await scoreConversionService.saveScoreConversion(subjectId, scoreConversion);

            res.status(200).send();
        } catch (e) {
            next(e);
        }
    }

    async getScoreInfoBySubjectId(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('Ошибка валидации', errors.array()));
            }

            const { id } = req.params;

            const response = await scoreConversionService.getScoreInfoBySubjectId(id);

            res.json(response);
        } catch (e) {
            next(e);
        }
    }

    async getScoreConversionBySubjectId(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('Ошибка валидации', errors.array()));
            }

            const { id } = req.params;

            const scoreConversion = await scoreConversionService.getScoreConversionBySubjectId(id);

            res.json({ scoreConversion });
        } catch (e) {
            next(e);
        }
    }
}

export default new ScoreConversionController();