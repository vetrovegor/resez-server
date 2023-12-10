import { validationResult } from "express-validator";

import roleService from "../services/role-service.js";
import { ApiError } from "../errors/api-error.js";

class RoleController {
    async getRoles(req, res, next) {
        try {
            const { limit, offset } = req.query;
            const response = await roleService.getRoles(limit, offset);
            res.json(response);
        } catch (e) {
            next(e);
        }
    }

    async getRoleById(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('Ошибка валидации', errors.array()));
            }

            const { id: roleId } = req.params;

            const role = await roleService.getRoleById(roleId);

            res.json({ role });
        } catch (e) {
            next(e);
        }
    }

    async createRole(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('Ошибка валидации', errors.array()));
            }

            const { role, permissions, textColor, backgroundColor } = req.body;

            const roleDto = await roleService.createRole(
                req,
                role,
                permissions,
                textColor,
                backgroundColor
            );

            res.json({ role: roleDto });
        } catch (e) {
            next(e);
        }
    }

    async updateRoleById(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('Ошибка валидации', errors.array()));
            }

            const { id: roleId, role, permissions, textColor, backgroundColor } = req.body;

            const updatedRole = await roleService.updateRoleById(
                req,
                roleId,
                role,
                permissions,
                textColor,
                backgroundColor
            );

            res.json({ role: updatedRole });
        } catch (e) {
            next(e);
        }
    }

    async deleteRoleById(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('Ошибка валидации', errors.array()));
            }

            const { id: roleId } = req.params;
            
            const role = await roleService.deleteRoleById(req, roleId);

            res.json({ role });
        } catch (e) {
            next(e);
        }
    }

    async addRoleToUser(req, res, next) {
        try {
            const { userId, roleId } = req.body;

            const response = await roleService.addRoleToUser(userId, roleId);

            res.json(response);
        } catch (e) {
            next(e);
        }
    }

    async addFullRoleToUser(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('Ошибка валидации', errors.array()));
            }

            const { nickname, role, textColor, backgroundColor } = req.body;

            const response = await roleService.addFullRoleToUser(nickname, role, textColor, backgroundColor);

            res.json(response);
        } catch (e) {
            next(e);
        }
    }
}

export default new RoleController();