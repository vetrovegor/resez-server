import { validationResult } from "express-validator";
import 'dotenv/config';

import { ApiError } from "../errors/api-error.js";
import userService from "../services/user-service.js";
import codeService from "../services/code-service.js";

class UserController {
    
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

}

export default new UserController();
