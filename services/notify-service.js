import { Op } from "sequelize";
import { NotifyDto } from "../dto/notify-dto.js";
import { ApiError } from "../errors/api-error.js";
import { Notify, NotifyType, UserNotify } from "../model/model.js";
import notifyTypeService from "./notify-type-service.js";
import userService from "./user-service.js";
import socketService from "./socket-service.js";
import { EVENT_TYPES } from "../consts/EVENT-TYPES.js";
import { NOTIFY_TYPES } from "../consts/NOTIFY-TYPES.js";
import logService from "./log-service.js";
import { PaginationDto } from "../dto/pagination-dto.js";

class NotifyService {
    async createNotifyDto(userNotify) {
        const { notifyId, date, isRead } = userNotify;
        const notify = await Notify.findByPk(notifyId);
        const { title, content, sender, notifyTypeId } = notify;
        const notifyType = await notifyTypeService.getNotifyTypeById(notifyTypeId);
        const { type } = notifyType;

        return new NotifyDto(notifyId, title, sender, date, content, type, isRead);
    }

    async createSessionNotify(title, session) {
        const { userId, ip, platform, browser, country, city } = session;
        const location = country && city ? `${country}, ${city}` : country ? country : city ? city : "неопределено";

        const content = `<p>Устройство: ${ip}, ${platform ? `${platform},` : ""} ${browser}.</p><p>Местоположение: ${location}.</p>`;

        const sessionNotifyType = await notifyTypeService.getNotifyTypeByType(NOTIFY_TYPES.SESSION);
        const { id: notifyTypeId } = sessionNotifyType;

        const notify = await Notify.create({ title, content, notifyTypeId });
        const { id: notifyId } = notify;
        const userNotify = await UserNotify.create({ userId, notifyId, date: Date.now() });
        const userNotifyDto = await this.createNotifyDto(userNotify);

        socketService.emitToRoom(
            userId,
            EVENT_TYPES.NOTIFY,
            { notify: userNotifyDto }
        );

        return notify;
    }

    async sendNotify(userId, notifyId, date, isSent) {
        return await UserNotify.create({ userId, notifyId, date, isSent });
    }

    async sendNotifyToUsers(req, title, sender, userIDs, date, content, notifyTypeId) {
        const currentDate = new Date();

        if (date && new Date(date) < currentDate) {
            throw ApiError.badRequest('Некорректная дата');
        }

        if (!date) {
            date = currentDate;
        }

        await userService.validateUserIDs(userIDs);

        let notifyType;
        let notifyTypeData;

        if (!notifyTypeId) {
            notifyTypeData = await notifyTypeService.getNotifyTypeByType(NOTIFY_TYPES.INFO);
        } else {
            notifyTypeData = await notifyTypeService.getNotifyTypeById(notifyTypeId);

            if (!notifyTypeData) {
                throw ApiError.badRequest('Некорректный тип уведомления');
            }
        }

        notifyTypeId = notifyTypeData.id;
        notifyType = notifyTypeData.type;

        const notify = await Notify.create({ title, content, sender, notifyTypeId });
        const { id: notifyId } = notify;

        if (!userIDs.length) {
            const allUserIDs = await userService.getAllUserIDs();
            userIDs = allUserIDs.map(({ id }) => id);
        }

        const delay = new Date(date) - new Date();
        const isSent = delay <= 0;

        for (const userId of userIDs) {
            await this.sendNotify(userId, notifyId, date, isSent);

            if (isSent) {
                const userNotifyDto = new NotifyDto(notifyId, title, sender, date, content, notifyType, false);

                socketService.emitToRoom(
                    userId,
                    EVENT_TYPES.NOTIFY,
                    { notify: userNotifyDto }
                );
            }
        }

        await logService.createNotifyLogEntry(req);

        return notify;
    }
}

export default new NotifyService();