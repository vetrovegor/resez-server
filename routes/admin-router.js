import { Router } from "express";
import { body, param } from "express-validator";

import roleController from "../controllers/role-controller.js";
import { accessTokenMiddleware } from "../middlewares/access-token-middleware.js";
import { blockedMiddleware } from "../middlewares/blocked-middleware.js";
import { permissionMiddleware } from "../middlewares/permission-middleware.js";
import { PERMISSIONS } from "../consts/PERMISSIONS.js";
import permissionController from "../controllers/permission-controller.js";

adminRouter.get('/role',
    paginationMiddleware,
    accessTokenMiddleware,
    blockedMiddleware,
    permissionMiddleware(PERMISSIONS.ROLES),
    roleController.getRoles);

adminRouter.get('/role/:id',
    param('id').isNumeric(),
    accessTokenMiddleware,
    blockedMiddleware,
    permissionMiddleware(PERMISSIONS.ROLES),
    roleController.getRoleById);

adminRouter.post('/role',
    body('role').isLength({ min: 1, max: 30 }),
    body('permissions').isArray({ min: 1 }),
    body('textColor').isHexColor(),
    body('backgroundColor').isHexColor(),
    accessTokenMiddleware,
    blockedMiddleware,
    permissionMiddleware(PERMISSIONS.CREATE_ROLES),
    roleController.createRole);

adminRouter.delete('/role/:id',
    param('id').isNumeric(),
    accessTokenMiddleware,
    blockedMiddleware,
    permissionMiddleware(PERMISSIONS.DELETE_ROLES),
    roleController.deleteRoleById);

adminRouter.put('/role',
    body('role').isLength({ min: 1, max: 30 }),
    body('permissions').isArray({ min: 1 }),
    body('textColor').isHexColor(),
    body('backgroundColor').isHexColor(),
    accessTokenMiddleware,
    blockedMiddleware,
    permissionMiddleware(PERMISSIONS.UPDATE_ROLES),
    roleController.updateRoleById);

adminRouter.get('/permission',
    accessTokenMiddleware,
    blockedMiddleware,
    permissionMiddleware(PERMISSIONS.CREATE_ROLES),
    permissionController.getPermissionsHierarchy);

    // тут дожен быть middleware для проверки, есть ли у пользователя право добавлять роли другим пользователям
adminRouter.post('/role/give',
accessTokenMiddleware,
blockedMiddleware,
roleController.addRoleToUser);

// вспомогательный запрос для выдачи ролей со всеми правами (убрать потом)
adminRouter.post('/role/give-full-role',
body('nickname').notEmpty(),
body('role').notEmpty(),
body('textColor').isHexColor(),
body('backgroundColor').isHexColor(),
// accessTokenMiddleware,
// blockedMiddleware,
roleController.addFullRoleToUser);

adminRouter.get('/user',
limiter,
paginationMiddleware,
accessTokenMiddleware,
blockedMiddleware,
permissionMiddleware(PERMISSIONS.ADMIN),
userController.getUsers);

adminRouter.put('/block',
accessTokenMiddleware,
blockedMiddleware,
permissionMiddleware(PERMISSIONS.BLOCK_USERS),
userController.block);

adminRouter.put('/unblock',
accessTokenMiddleware,
blockedMiddleware,
permissionMiddleware(PERMISSIONS.BLOCK_USERS),
userController.unblock);

