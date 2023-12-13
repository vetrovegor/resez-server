import { Op } from "sequelize";

import { NOTIFY_TYPES } from "../consts/NOTIFY-TYPES.js";
import { NotifyType } from "../model/model.js";

class NotifyTypeService {
    async bulkCreateNotifyTypes() {
        const initialNotifyTypes = Object.entries(
            NOTIFY_TYPES).map(([key, value]) => value);

        initialNotifyTypes.forEach(async (type) => {
            const existedNotifyType = await NotifyType.findOne({
                where: {
                    type
                }
            });

            if (!existedNotifyType) {
                await NotifyType.create({
                    type
                });
            }
        });

        return await NotifyType.destroy({
            where: {
                type: {
                    [Op.notIn]: initialNotifyTypes
                }
            }
        });
    }

    async getNotifyTypes() {
        return await NotifyType.findAll();
    }

    async getNotifyTypeByType(type) {
        return await NotifyType.findOne({ where: { type } });
    }

    async getNotifyTypeById(id) {
        return await NotifyType.findByPk(id);
    }
}

export default new NotifyTypeService();