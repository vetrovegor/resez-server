import { ApiError } from "../errors/api-error.js";
import userService from "../services/user-service.js";

export const permissionMiddleware = (requiredPermission) => {
    return async (req, res, next) => {
        try {
            const { id: userId } = req.user;
            const permissions = await userService.getUserPermissions(userId);

            if (!permissions.some(permission => permission.permission == requiredPermission)) {
                throw ApiError.forbidden();
            }

            next();
        } catch (e) {
            next(e);
        }
    }
}