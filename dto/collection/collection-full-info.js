export class CollectionFullInfo {
    constructor(model, user, QAPairs) {
        this.id = model.id;
        this.collection = model.collection;
        this.pairsCount = QAPairs.length;
        this.description = model.description;
        this.isPrivate = model.isPrivate;
        this.date = model.date;
        this.user = {
            id: user.id,
            nickname: user.nickname,
            avatar: user.avatar
                ? `${process.env.STATIC_URL}/${user.avatar}`
                : null,
        };
        this.QAPairs = QAPairs;
    }
}
