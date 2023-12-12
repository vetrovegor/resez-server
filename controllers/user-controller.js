import { validationResult } from "express-validator";
import 'dotenv/config';

import { ApiError } from "../errors/api-error.js";
import userService from "../services/user-service.js";
import codeService from "../services/code-service.js";

class UserController {
    async getShortInfo(req, res, next) {
        try {
            const { id: userId } = req.user;

            const userData = await userService.getShortInfo(req, userId);

            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async getUsers(req, res, next) {
        try {
            const { limit, offset, search, isShortInfo } = req.query;

            const users = await userService.getUsers(limit, offset, search, isShortInfo);

            res.json(users);
        } catch (e) {
            next(e);
        }
    }

    async block(req, res, next) {
        try {
            const { id: adminId } = req.user;
            const { userId } = req.body;

            const user = await userService.setUserBlockStatus(req, adminId, userId, true);

            res.json({ user });
        } catch (e) {
            next(e);
        }
    }

    async unblock(req, res, next) {
        try {
            const { id: adminId } = req.user;
            const { userId } = req.body;

            const user = await userService.setUserBlockStatus(req, adminId, userId, false);

            res.json({ user });
        } catch (e) {
            next(e);
        }
    }

    async sendChangePasswordCode(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('Ошибка валидации', errors.array()));
            }

            const { id } = req.user;
            const { telegramChatId } = req;
            const { oldPassword } = req.body;

            const response = await codeService.sendChangePasswordCode(id, telegramChatId, oldPassword);

            return res.json(response);
        } catch (e) {
            next(e);
        }
    }

    async verifyChangePasswordCode(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('Ошибка валидации', errors.array()));
            }

            const { id } = req.user;
            const { code, oldPassword, newPassword } = req.body;

            const response = await userService.changePassword(req, id, code, oldPassword, newPassword);

            return res.json(response);
        } catch (e) {
            next(e);
        }
    }

    async setAvatar(req, res, next) {
        try {
            const { avatar } = req.files;
            const { id } = req.user;

            const user = await userService.setAvatar(id, avatar);

            res.json({ user });
        } catch (e) {
            next(e);
        }
    }

    async deleteAvatar(req, res, next) {
        try {
            const { id } = req.user;

            const user = await userService.deleteAvatar(id);

            res.json({ user });
        } catch (e) {
            next(e);
        }
    }

    async getProfileInfo(req, res, next) {
        try {
            const { id: userId } = req.user;
            const user = await userService.getProfileInfo(userId);
            res.json({ user });
        } catch (e) {
            next(e);
        }
    }

    async updateProfile(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('Ошибка валидации', errors.array()));
            }

            const { id: userId } = req.user;
            const { firstName, lastName, birthDate, gender } = req.body;

            const user = await userService.updateProfile(userId, firstName, lastName, birthDate, gender);

            res.json({ user });
        } catch (e) {
            next(e);
        }
    }
}

export default new UserController();
