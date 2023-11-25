import { UserTokenInfo } from "../dto/user/user-token-info.js";
import { ApiError } from "../errors/api-error.js";
import tokenService from "../services/token-service.js";

export const accessTokenMiddleware = async (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader) {
            return next(ApiError.unauthorizedError());
        }

        const bearer = authorizationHeader.split(' ')[0];
        const accessToken = authorizationHeader.split(' ')[1];

        if (bearer != 'Bearer' || !accessToken) {
            return next(ApiError.unauthorizedError());
        }

        const userData = tokenService.validateAccessToken(accessToken);

        if (!userData) {
            return next(ApiError.unauthorizedError());
        }

        const userTokenInfo = new UserTokenInfo(userData);

        req.user = { ...userTokenInfo };

        next();
    } catch (e) {
        return next(ApiError.unauthorizedError());
    }
}