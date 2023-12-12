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

    async getUsers(limit, offset, search, isShortInfo) {
        const whereOptions = {};
        const orderOptions = [['registrationDate', 'DESC']];

        if (search) {
            const numberSearch = Number(search);
            const searchCondition = {
                [Op.or]: [
                    { nickname: { [Op.iLike]: `%${search}%` } },
                    { firstName: { [Op.iLike]: `%${search}%` } },
                    { lastName: { [Op.iLike]: `%${search}%` } },
                ],
            };

            if (!isNaN(numberSearch)) {
                searchCondition[Op.or].push({ id: numberSearch });
                orderOptions.unshift([sequelize.literal(`CASE WHEN id = ${numberSearch} THEN 1 ELSE 2 END`), 'ASC']);
            }

            whereOptions[Op.and] = [searchCondition];
        }

        isShortInfo = isShortInfo && isShortInfo.toLowerCase() == 'true';

        const users = await User.findAll({
            where: whereOptions,
            order: orderOptions,
            limit,
            offset
        });

        const usersDtos = await Promise.all(
            users.map(async user =>
                isShortInfo
                    ? new UserSearchDto(user)
                    : await this.createUserAdminInfo(user)
            ));

        const totalCount = await User.count();

        return new PaginationDto("users", usersDtos, totalCount, limit, offset);
    }

    async setUserBlockStatus(req, adminId, userId, blockStatus) {
        if (adminId == userId) {
            throw ApiError.badRequest('Нельзя выполнять данное действие на самом себе');
        }

        const user = await User.findByPk(userId);

        if (!user) {
            throw ApiError.badRequest('Пользователь с таким id не найден');
        }

        user.isBlocked = blockStatus;
        await user.save();

        const eventType = blockStatus ? EVENT_TYPES.BLOCKED : EVENT_TYPES.UNBLOCKED;
        socketService.emitToRoom(user.id, eventType);

        await logService.createBlockUnblockLogEntry(req, blockStatus, adminId, userId);

        return await this.createUserAdminInfo(user);
    }

    async changePassword(req, userId, code, oldPassword, newPassword) {
        const isPasswordsMatch = await this.validateUserPassword(userId, oldPassword);

        if (!isPasswordsMatch) {
            throw ApiError.badRequest('Неверный старый пароль');
        }

        if (!codeData) {
            throw ApiError.badRequest('Некорректный код');
        }

        await this.updatePassword(userId, newPassword);

        return { error: false, message: 'Успешно' };
    }

    async setAvatar(userId, avatar) {
        const foundUser = await User.findByPk(userId);
        const { avatar: oldAvatarName } = foundUser;

        if (oldAvatarName) {
            const oldAvatarPath = path.resolve(staticPath, oldAvatarName);
            fs.existsSync(oldAvatarPath) && fs.unlinkSync(oldAvatarPath);
        }

        const avatarExtension = FILE_EXTENSIONS[avatar.mimetype] || '.jpg';
        const avatarName = v4() + avatarExtension;

        avatar.mv(path.resolve(staticPath, avatarName));

        foundUser.avatar = avatarName;
        await foundUser.save();

        const userShortInfo = await this.createUserShortInfo(foundUser);

        return userShortInfo;
    }

    async deleteAvatar(userId) {
        const foundUser = await User.findByPk(userId);
        const { avatar } = foundUser;

        if (avatar) {
            const avatarPath = path.resolve(staticPath, avatar);
            fs.existsSync(avatarPath) && fs.unlinkSync(avatarPath);
        }

        foundUser.avatar = null;
        await foundUser.save();

        const userShortInfo = await this.createUserShortInfo(foundUser);

        return userShortInfo;
    }

    async getProfileInfo(userId) {
        const user = await this.getUserById(userId);
        return new UserProfileInfo(user);
    }

    async updateProfile(userId, firstName, lastName, birthDate, gender) {
        const firstNameLength = firstName.length;
        const lastNameLength = lastName.length;

        if (firstNameLength && (firstNameLength < 2 || firstNameLength > 20)) {
            throw ApiError.badRequest('Имя должно содержать от 2 до 20 символов')
        }

        if (lastNameLength && (lastNameLength < 2 || lastNameLength > 30)) {
            throw ApiError.badRequest('Фамилия должна содержать от 2 до 30 символов')
        }

        if (birthDate && isNaN(Date.parse(birthDate))) {
            throw ApiError.badRequest('Некорректная дата рождения');
        }

        const user = await User.findByPk(userId);

        user.firstName = firstName;
        user.lastName = lastName;
        user.birthDate = birthDate;
        user.gender = gender;

        await user.save();

        return new UserProfileInfo(user);
    }
}

export default new UserService();