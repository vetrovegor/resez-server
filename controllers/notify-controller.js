import { validationResult } from "express-validator";

import notifyService from "../services/notify-service.js";
import { ApiError } from "../errors/api-error.js";
import notifyTypeService from "../services/notify-type-service.js";

class NotifyController {
    async sendNotifyToUsers(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('Ошибка валидации', errors.array()));
            }

            const { title, sender, userIDs, date, content, notifyTypeId } = req.body;

            const notify = await notifyService.sendNotifyToUsers(
                req,
                title,
                sender,
                userIDs,
                date,
                content,
                notifyTypeId
            );

            res.json({ notify });
        } catch (e) {
            next(e);
        }
    }

    async getNotifyTypes(req, res, next) {
        try {
            const notifyTypes = await notifyTypeService.getNotifyTypes();
            res.json({ notifyTypes });
        } catch (e) {
            next(e);
        }
    }
}

export default new NotifyController();