import { DataTypes } from "sequelize";

import { sequelize } from "./connection.js";

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nickname: { type: DataTypes.STRING },
    phoneNumber: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING },
    telegramChatId: { type: DataTypes.STRING },
    isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
    isBlocked: { type: DataTypes.BOOLEAN, defaultValue: false },
    level: { type: DataTypes.INTEGER, defaultValue: 0 },
    xp: { type: DataTypes.INTEGER, defaultValue: 0 },
    activeStatusId: { type: DataTypes.INTEGER },
    avatar: { type: DataTypes.STRING },
    level: { type: DataTypes.INTEGER, defaultValue: 1 },
    firstName: { type: DataTypes.STRING },
    lastName: { type: DataTypes.STRING },
    birthDate: { type: DataTypes.DATE },
    gender: { type: DataTypes.STRING },
    registrationDate: { type: DataTypes.DATE },
    isPrivateAccount: { type: DataTypes.BOOLEAN, defaultValue: false },
    isShowAvatars: { type: DataTypes.BOOLEAN, defaultValue: false },
    isTrainingPageTourCompleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    isTestsPageTourCompleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    isMessengerPageTourCompleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    isHelpfulPageTourCompleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    isShopPageTourCompleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    isAchievementsPageTourCompleted: { type: DataTypes.BOOLEAN, defaultValue: false }
});

const Token = sequelize.define('token', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    token: { type: DataTypes.STRING }
});

const Session = sequelize.define('session', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    date: { type: DataTypes.DATE },
    expiredDate: { type: DataTypes.DATE },
    ip: { type: DataTypes.STRING },
    deviceType: { type: DataTypes.STRING },
    country: { type: DataTypes.STRING },
    city: { type: DataTypes.STRING },
    browser: { type: DataTypes.STRING },
    browserVersion: { type: DataTypes.STRING },
    os: { type: DataTypes.STRING },
    platform: { type: DataTypes.STRING },
    isBot: { type: DataTypes.STRING }
});

User.hasMany(Session);
Session.belongsTo(User);

Token.hasMany(Session);
Session.belongsTo(Token);

export {
    User,
    Token,
    Session
}