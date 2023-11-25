import 'dotenv/config';

import { User } from '../db/models.js';
import { UserShortInfo } from '../dto/user/user-short-info.js';
import sessionService from './session-service.js';

class UserService {
    async getShortInfo(req, userId) {
        const { id: sessionId } = await sessionService.findCurrentSession(req, userId);

        const user = await this.getUserById(userId);
        const userShortInfo = await this.createUserShortInfo(user);
        // убрать
        userShortInfo.status = 'Новечок';

        return {
            sessionId,
            user: userShortInfo
        };
    }

    async getUserById(userId) {
        return await User.findByPk(userId);
    }

    async findUserByField(field, value) {
        const user = await User.findOne({ where: { [field]: value } });

        if (!user) {
            return null;
        }

        return user;
    }

    async createUser(nickname, password) {
        const user = await User.create({ nickname, password, registrationDate: Date.now() });

        if (!user) {
            return null;
        }

        return user;
    }

    async createUserShortInfo(user) {
        return new UserShortInfo(user);
    }

    async getUserBlockStatusById(userId) {
        const user = await this.getUserById(userId);
        return user.isBlocked;
    }
}

export default new UserService();