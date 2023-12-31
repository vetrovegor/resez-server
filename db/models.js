import { DataTypes } from "sequelize";

import { sequelize } from "./connection.js";

const User = sequelize.define("user", {
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
    isTrainingPageTourCompleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    isTestsPageTourCompleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    isMessengerPageTourCompleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    isHelpfulPageTourCompleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    isShopPageTourCompleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    isAchievementsPageTourCompleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
});

const Token = sequelize.define("token", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    token: { type: DataTypes.STRING },
});

const Session = sequelize.define("session", {
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
    isBot: { type: DataTypes.STRING },
});

User.hasMany(Session);
Session.belongsTo(User);

Token.hasMany(Session);
Session.belongsTo(Token);

const Subject = sequelize.define("subject", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    subject: { type: DataTypes.STRING },
    durationMinutes: { type: DataTypes.INTEGER },
    isMark: { type: DataTypes.BOOLEAN },
    isPublished: { type: DataTypes.BOOLEAN },
    isArchive: { type: DataTypes.BOOLEAN, defaultValue: false },
});

const SubjectTask = sequelize.define("subject_task", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    number: { type: DataTypes.INTEGER },
    theme: { type: DataTypes.STRING },
    primaryScore: { type: DataTypes.INTEGER },
    isDetailedAnswer: { type: DataTypes.BOOLEAN },
});

const SubTheme = sequelize.define("sub_theme", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    subTheme: { type: DataTypes.STRING },
});

const Task = sequelize.define("task", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    task: { type: DataTypes.TEXT },
    solution: { type: DataTypes.TEXT },
    answer: { type: DataTypes.STRING },
    isVerified: { type: DataTypes.BOOLEAN },
    date: { type: DataTypes.DATE },
});

const Test = sequelize.define("test", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    isPrivate: { type: DataTypes.BOOLEAN },
    isOfficial: { type: DataTypes.BOOLEAN },
    isExam: { type: DataTypes.BOOLEAN },
    date: { type: DataTypes.DATE },
});

const TestTask = sequelize.define("test_task", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const ScoreConversion = sequelize.define("score_conversion", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    primaryScore: { type: DataTypes.INTEGER },
    secondaryScore: { type: DataTypes.INTEGER },
    minScore: { type: DataTypes.INTEGER },
    maxScore: { type: DataTypes.INTEGER },
    grade: { type: DataTypes.INTEGER },
    isRed: { type: DataTypes.BOOLEAN, defaultValue: false },
    isGreen: { type: DataTypes.BOOLEAN, defaultValue: false },
});

Subject.hasMany(SubjectTask, {
    foreignKey: "subjectId",
    onDelete: "CASCADE",
});
SubjectTask.belongsTo(Subject);

SubjectTask.hasMany(SubTheme, {
    foreignKey: "subjectTaskId",
    onDelete: "CASCADE",
});
SubTheme.belongsTo(SubjectTask);

SubTheme.hasMany(Task, {
    foreignKey: "subThemeId",
    onDelete: "CASCADE",
});
Task.belongsTo(SubTheme);

SubjectTask.hasMany(Task);
Task.belongsTo(SubjectTask);

Subject.hasMany(Task);
Task.belongsTo(Subject);

User.hasMany(Task);
Task.belongsTo(User);

Subject.hasMany(Test, {
    foreignKey: "subjectId",
    onDelete: "CASCADE",
});
Test.belongsTo(Subject);

User.hasMany(Test);
Test.belongsTo(User);

Test.belongsToMany(Task, { through: TestTask });
Task.belongsToMany(Test, { through: TestTask });

Subject.hasMany(ScoreConversion, {
    foreignKey: "subjectId",
    onDelete: "CASCADE",
});
ScoreConversion.belongsTo(Subject);

const Collection = sequelize.define("collection", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    collection: { type: DataTypes.STRING },
    description: { type: DataTypes.TEXT },
    isPrivate: { type: DataTypes.BOOLEAN, defaultValue: false },
    date: { type: DataTypes.DATE },
});

const QA = sequelize.define("QA", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    question: { type: DataTypes.STRING },
    answer: { type: DataTypes.STRING },
});

User.hasMany(Collection);
Collection.belongsTo(User);

Collection.hasMany(QA, {
    foreignKey: "collectionId",
    onDelete: "CASCADE",
});
QA.belongsTo(Collection);

const Role = sequelize.define('role', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    role: { type: DataTypes.STRING },
    textColor: { type: DataTypes.STRING },
    backgroundColor: { type: DataTypes.STRING }
});

const Permission = sequelize.define('permission', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    permission: { type: DataTypes.STRING },
    parentId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'permissions',
            key: 'id'
        }
    }
});

const UserRole = sequelize.define('user_role', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});

const RolePermission = sequelize.define('role_permission', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});

Role.belongsToMany(Permission, { through: RolePermission });
Permission.belongsToMany(Role, { through: RolePermission });

Role.belongsToMany(User, { through: UserRole });
User.belongsToMany(Role, { through: UserRole });

Role.hasMany(UserRole);
UserRole.belongsTo(Role);

Permission.hasMany(RolePermission);
RolePermission.belongsTo(Permission);

const Notify = sequelize.define('notify', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING },
    content: { type: DataTypes.TEXT },
    sender: { type: DataTypes.STRING },
});

const UserNotify = sequelize.define('user_notifies', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
    isSent: { type: DataTypes.BOOLEAN, defaultValue: true },
    date: { type: DataTypes.DATE }
});

const NotifyType = sequelize.define('notify_type', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    type: { type: DataTypes.STRING }
});

Notify.belongsToMany(User, { through: UserNotify });
User.belongsToMany(Notify, { through: UserNotify });

NotifyType.hasMany(Notify);
Notify.belongsTo(NotifyType);

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
    ScoreConversion,
    Collection,
    QA,
    Permission,
    Role,
    UserRole,
    RolePermission,
    Notify,
    UserNotify,
    NotifyType,
};
