import { validationResult } from "express-validator";
import 'dotenv/config';

import { ApiError } from "../errors/api-error.js";
import authService from "../services/auth-service.js";
import sessionService from "../services/session-service.js";

class AuthController {
    async register(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('Ошибка валидации', errors.array()));
            }

            const { nickname, password } = req.body;

            const response = await authService.register(req, nickname, password);
            const { refreshToken, ...rest } = response;

            res.cookie('refreshToken', refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });

            return res.json(rest);
        } catch (e) {
            next(e);
        }
    }

    async login(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('Ошибка валидации', errors.array()));
            }

            const { nickname, password } = req.body;
            const userData = await authService.login(req, nickname, password);
            const { refreshToken, ...rest } = userData;

            res.cookie('refreshToken', refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });

            return res.json(rest);
        } catch (e) {
            next(e);
        }
    }

    async logout(req, res, next) {
        try {
            const { id } = req.user;

            await sessionService.endCurrentSession(req, id);

            return res.clearCookie('refreshToken')
                .json({ error: false, message: 'Успешно' });
        } catch (e) {
            next(e);
        }
    }

    async refresh(req, res, next) {
        try {
            const tokens = await sessionService.saveSession(req, req.user, false);
            const { refreshToken, accessToken } = tokens;

            res.cookie('refreshToken', refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });

            return res.json({ error: false, message: 'Успешно', accessToken });
        } catch (e) {
            next(e);
        }
    }

    async checkAuth(req, res, next) {
        try {
            const { id: userId } = req.user;
            const { tokenId } = req;
            const changedTokens = await sessionService.checkSession(req, userId, tokenId);

            if (changedTokens) {
                const { refreshToken } = changedTokens;
                res.cookie('refreshToken', refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            }

            return res.json({ error: false, message: "Токен действителен" });
        } catch (e) {
            next(e);
        }
    }

    async sendRecoveryPasswordCode(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('Ошибка валидации', errors.array()));
            }
            const { phoneNumber } = req.body;

            const response = await codeService.sendRecoveryPasswordCode(phoneNumber);

            return res.json(response);
        } catch (e) {
            next(e);
        }
    }

    async verifyRecoveryPasswordCode(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('Ошибка валидации', errors.array()));
            }

            const { id } = req.user;
            const { code } = req.body;

            const response = await codeService.verifyRecoveryPasswordCode(id, code);

            return res.json(response);
        } catch (e) {
            next(e);
        }
    }

    async recoveryPassword(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('Ошибка валидации', errors.array()));
            }

            const { id } = req.user;
            const { code, password } = req.body;

            const response = await authService.recoveryPassword(id, code, password);

            res.json(response);
        } catch (e) {
            next(e);
        }
    }
}

export default new AuthController();