import { Router } from "express";
import { body } from "express-validator";

import userController from "../controllers/user-controller.js";
import { accessTokenMiddleware } from "../middlewares/access-token-middleware.js";
import { blockedMiddleware } from "../middlewares/blocked-middleware.js";
import { verifiedMiddleware } from "../middlewares/verified-middleware.js";
import { imageMiddleware } from "../middlewares/image-middleware.js";
import { limiter } from "../middlewares/limiter-middleware.js";
import { fileMiddleware } from "../middlewares/file-middleware.js";

export const userRouter = new Router();

userRouter.get('/short-info',
    accessTokenMiddleware,
    userController.getShortInfo);

userRouter.post('/send-change-password-code',
    body('oldPassword').isLength({ min: 8, max: 32 }),
    body('newPassword').isLength({ min: 8, max: 32 }),
    accessTokenMiddleware,
    blockedMiddleware,
    verifiedMiddleware,
    userController.sendChangePasswordCode);

userRouter.put('/verify-change-password-code',
    body('oldPassword').isLength({ min: 8, max: 32 }),
    body('newPassword').isLength({ min: 8, max: 32 }),
    body('code').matches(/^[0-9]{6}$/),
    accessTokenMiddleware,
    blockedMiddleware,
    verifiedMiddleware,
    userController.verifyChangePasswordCode);

userRouter.put('/set-avatar',
    accessTokenMiddleware,
    blockedMiddleware,
    telegramMiddleware,
    verifiedMiddleware,
    fileMiddleware(2),
    imageMiddleware,
    userController.setAvatar);

userRouter.put('/delete-avatar',
    accessTokenMiddleware,
    blockedMiddleware,
    telegramMiddleware,
    verifiedMiddleware,
    userController.deleteAvatar);

userRouter.get('/profile-info',
    limiter,
    accessTokenMiddleware,
    blockedMiddleware,
    userController.getProfileInfo);

userRouter.put('/update-profile',
    limiter,
    accessTokenMiddleware,
    blockedMiddleware,
    userController.updateProfile);