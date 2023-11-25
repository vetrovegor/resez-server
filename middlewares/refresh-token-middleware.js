import { UserTokenInfo } from "../dto/user/user-token-info.js";
import { ApiError } from "../errors/api-error.js";
import tokenService from "../services/token-service.js";

export const refreshTokenMiddleware = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            return next(ApiError.unauthorizedError());
        }

        const userData = tokenService.validateRefreshToken(refreshToken);
        const foundToken = await tokenService.findTokenByToken(refreshToken);

        if (!userData || !foundToken) {
            return next(ApiError.unauthorizedError());
        }

        const userTokenInfo = new UserTokenInfo(userData);
        const { id: tokenId } = foundToken;

        req.user = { ...userTokenInfo };
        req.tokenId = tokenId;

        next();
    } catch (e) {
        return next(ApiError.unauthorizedError());
    }
}