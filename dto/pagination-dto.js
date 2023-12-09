export class PaginationDto {
    constructor(elementsProperty, elements, totalCount, limit, offset) {
        this[elementsProperty] = elements;
        this.totalCount = totalCount;
        this.isLast = totalCount <= offset + limit;
        this.elementsCount = elements.length;
    }
}
