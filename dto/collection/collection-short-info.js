export class CollectionShortInfo {
    constructor(model, pairsCount, user) {
        this.id = model.id;
        this.collection = model.collection;
        this.pairsCount = pairsCount;
        this.description = model.description;
        this.isPrivate = model.isPrivate;
        this.date = model.date;
        this.user = {
            nickname: user.nickname,
            avatar: user.avatar
                ? `${process.env.STATIC_URL}/${user.avatar}`
                : null,
        };
    }
}
