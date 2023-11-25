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
}

export default new AuthService();