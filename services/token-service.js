import jwt from "jsonwebtoken";
import 'dotenv/config';

import { Token } from "../db/models.js";

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION });

        return {
            accessToken: accessToken,
            refreshToken: refreshToken
        }
    }

    async createToken(refreshToken) {
        try {
            const token = await Token.create({ token: refreshToken });

            return token;
        } catch (e) {
            console.log(e);
        }
    }

    async removeTokenById(id) {
        return await Token.destroy({ where: { id } });
    }

    async findTokenByToken(token) {
        const userData = await Token.findOne({ where: { token } });

        return userData;
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

            return userData;
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

            return userData;
        } catch (e) {
            return null;
        }
    }
}

export default new TokenService();