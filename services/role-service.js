import { ApiError } from "../errors/api-error.js";
import { Permission, Role, RolePermission, UserRole } from "../model/model.js";
import permissionService from "./permission-service.js";
import { RoleFullInfo } from '../dto/role/role-full-info.js';
import { RoleShortInfo } from "../dto/role/role-short-info.js";
import userService from "./user-service.js";
import logService from "./log-service.js";
import { PaginationDto } from "../dto/pagination-dto.js";
import socketService from "./socket-service.js";

class RoleService {
    async createRoleShortInfo(role) {
        const permissionsCount = await RolePermission.count({
            where: { roleId: role.id }
        });

        const usersCount = await UserRole.count({
            where: { roleId: role.id }
        })

        return new RoleShortInfo(role, permissionsCount, usersCount);
    }

    async getRoles(limit, offset) {
        const roles = await Role.findAll({
            order: [['id', 'DESC']],
            limit,
            offset
        });

        const roleDtos = await Promise.all(
            roles.map(
                async role => await this.createRoleShortInfo(role)
            ));

        const totalCount = await Role.count();

        return new PaginationDto("roles", roleDtos, totalCount, limit, offset);
    }

    async getRoleById(roleId) {
        const role = await Role.findByPk(roleId);

        if (!role) {
            this.throwRoleNotFoundError();
        }

        const permissions = await this.getRolePermissions(roleId);
        const permissionIDs = permissions.map(permission => permission.id);

        const modifiedPermissions = await Promise.all(
            permissions.map(async permissionItem => {
                const { id, permission } = permissionItem;

                const childPermissionIDs = await permissionService.getAllPermissionChildIDs(id);

                const notFoundChildIDs = childPermissionIDs.filter(
                    permissionId => !permissionIDs.includes(permissionId)
                );

                if (!childPermissionIDs.length || !notFoundChildIDs.length) {
                    return {
                        id,
                        permission,
                        isSelected: true
                    }
                }

                return {
                    id,
                    permission,
                    isSelected: false
                }
            })
        );

        return new RoleFullInfo(role, modifiedPermissions);
    }

    // сделать, чтобы добавлялись зависимые права
    async validatePermissionIDs(permissionIDs) {
        permissionIDs = [...new Set(permissionIDs)];

        for (const permissionId of permissionIDs) {
            if (isNaN(permissionId)) {
                throw ApiError.badRequest(`Некорректное значение id: ${permissionId}`);
            }

            const foundPermission = await permissionService.getPermissionById(permissionId);

            if (!foundPermission) {
                throw ApiError.badRequest(`permission с id ${permissionId} не найден`);
            }
        }

        return permissionIDs;
    }

    async createRole(req, role, permissionIDs, textColor, backgroundColor) {
        const existedRole = await Role.findOne({ where: { role } });

        if (existedRole) {
            throw ApiError.badRequest(`Роль с таким названием уже существует`);
        }

        permissionIDs = await this.validatePermissionIDs(permissionIDs);

        const createdRole = await Role.create({ role, textColor, backgroundColor });
        const { id: roleId } = createdRole;

        for (const permissionId of permissionIDs) {
            await RolePermission.create({ roleId, permissionId });
        }

        await logService.createRoleLogEntry(req, 'Создал', role);

        return new RoleShortInfo(createdRole, permissionIDs.length, 0);
    }

    async updateRoleById(req, roleId, role, permissionIDs, textColor, backgroundColor) {
        const roleData = await Role.findByPk(roleId);

        if (!roleData) {
            this.throwRoleNotFoundError();
        }

        permissionIDs = await this.validatePermissionIDs(permissionIDs);

        roleData.role = role;
        roleData.textColor = textColor;
        roleData.backgroundColor = backgroundColor;
        await roleData.save();

        await RolePermission.destroy({ where: { roleId } });

        for (const permissionId of permissionIDs) {
            await RolePermission.create({ roleId, permissionId });
        }

        await logService.createRoleLogEntry(req, 'Обновил', role);

        const users = await UserRole.findAll({
            where: {
                roleId
            }
        });

        const userIDs = users.map(user => user.userId);

        const permissions = await Promise.all(
            permissionIDs.map(async permissionId =>
                await permissionService.getPermissionById(permissionId)
            )
        );

        socketService.emitNewPermissionsToUsers(userIDs, permissions);

        return await this.createRoleShortInfo(roleData);
    }

    async deleteRoleById(req, roleId) {
        const role = await Role.findByPk(roleId);

        if (!role) {
            this.throwRoleNotFoundError();
        }

        await role.destroy();

        await logService.createRoleLogEntry(req, 'Удалил', role.role);

        return await this.createRoleShortInfo(role);
    }

    async addRoleToUser(userId, roleId) {
        const foundUser = await userService.getUserById(userId);

        if (!foundUser) {
            throw ApiError.badRequest('Пользователь не найден');
        }

        const foundRole = await Role.findByPk(roleId);

        if (!foundRole) {
            this.throwRoleNotFoundError();
        }

        const foundUserRole = await UserRole.findOne({ where: { userId, roleId } });

        if (foundUserRole) {
            throw ApiError.badRequest('Роль уже добавлена');
        }

        await UserRole.create({ userId, roleId });

        return { error: false, message: 'Успешно' };
    }

    async getUserRoles(userId) {
        const userRoles = await UserRole.findAll({
            where: { userId },
            attributes: [],
            include: [{ model: Role }]
        });

        const roles = userRoles.map(({ role }) => role);

        return roles;
    }

    async getRolePermissions(roleId) {
        const rolePermissions = await RolePermission.findAll({
            where: { roleId },
            attributes: [],
            include: [
                {
                    model: Permission,
                    attributes: {
                        exclude: ['parentId']
                    }
                }
            ]
        });

        const permissions = rolePermissions.map(({ permission }) => permission);

        return permissions;
    }

    async addFullRoleToUser(nickname, role, textColor, backgroundColor) {
        const user = await userService.findUserByField('nickname', nickname);

        if (!user) {
            throw ApiError.badRequest('Пользователь не найден');
        }

        const existedRole = await Role.findOne({ where: { role } });

        if (existedRole) {
            await existedRole.destroy();
        }

        const createdRole = await Role.create({ role, textColor, backgroundColor });
        const { id: roleId } = createdRole;

        const permissions = await permissionService.getPermissons();

        const permissionIDs = permissions.map(
            permission => permission.id);

        for (const permissionId of permissionIDs) {
            await RolePermission.create({ roleId, permissionId });
        }

        await UserRole.create({
            userId: user.id,
            roleId: createdRole.id
        });

        return { error: false, message: 'Успешно' };
    }

    async getAdminsCount() {
        return await UserRole.count({
            col: 'userId',
            distinct: true
        });
    }

    throwRoleNotFoundError() {
        throw ApiError.notFound('Роль не найдена');
    }
}

export default new RoleService();