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

const Subject = sequelize.define('subject', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    subject: { type: DataTypes.STRING },
    durationMinutes: { type: DataTypes.INTEGER },
    isMark: { type: DataTypes.BOOLEAN },
    isPublished: { type: DataTypes.BOOLEAN },
    isArchive: { type: DataTypes.BOOLEAN, defaultValue: false }
});

const SubjectTask = sequelize.define('subject_task', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    number: { type: DataTypes.INTEGER },
    theme: { type: DataTypes.STRING },
    primaryScore: { type: DataTypes.INTEGER },
    isDetailedAnswer: { type: DataTypes.BOOLEAN }
});

const SubTheme = sequelize.define('sub_theme', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    subTheme: { type: DataTypes.STRING }
});

const Task = sequelize.define('task', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    task: { type: DataTypes.TEXT },
    solution: { type: DataTypes.TEXT },
    answer: { type: DataTypes.STRING },
    isVerified: { type: DataTypes.BOOLEAN },
    date: { type: DataTypes.DATE }
});

const Test = sequelize.define('test', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    isPrivate: { type: DataTypes.BOOLEAN },
    isOfficial: { type: DataTypes.BOOLEAN },
    isExam: { type: DataTypes.BOOLEAN },
    date: { type: DataTypes.DATE }
});

const TestTask = sequelize.define('test_task', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});

const ScoreConversion = sequelize.define('score_conversion', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    primaryScore: { type: DataTypes.INTEGER },
    secondaryScore: { type: DataTypes.INTEGER },
    minScore: { type: DataTypes.INTEGER },
    maxScore: { type: DataTypes.INTEGER },
    grade: { type: DataTypes.INTEGER },
    isRed: { type: DataTypes.BOOLEAN, defaultValue: false },
    isGreen: { type: DataTypes.BOOLEAN, defaultValue: false }
});

Subject.hasMany(SubjectTask, {
    foreignKey: 'subjectId',
    onDelete: 'CASCADE'
});
SubjectTask.belongsTo(Subject);

SubjectTask.hasMany(SubTheme, {
    foreignKey: 'subjectTaskId',
    onDelete: 'CASCADE'
});
SubTheme.belongsTo(SubjectTask);

SubTheme.hasMany(Task, {
    foreignKey: 'subThemeId',
    onDelete: 'CASCADE'
});
Task.belongsTo(SubTheme);

SubjectTask.hasMany(Task);
Task.belongsTo(SubjectTask);

Subject.hasMany(Task);
Task.belongsTo(Subject);

User.hasMany(Task);
Task.belongsTo(User);

Subject.hasMany(Test, {
    foreignKey: 'subjectId',
    onDelete: 'CASCADE'
});
Test.belongsTo(Subject);

User.hasMany(Test);
Test.belongsTo(User);

Test.belongsToMany(Task, { through: TestTask });
Task.belongsToMany(Test, { through: TestTask });

Subject.hasMany(ScoreConversion, {
    foreignKey: 'subjectId',
    onDelete: 'CASCADE'
});
ScoreConversion.belongsTo(Subject);


export {
    User,
    Token,
    Session,
    Test,
    Subject,
    SubjectTask,
    SubTheme,
    Task,
    TestTask,
    ScoreConversion
}