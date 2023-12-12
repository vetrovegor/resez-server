import { Router } from "express";
import { body } from "express-validator";

import { accessTokenMiddleware } from "../middlewares/access-token-middleware.js";
import { refreshTokenMiddleware } from "../middlewares/refresh-token-middleware.js";
import authController from "../controllers/auth-controller.js";

export const authRouter = new Router();

authRouter.post(
    "/register",
    body("nickname").matches(/^[a-zA-Z0-9_]{3,20}$/),
    body("password").isLength({ min: 8, max: 32 }),
    authController.register
);

authRouter.post(
    "/login",
    body("nickname").matches(/^[a-zA-Z0-9_]{3,20}$/),
    body("password").isLength({ min: 8, max: 32 }),
    authController.login
);

authRouter.get("/logout", refreshTokenMiddleware, authController.logout);

authRouter.get("/refresh", refreshTokenMiddleware, authController.refresh);

authRouter.get(
    "/check-auth",
    accessTokenMiddleware,
    refreshTokenMiddleware,
    authController.checkAuth
);

authRouter.post('/send-recovery-password-code',
    body('phoneNumber').matches(/^\+7\d{10}$/),
    authController.sendRecoveryPasswordCode);

authRouter.post('/verify-recovery-password-code',
    body('phoneNumber').matches(/^\+7\d{10}$/),
    body('code').matches(/^[0-9]{6}$/),
    phoneNumberMiddleware,
    telegramMiddleware,
    authController.verifyRecoveryPasswordCode);

authRouter.put('/recovery-password',
    body('phoneNumber').matches(/^\+7\d{10}$/),
    body('code').matches(/^[0-9]{6}$/),
    body('password').isLength({ min: 8, max: 32 }),
    phoneNumberMiddleware,
    telegramMiddleware,
    authController.recoveryPassword);
