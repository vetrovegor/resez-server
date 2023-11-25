import { ApiError } from '../errors/api-error.js';
import userService from '../services/user-service.js';

export const blockedMiddleware = async (req, res, next) => {
    try {
        const { id } = req.user;

        const isBlocked = await userService.getUserBlockStatusById(id);

        if (isBlocked) {
            return next(ApiError.blocked());
        }

        next();
    } catch (e) {
        console.log(e);
        return next(ApiError.unauthorizedError());
    }
}