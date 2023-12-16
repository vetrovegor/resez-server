import { PERMISSIONS } from "../consts/PERMISSIONS.js";
import { ApiError } from "../errors/api-error.js";
import userService from "../services/user-service.js";

export const officialTestMiddleware = async (req, res, next) => {
    try {
        const { isOfficial } = req.body;
        const { id: userId } = req.user;

        if (isOfficial) {
            const permissions = await userService.getUserPermissions(userId);

            if (!permissions.some(permission => permission.permission == PERMISSIONS.CREATE_OFFICIAL_TESTS)) {
                return next(ApiError.forbidden());
            }
        }

        return next();
    } catch (e) {
        console.log(e);
        return next(ApiError.badRequest('Непредвиденная ошибка'));
    }
}
