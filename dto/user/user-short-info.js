import 'dotenv/config';

export class UserShortInfo {
    constructor(model) {
        this.id = model.id;
        this.nickname = model.nickname;
        this.phoneNumber = model.phoneNumber;
        this.isVerified = model.isVerified;
        this.isBlocked = model.isBlocked;
        this.avatar = model.avatar ? `${process.env.STATIC_URL}/${model.avatar}` : null;
        this.status = model.status;
        this.level = model.level;
    }
}