import { Router } from "express";
import { body, param } from "express-validator";

import roleController from "../controllers/role-controller.js";
import { accessTokenMiddleware } from "../middlewares/access-token-middleware.js";
import { blockedMiddleware } from "../middlewares/blocked-middleware.js";
import { permissionMiddleware } from "../middlewares/permission-middleware.js";
import { PERMISSIONS } from "../consts/PERMISSIONS.js";
import permissionController from "../controllers/permission-controller.js";
import subjectController from "../controllers/education/subject-controller.js";
import scoreConversionController from "../controllers/education/score-conversion-controller.js";
import notifyController from "../controllers/notify-controller.js";


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

    adminRouter.post('/notify',
    body('title').notEmpty().isLength({ max: 100 }),
    body('userIDs').isArray(),
    body('date').optional().isISO8601(),
    body('content').notEmpty(),
    body('sender').isLength({ max: 30 }),
    accessTokenMiddleware,
    blockedMiddleware,
    permissionMiddleware(PERMISSIONS.NOTIFIES),
    notifyController.sendNotifyToUsers);

adminRouter.get('/notify-type',
    accessTokenMiddleware,
    blockedMiddleware,
    permissionMiddleware(PERMISSIONS.NOTIFIES),
    notifyController.getNotifyTypes);

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

adminRouter.post('/subject',
    body('subject').isString().notEmpty().isLength({ max: 75 }),
    body('subjectTasks').isArray({ min: 1 }),
    body('subjectTasks.*.theme').isString().notEmpty().isLength({ max: 150 }),
    body('subjectTasks.*.primaryScore').isNumeric(),
    body('subjectTasks.*.isDetailedAnswer').isBoolean(),
    body('subjectTasks.*.subThemes').isArray({ min: 1 }),
    body('subjectTasks.*.subThemes.*').isObject(),
    body('subjectTasks.*.subThemes.*.subTheme').isString().notEmpty().isLength({ max: 150 }),
    body('durationMinutes').isNumeric(),
    body('isMark').isBoolean(),
    body('isPublished').isBoolean(),
    subjectTasksMiddleware,
    accessTokenMiddleware,
    blockedMiddleware,
    permissionMiddleware(PERMISSIONS.CREATE_SUBJECTS),
    subjectController.createSubject);

adminRouter.put('/subject',
    body('id').isNumeric(),
    body('subject').isString().notEmpty().isLength({ max: 75 }),
    body('subjectTasks').isArray({ min: 1 }),
    body('subjectTasks.*.id').isNumeric().optional(),
    body('subjectTasks.*.theme').isString().notEmpty().isLength({ max: 75 }),
    body('subjectTasks.*.primaryScore').isNumeric(),
    body('subjectTasks.*.isDetailedAnswer').isBoolean(),
    body('subjectTasks.*.subThemes').isArray({ min: 1 }),
    body('subjectTasks.*.subThemes.*').isObject(),
    body('subjectTasks.*.subThemes.*.id').isNumeric().optional(),
    body('subjectTasks.*.subThemes.*.subTheme').isString().notEmpty().isLength({ max: 75 }),
    body('durationMinutes').isNumeric(),
    body('isMark').isBoolean(),
    body('isPublished').isBoolean(),
    subjectTasksMiddleware,
    accessTokenMiddleware,
    blockedMiddleware,
    permissionMiddleware(PERMISSIONS.UPDATE_SUBJECTS),
    subjectController.updateSubjectById);

adminRouter.get('/subject/:id',
    param('id').isNumeric(),
    accessTokenMiddleware,
    blockedMiddleware,
    permissionMiddleware(PERMISSIONS.SUBJECTS),
    subjectController.getSubjectFullInfo);

adminRouter.delete('/subject/:id',
    param('id').isNumeric(),
    accessTokenMiddleware,
    blockedMiddleware,
    permissionMiddleware(PERMISSIONS.DELETE_SUBJECTS),
    subjectController.deleteSubjectById);

adminRouter.get('/subject',
    accessTokenMiddleware,
    blockedMiddleware,
    permissionMiddleware(PERMISSIONS.SUBJECTS),
    subjectController.getSubjectShortInfoElements);

adminRouter.get('/subject/:id/score-conversion',
    accessTokenMiddleware,
    blockedMiddleware,
    permissionMiddleware(PERMISSIONS.SUBJECTS),
    scoreConversionController.getScoreConversionBySubjectId);

adminRouter.get('/subject/:id/score-conversion',
    accessTokenMiddleware,
    blockedMiddleware,
    permissionMiddleware(PERMISSIONS.SUBJECTS),
    scoreConversionController.getScoreConversionBySubjectId);

adminRouter.post('/score-conversion',
    body('subjectId').isNumeric(),
    body('scoreConversion').isArray({ min: 1 }),
    body('scoreConversion.*.primaryScore').isNumeric().optional(),
    body('scoreConversion.*.secondaryScore').isNumeric().optional(),
    body('scoreConversion.*.minScore').isNumeric().optional(),
    body('scoreConversion.*.maxScore').isNumeric().optional(),
    body('scoreConversion.*.grade').isNumeric().optional(),
    body('scoreConversion.*.isRed').isBoolean(),
    body('scoreConversion.*.isGreen').isBoolean(),
    accessTokenMiddleware,
    blockedMiddleware,
    permissionMiddleware(PERMISSIONS.CREATE_SUBJECTS),
    scoreConversionController.saveScoreConversion);

