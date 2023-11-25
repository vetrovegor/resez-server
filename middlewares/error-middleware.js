import { ApiError } from "../errors/api-error.js";

export const errorMiddleWare = (err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.status).json({ error: true, message: err.message, errors: err.errors });
    }

    console.log(err);
    return res.status(500).json({ error: true, message: 'Непредвиденная ошибка' });
}