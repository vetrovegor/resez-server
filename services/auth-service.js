import bcrypt from 'bcrypt';
import 'dotenv/config';

import { ApiError } from '../errors/api-error.js';
import userService from './user-service.js';
import sessionService from './session-service.js';
import { UserTokenInfo } from '../dto/user/user-token-info.js';

class AuthService {
    async register(req, nickname, password) {
        const nicknameCandidate = await userService.findUserByField('nickname', nickname);

        if (nicknameCandidate) {
            throw ApiError.badRequest(`Пользователь с таким никнеймом уже существует`);
        }

        const hashPassword = await bcrypt.hash(password, 3);
        const user = await userService.createUser(nickname, hashPassword);

        const userTokenInfo = new UserTokenInfo(user);
        const authData = await sessionService.saveSession(req, userTokenInfo, false);

        const userShortInfo = await userService.createUserShortInfo(user);
        // убрать
        userShortInfo.status = 'Новечок';

        return {
            ...authData,
            user: userShortInfo
        }
    }

    async login(req, nickname, password) {
        const user = await userService.findUserByField('nickname', nickname);

        if (!user) {
            throw ApiError.badRequest('Неверное имя пользователя или пароль');
        }

        const comparePassword = await bcrypt.compare(password, user.password);

        if (!comparePassword) {
            throw ApiError.badRequest('Неверное имя пользователя или пароль');
        }

        const userTokenInfo = new UserTokenInfo(user);
        const authData = await sessionService.saveSession(req, userTokenInfo);

        const userShortInfo = await userService.createUserShortInfo(user);
        // убрать
        userShortInfo.status = 'Новечок';

        return {
            ...authData,
            user: userShortInfo
        }
    }

    async updatePassword(id, password) {
        const hashPassword = await bcrypt.hash(password, 3);

        const user = await User.findOne({ where: { id } });
        user.password = hashPassword;
        return await user.save();
    }

    async recoveryPassword(userId, code, password) {
        const codeData = await codeService.validateCode(userId, code, process.env.RECOVERY_CODE_TYPE);

        if (!codeData) {
            throw ApiError.badRequest('Код истек');
        }

        const { id: codeId } = codeData;
        codeService.deleteCodeById(codeId);

        await userService.updatePassword(userId, password);

        await logService.createRecoveryPasswordLogEntry(userId);

        return { error: false, message: 'Успешно' };
    }
}

export default new AuthService();