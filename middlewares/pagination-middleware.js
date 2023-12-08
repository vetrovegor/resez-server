import { ApiError } from "../errors/api-error.js";

export const paginationMiddleware = async (req, res, next) => {
    try {
        let { limit = 5, offset = 0 } = req.query;

        limit = Number(limit);
        offset = Number(offset);

        if (isNaN(limit) || limit < 0) {
            return next(ApiError.badRequest("Некорректное значение limit"));
        }

        if (isNaN(offset) || offset < 0) {
            return next(ApiError.badRequest("Некорректное значение offset"));
        }

        if (limit > 100) {
            return next(ApiError.badRequest("limit должен быть не более 100"));
        }

        req.query.limit = limit;
        req.query.offset = offset;

        return next();
    } catch (e) {
        console.log(e);
        return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
};
