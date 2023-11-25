export class ApiError extends Error {

    constructor(status, message, errors = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static badRequest(message, errors = []) {
        return new ApiError(400, message, errors);
    }

    static unauthorizedError() {
        return new ApiError(401, 'Пользователь не авторизован');
    }

    static blocked() {
        return new ApiError(403, 'Пользователь заблокирован');
    }

    static forbidden() {
        return new ApiError(403, 'Нет доступа');
    }

    static notFound(message, errors = []) {
        return new ApiError(404, message, errors);
    }

    static tooManyRequests() {
        return new ApiError(429, 'Вы отправили слишком много запросов за последнее время. Пожалуйста, подождите некоторое время.');
    }
}