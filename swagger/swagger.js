export const swaggerDocument = {
    swagger: "2.0",
    info: {
        title: "Resez API",
        version: "1.0.0",
    },
    basePath: "/api",
    paths: {
        "/health": {
            get: {
                summary: "Check health status",
                tags: ["Общее"],
                responses: {
                    200: {
                        description: "OK",
                        schema: {
                            type: "boolean",
                            example: true,
                        },
                    },
                },
            },
        },
        "/auth/register": {
            post: {
                summary: "Register a new user",
                tags: ["Авторизация"],
                parameters: [
                    {
                        name: "body",
                        in: "body",
                        description: "User credentials",
                        required: true,
                        schema: {
                            type: "object",
                            properties: {
                                nickname: {
                                    type: "string",
                                    example: "l4ndar",
                                },
                                password: {
                                    type: "string",
                                    example: "123123123",
                                },
                            },
                        },
                    },
                ],
                responses: {
                    200: {
                        description: "OK",
                        schema: {
                            type: "object",
                            properties: {
                                accessToken: {
                                    type: "string",
                                    example:
                                        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmlja25hbWUiOiJsNG5kYXIiLCJpYXQiOjE3MDMyMzA3MzEsImV4cCI6ODgxMDMyMzA3MzF9.61di9FknZYx2pUbLegPwR83ioa83ZooJbe_pVaJMcaw",
                                },
                                sessionId: {
                                    type: "number",
                                    example: 1,
                                },
                                user: {
                                    type: "object",
                                    properties: {
                                        id: {
                                            type: "number",
                                            example: 1,
                                        },
                                        nickname: {
                                            type: "string",
                                            example: "l4ndar",
                                        },
                                        isVerified: {
                                            type: "boolean",
                                            example: true,
                                        },
                                        isBlocked: {
                                            type: "boolean",
                                            example: false,
                                        },
                                        avatar: {
                                            type: "string",
                                            example: null,
                                        },
                                        status: {
                                            type: "string",
                                            example: "Новечок",
                                        },
                                    },
                                },
                            },
                        },
                    },
                    400: {
                        description: "Bad Request",
                        schema: {
                            type: "object",
                            properties: {
                                error: {
                                    type: "boolean",
                                    example: true,
                                },
                                message: {
                                    type: "string",
                                    example:
                                        "Пользователь с таким никнеймом уже существует",
                                },
                                errors: {
                                    type: "array",
                                    items: {
                                        type: "string",
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        "/auth/login": {
            post: {
                summary: "Login with user credentials",
                tags: ["Авторизация"],
                parameters: [
                    {
                        name: "body",
                        in: "body",
                        description: "User credentials",
                        required: true,
                        schema: {
                            type: "object",
                            properties: {
                                nickname: {
                                    type: "string",
                                    example: "l4ndar",
                                },
                                password: {
                                    type: "string",
                                    example: "123123123",
                                },
                            },
                        },
                    },
                ],
                responses: {
                    200: {
                        description: "OK",
                        schema: {
                            type: "object",
                            properties: {
                                accessToken: {
                                    type: "string",
                                    example:
                                        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmlja25hbWUiOiJsNG5kYXIiLCJpYXQiOjE3MDMyMzIyMDksImV4cCI6ODgxMDMyMzIyMDl9.va2peTuuBBmdFA49AP1fWPRVy0YETU__kqXNA19LPJc",
                                },
                                sessionId: {
                                    type: "number",
                                    example: 1,
                                },
                                user: {
                                    type: "object",
                                    properties: {
                                        id: {
                                            type: "number",
                                            example: 1,
                                        },
                                        nickname: {
                                            type: "string",
                                            example: "l4ndar",
                                        },
                                        isVerified: {
                                            type: "boolean",
                                            example: true,
                                        },
                                        isBlocked: {
                                            type: "boolean",
                                            example: false,
                                        },
                                        avatar: {
                                            type: "string",
                                            example: null,
                                        },
                                        status: {
                                            type: "string",
                                            example: "Новечок",
                                        },
                                        level: {
                                            type: "number",
                                            example: 1,
                                        },
                                        unreadNotifiesCount: {
                                            type: "number",
                                            example: 0,
                                        },
                                        permissions: {
                                            type: "array",
                                            items: {
                                                type: "string",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    400: {
                        description: "Bad Request",
                        schema: {
                            type: "object",
                            properties: {
                                error: {
                                    type: "boolean",
                                    example: true,
                                },
                                message: {
                                    type: "string",
                                    example:
                                        "Неверное имя пользователя или пароль",
                                },
                                errors: {
                                    type: "array",
                                    items: {
                                        type: "string",
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        "/auth/logout": {
            get: {
                summary: "Logout user",
                tags: ["Авторизация"],
                responses: {
                    200: {
                        description: "OK",
                        schema: {
                            type: "object",
                            properties: {
                                error: {
                                    type: "boolean",
                                    example: false,
                                },
                                message: {
                                    type: "string",
                                    example: "Успешно",
                                },
                            },
                        },
                    },
                },
            },
        },
        "/auth/refresh": {
            get: {
                summary: "Refresh access token",
                tags: ["Авторизация"],
                responses: {
                    200: {
                        description: "OK",
                        schema: {
                            type: "object",
                            properties: {
                                error: {
                                    type: "boolean",
                                    example: false,
                                },
                                message: {
                                    type: "string",
                                    example: "Успешно",
                                },
                                accessToken: {
                                    type: "string",
                                    example:
                                        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmlja25hbWUiOiJsNG5kYXIiLCJpYXQiOjE3MDMyMzI4ODgsImV4cCI6ODgxMDMyMzI4ODh9.vJOg6vdxU3obkohmYH4kMxFu_wH5GbIb_NrWF7wuGRc",
                                },
                            },
                        },
                    },
                    401: {
                        description: "Unauthorized",
                        schema: {
                            type: "object",
                            properties: {
                                error: {
                                    type: "boolean",
                                    example: true,
                                },
                                message: {
                                    type: "string",
                                    example: "Пользователь не авторизован",
                                },
                                errors: {
                                    type: "array",
                                    items: {
                                        type: "string",
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        "/auth/check-auth": {
            get: {
                summary: "Check user authentication",
                tags: ["Авторизация"],
                responses: {
                    200: {
                        description: "OK",
                        schema: {
                            type: "object",
                            properties: {
                                error: {
                                    type: "boolean",
                                    example: false,
                                },
                                message: {
                                    type: "string",
                                    example: "Токен действителен",
                                },
                            },
                        },
                    },
                    401: {
                        description: "Unauthorized",
                        schema: {
                            type: "object",
                            properties: {
                                error: {
                                    type: "boolean",
                                    example: true,
                                },
                                message: {
                                    type: "string",
                                    example: "Пользователь не авторизован",
                                },
                                errors: {
                                    type: "array",
                                    items: {
                                        type: "string",
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        "/user/short-info": {
            get: {
                summary: "Get short user information",
                tags: ["Пользователи"],
                responses: {
                    200: {
                        description: "OK",
                        schema: {
                            type: "object",
                            properties: {
                                sessionId: {
                                    type: "number",
                                    example: 1,
                                },
                                user: {
                                    type: "object",
                                    properties: {
                                        id: {
                                            type: "number",
                                            example: 1,
                                        },
                                        nickname: {
                                            type: "string",
                                            example: "l4ndar",
                                        },
                                        isVerified: {
                                            type: "boolean",
                                            example: true,
                                        },
                                        isBlocked: {
                                            type: "boolean",
                                            example: false,
                                        },
                                        avatar: {
                                            type: "string",
                                            example: null,
                                        },
                                        status: {
                                            type: "string",
                                            example: "Новечок",
                                        },
                                        level: {
                                            type: "number",
                                            example: 1,
                                        },
                                        unreadNotifiesCount: {
                                            type: "number",
                                            example: 3,
                                        },
                                        permissions: {
                                            type: "array",
                                            items: {
                                                type: "string",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        "/user/set-avatar": {
            put: {
                summary: "Set user avatar",
                tags: ["Пользователи"],
                parameters: [
                    {
                        name: "body",
                        in: "body",
                        description: "User avatar",
                        required: true,
                        schema: {
                            type: "object",
                            properties: {
                                avatar: {
                                    type: "string",
                                    example:
                                        "undefined/868826cd-cc98-477f-88b9-28c16130eba6.jpg",
                                },
                            },
                        },
                    },
                ],
                responses: {
                    200: {
                        description: "OK",
                        schema: {
                            type: "object",
                            properties: {
                                user: {
                                    type: "object",
                                    properties: {
                                        id: {
                                            type: "number",
                                            example: 1,
                                        },
                                        nickname: {
                                            type: "string",
                                            example: "l4ndar",
                                        },
                                        isVerified: {
                                            type: "boolean",
                                            example: true,
                                        },
                                        isBlocked: {
                                            type: "boolean",
                                            example: false,
                                        },
                                        avatar: {
                                            type: "string",
                                            example:
                                                "undefined/868826cd-cc98-477f-88b9-28c16130eba6.jpg",
                                        },
                                        status: {
                                            type: "string",
                                            example: "Новечок",
                                        },
                                        level: {
                                            type: "number",
                                            example: 1,
                                        },
                                        unreadNotifiesCount: {
                                            type: "number",
                                            example: 3,
                                        },
                                        permissions: {
                                            type: "array",
                                            items: {
                                                type: "string",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        "/user/delete-avatar": {
            put: {
                summary: "Delete user avatar",
                tags: ["Пользователи"],
                responses: {
                    200: {
                        description: "OK",
                        schema: {
                            type: "object",
                            properties: {
                                user: {
                                    type: "object",
                                    properties: {
                                        id: {
                                            type: "number",
                                            example: 1,
                                        },
                                        nickname: {
                                            type: "string",
                                            example: "l4ndar",
                                        },
                                        isVerified: {
                                            type: "boolean",
                                            example: true,
                                        },
                                        isBlocked: {
                                            type: "boolean",
                                            example: false,
                                        },
                                        avatar: {
                                            type: "null",
                                        },
                                        status: {
                                            type: "string",
                                            example: "Новечок",
                                        },
                                        level: {
                                            type: "number",
                                            example: 1,
                                        },
                                        unreadNotifiesCount: {
                                            type: "number",
                                            example: 3,
                                        },
                                        permissions: {
                                            type: "array",
                                            items: {
                                                type: "string",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        "/user/verify-change-password-code": {
            put: {
                summary: "Verify change password code",
                tags: ["Пользователи"],
                parameters: [
                    {
                        name: "body",
                        in: "body",
                        description: "Change password code",
                        required: true,
                        schema: {
                            type: "object",
                            properties: {
                                oldPassword: {
                                    type: "string",
                                    example: "123123123",
                                },
                                newPassword: {
                                    type: "string",
                                    example: "123123123",
                                },
                            },
                        },
                    },
                ],
                responses: {
                    200: {
                        description: "OK",
                        schema: {
                            type: "object",
                            properties: {
                                error: {
                                    type: "boolean",
                                    example: false,
                                },
                                message: {
                                    type: "string",
                                    example: "Успешно",
                                },
                            },
                        },
                    },
                },
            },
        },
        "/user/permissions": {
            get: {
                summary: "Get permissions",
                tags: ["Пользователи"],
                responses: {
                    200: {
                        description: "OK",
                        schema: {
                            type: "object",
                            properties: {
                                permissions: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            id: {
                                                type: "number",
                                                example: 1,
                                            },
                                            permission: {
                                                type: "string",
                                                example: "Админка",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        "/user/profile-info": {
            get: {
                summary: "Get user profile info",
                tags: ["Пользователи"],
                responses: {
                    200: {
                        description: "OK",
                        schema: {
                            type: "object",
                            properties: {
                                user: {
                                    type: "object",
                                    properties: {
                                        firstName: {
                                            type: "string",
                                            example: "123",
                                        },
                                        lastName: {
                                            type: "string",
                                            example: "Ветров",
                                        },
                                        birthDate: {
                                            type: "string",
                                            format: "date-time",
                                            example: "2023-07-26T13:06:08.790Z",
                                        },
                                        gender: {
                                            type: "string",
                                            example: "Женский",
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        "/user/update-profile": {
            put: {
                summary: "Update user profile",
                tags: ["Пользователи"],
                parameters: [
                    {
                        name: "body",
                        in: "body",
                        description: "Updated profile info",
                        required: true,
                        schema: {
                            type: "object",
                            properties: {
                                firstName: {
                                    type: "string",
                                    example: "123",
                                },
                                lastName: {
                                    type: "string",
                                    example: "Ветров",
                                },
                                birthDate: {
                                    type: "string",
                                    format: "date-time",
                                    example: "2023-07-26T13:06:08.790Z",
                                },
                                gender: {
                                    type: "string",
                                    example: "Женский",
                                },
                            },
                        },
                    },
                ],
                responses: {
                    200: {
                        description: "OK",
                        schema: {
                            type: "object",
                            properties: {
                                user: {
                                    type: "object",
                                    properties: {
                                        firstName: {
                                            type: "string",
                                            example: "123",
                                        },
                                        lastName: {
                                            type: "string",
                                            example: "Ветров",
                                        },
                                        birthDate: {
                                            type: "string",
                                            format: "date-time",
                                            example: "2023-07-26T13:06:08.790Z",
                                        },
                                        gender: {
                                            type: "string",
                                            example: "Женский",
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        "/collection": {
            post: {
                summary: "Create a new collection",
                tags: ["Коллекции"],
                parameters: [
                    {
                        name: "body",
                        in: "body",
                        description: "Collection details",
                        required: true,
                        schema: {
                            type: "object",
                            properties: {
                                collection: {
                                    type: "string",
                                    example: "Коллекция",
                                },
                                description: {
                                    type: "string",
                                    example: "Описание",
                                },
                                isPrivate: {
                                    type: "boolean",
                                    example: false,
                                },
                                QAPairs: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            question: {
                                                type: "string",
                                                example: "Вопрос 1",
                                            },
                                            answer: {
                                                type: "string",
                                                example: "Ответ 1",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                ],
                responses: {
                    200: {
                        description: "OK",
                        schema: {
                            type: "object",
                            properties: {
                                collection: {
                                    type: "object",
                                    properties: {
                                        id: {
                                            type: "number",
                                            example: 1,
                                        },
                                        collection: {
                                            type: "string",
                                            example: "Коллекция",
                                        },
                                        pairsCount: {
                                            type: "number",
                                            example: 3,
                                        },
                                        description: {
                                            type: "string",
                                            example: "Описание",
                                        },
                                        isPrivate: {
                                            type: "boolean",
                                            example: false,
                                        },
                                        date: {
                                            type: "string",
                                            example: "2023-12-22T17:18:01.489Z",
                                        },
                                        user: {
                                            type: "object",
                                            properties: {
                                                nickname: {
                                                    type: "string",
                                                    example: "l4ndar",
                                                },
                                                avatar: {
                                                    type: "string",
                                                    example: null,
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            get: {
                summary: "Get collections",
                tags: ["Коллекции"],
                parameters: [
                    {
                        name: "limit",
                        in: "query",
                        description:
                            "Limit the number of collections returned (optional)",
                        required: false,
                        type: "integer",
                    },
                    {
                        name: "offset",
                        in: "query",
                        description: "Offset for pagination (optional)",
                        required: false,
                        type: "integer",
                    },
                ],
                responses: {
                    200: {
                        description: "OK",
                        schema: {
                            type: "object",
                            properties: {
                                collections: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            id: {
                                                type: "number",
                                                example: 1,
                                            },
                                            collection: {
                                                type: "string",
                                                example: "Коллекция",
                                            },
                                            pairsCount: {
                                                type: "number",
                                                example: 3,
                                            },
                                            description: {
                                                type: "string",
                                                example: "Описание",
                                            },
                                            isPrivate: {
                                                type: "boolean",
                                                example: false,
                                            },
                                            date: {
                                                type: "string",
                                                example:
                                                    "2023-12-22T17:18:01.489Z",
                                            },
                                            user: {
                                                type: "object",
                                                properties: {
                                                    nickname: {
                                                        type: "string",
                                                        example: "l4ndar",
                                                    },
                                                    avatar: {
                                                        type: "string",
                                                        example: null,
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                                totalCount: {
                                    type: "number",
                                    example: 1,
                                },
                                isLast: {
                                    type: "boolean",
                                    example: true,
                                },
                                elementsCount: {
                                    type: "number",
                                    example: 1,
                                },
                            },
                        },
                    },
                },
            },
            put: {
                summary: "Update collection",
                tags: ["Коллекции"],
                parameters: [
                    {
                        name: "body",
                        in: "body",
                        description: "Updated collection details",
                        required: true,
                        schema: {
                            type: "object",
                            properties: {
                                id: {
                                    type: "number",
                                    example: 2,
                                },
                                collection: {
                                    type: "string",
                                    example: "Коллекция 3",
                                },
                                description: {
                                    type: "string",
                                    example: "Описание обновленное",
                                },
                                isPrivate: {
                                    type: "boolean",
                                    example: true,
                                },
                                QAPairs: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            question: {
                                                type: "string",
                                                example: "1",
                                            },
                                            answer: {
                                                type: "string",
                                                example: "2",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                ],
                responses: {
                    200: {
                        description: "OK",
                        schema: {
                            type: "object",
                            properties: {
                                collection: {
                                    type: "object",
                                    properties: {
                                        id: {
                                            type: "number",
                                            example: 2,
                                        },
                                        collection: {
                                            type: "string",
                                            example: "Коллекция 3",
                                        },
                                        pairsCount: {
                                            type: "number",
                                            example: 5,
                                        },
                                        description: {
                                            type: "string",
                                            example: "Описание обновленное",
                                        },
                                        isPrivate: {
                                            type: "boolean",
                                            example: true,
                                        },
                                        date: {
                                            type: "string",
                                            example: "2023-12-22T17:24:52.108Z",
                                        },
                                        user: {
                                            type: "object",
                                            properties: {
                                                nickname: {
                                                    type: "string",
                                                    example: "l4ndar",
                                                },
                                                avatar: {
                                                    type: "string",
                                                    example: null,
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        "/collection/{id}": {
            get: {
                summary: "Get collection by ID",
                tags: ["Коллекции"],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "ID of the collection",
                        required: true,
                        type: "integer",
                    },
                ],
                responses: {
                    200: {
                        description: "OK",
                        schema: {
                            type: "object",
                            properties: {
                                collection: {
                                    type: "object",
                                    properties: {
                                        id: {
                                            type: "number",
                                            example: 1,
                                        },
                                        collection: {
                                            type: "string",
                                            example: "Коллекция",
                                        },
                                        pairsCount: {
                                            type: "number",
                                            example: 3,
                                        },
                                        description: {
                                            type: "string",
                                            example: "Описание",
                                        },
                                        isPrivate: {
                                            type: "boolean",
                                            example: false,
                                        },
                                        date: {
                                            type: "string",
                                            example: "2023-12-22T17:18:01.489Z",
                                        },
                                        user: {
                                            type: "object",
                                            properties: {
                                                id: {
                                                    type: "number",
                                                    example: 2,
                                                },
                                                nickname: {
                                                    type: "string",
                                                    example: "l4ndar",
                                                },
                                                avatar: {
                                                    type: "string",
                                                    example: null,
                                                },
                                            },
                                        },
                                        QAPairs: {
                                            type: "array",
                                            items: {
                                                type: "object",
                                                properties: {
                                                    id: {
                                                        type: "number",
                                                        example: 1,
                                                    },
                                                    question: {
                                                        type: "string",
                                                        example: "Вопрос 1",
                                                    },
                                                    answer: {
                                                        type: "string",
                                                        example: "Ответ 1",
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            delete: {
                summary: "Delete collection by ID",
                tags: ["Коллекции"],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "ID of the collection to delete",
                        required: true,
                        type: "integer",
                    },
                ],
                responses: {
                    200: {
                        description: "OK",
                        schema: {
                            type: "object",
                            properties: {
                                collection: {
                                    type: "object",
                                    properties: {
                                        id: {
                                            type: "number",
                                            example: 1,
                                        },
                                        collection: {
                                            type: "string",
                                            example: "Коллекция",
                                        },
                                        pairsCount: {
                                            type: "number",
                                            example: 3,
                                        },
                                        description: {
                                            type: "string",
                                            example: "Описание",
                                        },
                                        isPrivate: {
                                            type: "boolean",
                                            example: false,
                                        },
                                        date: {
                                            type: "string",
                                            example: "2023-12-22T17:18:01.489Z",
                                        },
                                        user: {
                                            type: "object",
                                            properties: {
                                                nickname: {
                                                    type: "string",
                                                    example: "l4ndar",
                                                },
                                                avatar: {
                                                    type: "string",
                                                    example: null,
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        "/session": {
            get: {
                summary: "Get sessions",
                tags: ["Сессии"],
                parameters: [
                    {
                        name: "limit",
                        in: "query",
                        description:
                            "Limit the number of sessions returned (optional)",
                        required: false,
                        type: "integer",
                    },
                    {
                        name: "offset",
                        in: "query",
                        description: "Offset for pagination (optional)",
                        required: false,
                        type: "integer",
                    },
                ],
                responses: {
                    200: {
                        description: "OK",
                        schema: {
                            type: "object",
                            properties: {
                                current: {
                                    type: "object",
                                    properties: {
                                        id: {
                                            type: "number",
                                            example: 2,
                                        },
                                        isActive: {
                                            type: "boolean",
                                            example: true,
                                        },
                                        date: {
                                            type: "string",
                                            example: "2023-12-22T17:24:59.506Z",
                                        },
                                        ip: {
                                            type: "string",
                                            example: "::1",
                                        },
                                        deviceType: {
                                            type: "string",
                                            example: "phone",
                                        },
                                        country: {
                                            type: "string",
                                            example: null,
                                        },
                                        city: {
                                            type: "string",
                                            example: null,
                                        },
                                        browser: {
                                            type: "string",
                                            example: "PostmanRuntime",
                                        },
                                        browserVersion: {
                                            type: "string",
                                            example: "7.36.0",
                                        },
                                        os: {
                                            type: "string",
                                            example: null,
                                        },
                                        platform: {
                                            type: "string",
                                            example: null,
                                        },
                                        isBot: {
                                            type: "string",
                                            example: "postman",
                                        },
                                    },
                                },
                                other: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            id: {
                                                type: "number",
                                                example: 3,
                                            },
                                            isActive: {
                                                type: "boolean",
                                                example: false,
                                            },
                                            date: {
                                                type: "string",
                                                example:
                                                    "2023-12-22T17:06:29.602Z",
                                            },
                                            ip: {
                                                type: "string",
                                                example: "::1",
                                            },
                                            deviceType: {
                                                type: "string",
                                                example: "desktop",
                                            },
                                            country: {
                                                type: "string",
                                                example: null,
                                            },
                                            city: {
                                                type: "string",
                                                example: null,
                                            },
                                            browser: {
                                                type: "string",
                                                example: "Chrome",
                                            },
                                            browserVersion: {
                                                type: "string",
                                                example: "120.0.0.0",
                                            },
                                            os: {
                                                type: "string",
                                                example: "Windows 10.0",
                                            },
                                            platform: {
                                                type: "string",
                                                example: "Microsoft Windows",
                                            },
                                            isBot: {
                                                type: "string",
                                                example: "false",
                                            },
                                        },
                                    },
                                },
                                totalCount: {
                                    type: "number",
                                    example: 1,
                                },
                                isLast: {
                                    type: "boolean",
                                    example: true,
                                },
                                elementsCount: {
                                    type: "number",
                                    example: 1,
                                },
                            },
                        },
                    },
                },
            },
        },
        "/session/end/{id}": {
            put: {
                summary: "End session by ID",
                tags: ["Сессии"],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "ID of the session to end",
                        required: true,
                        type: "integer",
                    },
                ],
                responses: {
                    200: {
                        description: "OK",
                        schema: {
                            type: "object",
                            properties: {
                                error: {
                                    type: "boolean",
                                    example: false,
                                },
                                message: {
                                    type: "string",
                                    example: "Успешно",
                                },
                                session: {
                                    type: "object",
                                    properties: {
                                        id: {
                                            type: "number",
                                            example: 2,
                                        },
                                        isActive: {
                                            type: "boolean",
                                            example: false,
                                        },
                                        date: {
                                            type: "string",
                                            example: "2023-12-22T17:24:59.506Z",
                                        },
                                        ip: {
                                            type: "string",
                                            example: "::1",
                                        },
                                        deviceType: {
                                            type: "string",
                                            example: "phone",
                                        },
                                        country: {
                                            type: "string",
                                            example: null,
                                        },
                                        city: {
                                            type: "string",
                                            example: null,
                                        },
                                        browser: {
                                            type: "string",
                                            example: "PostmanRuntime",
                                        },
                                        browserVersion: {
                                            type: "string",
                                            example: "7.36.0",
                                        },
                                        os: {
                                            type: "string",
                                            example: null,
                                        },
                                        platform: {
                                            type: "string",
                                            example: null,
                                        },
                                        isBot: {
                                            type: "string",
                                            example: "postman",
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        "/session/end-all": {
            put: {
                summary: "End all sessions",
                tags: ["Сессии"],
                responses: {
                    200: {
                        description: "OK",
                        schema: {
                            type: "object",
                            properties: {
                                current: {
                                    type: "object",
                                    properties: {
                                        id: {
                                            type: "number",
                                            example: 2,
                                        },
                                        isActive: {
                                            type: "boolean",
                                            example: true,
                                        },
                                        date: {
                                            type: "string",
                                            example: "2023-12-22T17:39:51.976Z",
                                        },
                                        ip: {
                                            type: "string",
                                            example: "::1",
                                        },
                                        deviceType: {
                                            type: "string",
                                            example: "phone",
                                        },
                                        country: {
                                            type: "string",
                                            example: null,
                                        },
                                        city: {
                                            type: "string",
                                            example: null,
                                        },
                                        browser: {
                                            type: "string",
                                            example: "PostmanRuntime",
                                        },
                                        browserVersion: {
                                            type: "string",
                                            example: "7.36.0",
                                        },
                                        os: {
                                            type: "string",
                                            example: null,
                                        },
                                        platform: {
                                            type: "string",
                                            example: null,
                                        },
                                        isBot: {
                                            type: "string",
                                            example: "postman",
                                        },
                                    },
                                },
                                other: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            id: {
                                                type: "number",
                                                example: 3,
                                            },
                                            isActive: {
                                                type: "boolean",
                                                example: false,
                                            },
                                            date: {
                                                type: "string",
                                                example:
                                                    "2023-12-22T17:06:29.602Z",
                                            },
                                            ip: {
                                                type: "string",
                                                example: "::1",
                                            },
                                            deviceType: {
                                                type: "string",
                                                example: "desktop",
                                            },
                                            country: {
                                                type: "string",
                                                example: null,
                                            },
                                            city: {
                                                type: "string",
                                                example: null,
                                            },
                                            browser: {
                                                type: "string",
                                                example: "Chrome",
                                            },
                                            browserVersion: {
                                                type: "string",
                                                example: "120.0.0.0",
                                            },
                                            os: {
                                                type: "string",
                                                example: "Windows 10.0",
                                            },
                                            platform: {
                                                type: "string",
                                                example: "Microsoft Windows",
                                            },
                                            isBot: {
                                                type: "string",
                                                example: "false",
                                            },
                                        },
                                    },
                                },
                                totalCount: {
                                    type: "number",
                                    example: 1,
                                },
                                isLast: {
                                    type: "boolean",
                                    example: false,
                                },
                                elementsCount: {
                                    type: "number",
                                    example: 1,
                                },
                            },
                        },
                    },
                },
            },
        },
        "/notify": {
            get: {
                summary: "Get notifies",
                tags: ["Уведомления"],
                parameters: [
                    {
                        name: "limit",
                        in: "query",
                        description:
                            "Limit the number of notifies returned (optional)",
                        required: false,
                        type: "integer",
                    },
                    {
                        name: "offset",
                        in: "query",
                        description: "Offset for pagination (optional)",
                        required: false,
                        type: "integer",
                    },
                ],
                responses: {
                    200: {
                        description: "OK",
                        schema: {
                            type: "object",
                            properties: {
                                notifies: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            id: {
                                                type: "number",
                                                example: 2,
                                            },
                                            title: {
                                                type: "string",
                                                example:
                                                    "В ваш аккаунт был выполнен вход",
                                            },
                                            sender: {
                                                type: "null",
                                            },
                                            date: {
                                                type: "string",
                                                example:
                                                    "2023-12-22T17:39:51.991Z",
                                            },
                                            content: {
                                                type: "string",
                                                example:
                                                    "<p>Устройство: ::1, PostmanRuntime.</p><p>Местоположение: неопределено.</p>",
                                            },
                                            type: {
                                                type: "string",
                                                example: "Сессия",
                                            },
                                            isRead: {
                                                type: "boolean",
                                                example: false,
                                            },
                                        },
                                    },
                                },
                                totalCount: {
                                    type: "number",
                                    example: 2,
                                },
                                isLast: {
                                    type: "boolean",
                                    example: true,
                                },
                                elementsCount: {
                                    type: "number",
                                    example: 2,
                                },
                            },
                        },
                    },
                },
            },
        },
        "/notify/read": {
            put: {
                summary: "Mark notify as read",
                tags: ["Уведомления"],
                parameters: [
                    {
                        name: "body",
                        in: "body",
                        description: "Notify ID to mark as read",
                        required: true,
                        schema: {
                            type: "object",
                            properties: {
                                notifyId: {
                                    type: "number",
                                    example: 2,
                                },
                            },
                        },
                    },
                ],
                responses: {
                    200: {
                        description: "OK",
                        schema: {
                            type: "object",
                            properties: {
                                notify: {
                                    type: "object",
                                    properties: {
                                        id: {
                                            type: "number",
                                            example: 2,
                                        },
                                        title: {
                                            type: "string",
                                            example:
                                                "В ваш аккаунт был выполнен вход",
                                        },
                                        sender: {
                                            type: "null",
                                        },
                                        date: {
                                            type: "string",
                                            example: "2023-12-22T17:39:51.991Z",
                                        },
                                        content: {
                                            type: "string",
                                            example:
                                                "<p>Устройство: ::1, PostmanRuntime.</p><p>Местоположение: неопределено.</p>",
                                        },
                                        type: {
                                            type: "string",
                                            example: "Сессия",
                                        },
                                        isRead: {
                                            type: "boolean",
                                            example: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        "/notify/read-all": {
            put: {
                summary: "Mark all notifies as read",
                tags: ["Уведомления"],
                responses: {
                    200: {
                        description: "OK",
                        schema: {
                            type: "object",
                            properties: {
                                notifies: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            id: {
                                                type: "number",
                                                example: 2,
                                            },
                                            title: {
                                                type: "string",
                                                example:
                                                    "В ваш аккаунт был выполнен вход",
                                            },
                                            sender: {
                                                type: "null",
                                            },
                                            date: {
                                                type: "string",
                                                example:
                                                    "2023-12-22T17:39:51.991Z",
                                            },
                                            content: {
                                                type: "string",
                                                example:
                                                    "<p>Устройство: ::1, PostmanRuntime.</p><p>Местоположение: неопределено.</p>",
                                            },
                                            type: {
                                                type: "string",
                                                example: "Сессия",
                                            },
                                            isRead: {
                                                type: "boolean",
                                                example: true,
                                            },
                                        },
                                    },
                                },
                                totalCount: {
                                    type: "number",
                                    example: 2,
                                },
                                isLast: {
                                    type: "boolean",
                                    example: true,
                                },
                                elementsCount: {
                                    type: "number",
                                    example: 2,
                                },
                            },
                        },
                    },
                },
            },
        },
        "/subject": {
            get: {
                summary: "Get subjects",
                tags: ["Обучение"],
                responses: {
                    200: {
                        description: "OK",
                        schema: {
                            type: "object",
                            properties: {
                                subjects: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            id: {
                                                type: "number",
                                                example: 2,
                                            },
                                            subject: {
                                                type: "string",
                                                example: "Информатика2",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        "/subject/{subjectId}/task-info": {
            get: {
                summary: "Get task info for a subject",
                tags: ["Обучение"],
                parameters: [
                    {
                        name: "subjectId",
                        in: "path",
                        description: "ID of the subject",
                        required: true,
                        type: "integer",
                        example: 2,
                    },
                ],
                responses: {
                    200: {
                        description: "OK",
                        schema: {
                            type: "object",
                            properties: {
                                subjectTasks: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            id: {
                                                type: "number",
                                                example: 9,
                                            },
                                            number: {
                                                type: "number",
                                                example: 1,
                                            },
                                            theme: {
                                                type: "string",
                                                example: "Тема 1",
                                            },
                                            primaryScore: {
                                                type: "number",
                                                example: 1,
                                            },
                                            isDetailedAnswer: {
                                                type: "boolean",
                                                example: false,
                                            },
                                            totalCount: {
                                                type: "number",
                                                example: 0,
                                            },
                                            subThemes: {
                                                type: "array",
                                                items: {
                                                    type: "object",
                                                    properties: {
                                                        id: {
                                                            type: "number",
                                                            example: 12,
                                                        },
                                                        subTheme: {
                                                            type: "string",
                                                            example:
                                                                "Подтема 1",
                                                        },
                                                        tasksCount: {
                                                            type: "number",
                                                            example: 0,
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        "/subject/{subjectId}/subject-task": {
            get: {
                summary: "Get subject tasks for a subject",
                tags: ["Обучение"],
                parameters: [
                    {
                        name: "subjectId",
                        in: "path",
                        description: "ID of the subject",
                        required: true,
                        type: "integer",
                        example: 2,
                    },
                ],
                responses: {
                    200: {
                        description: "OK",
                        schema: {
                            type: "object",
                            properties: {
                                subjectTasks: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            id: {
                                                type: "number",
                                                example: 9,
                                            },
                                            number: {
                                                type: "number",
                                                example: 1,
                                            },
                                            theme: {
                                                type: "string",
                                                example: "Тема 1",
                                            },
                                            primaryScore: {
                                                type: "number",
                                                example: 1,
                                            },
                                            isDetailedAnswer: {
                                                type: "boolean",
                                                example: false,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        "/sub-theme/{subThemeId}/tasks": {
            get: {
                summary: "Get tasks for a sub-theme",
                tags: ["Обучение"],
                parameters: [
                    {
                        name: "subThemeId",
                        in: "path",
                        description: "ID of the sub-theme",
                        required: true,
                        type: "integer",
                        example: 307,
                    },
                ],
                responses: {
                    200: {
                        description: "OK",
                        schema: {
                            type: "object",
                            properties: {
                                subject: {
                                    type: "string",
                                    example: "Математика база",
                                },
                                number: {
                                    type: "number",
                                    example: 1,
                                },
                                theme: {
                                    type: "string",
                                    example: "Простейшие текстовые задачи",
                                },
                                subTheme: {
                                    type: "string",
                                    example: "Округление с недостатком",
                                },
                                tasks: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            id: {
                                                type: "number",
                                                example: 550,
                                            },
                                            subject: {
                                                type: "string",
                                                example: "Математика база",
                                            },
                                            number: {
                                                type: "number",
                                                example: 1,
                                            },
                                            theme: {
                                                type: "string",
                                                example:
                                                    "Простейшие текстовые задачи",
                                            },
                                            subTheme: {
                                                type: "string",
                                                example:
                                                    "Округление с недостатком",
                                            },
                                            task: {
                                                type: "string",
                                                example:
                                                    "<p>По тарифному плану «Просто как день» компания сотовой связи каждый вечер снимает со счёта абонента 16 руб. Если на счету осталось меньше 16 руб., то на следующее утро номер блокируют до пополнения счёта. Сегодня утром у Лизы на счету было 300 руб. Сколько дней (включая сегодняшний) она сможет пользоваться телефоном, не пополняя счёт?</p>",
                                            },
                                            solution: {
                                                type: "string",
                                                example:
                                                    "<p>300/16 = 18,75. За 18 дней (включая сегодняшний) со счета будет списано 18 * 16  =  288 руб. Вечером восемнадцатого дня после списания средств на счете будет 300 − 288  =  12 руб., и утром девятнадцатого дня счет будет заблокирован. Следовательно, Лиза сможет пользоваться телефоном 18 дней.</p>",
                                            },
                                            answer: {
                                                type: "string",
                                                example: "18",
                                            },
                                        },
                                    },
                                },
                                totalCount: {
                                    type: "number",
                                    example: 2,
                                },
                                isLast: {
                                    type: "boolean",
                                    example: true,
                                },
                                elementsCount: {
                                    type: "number",
                                    example: 2,
                                },
                            },
                        },
                    },
                },
            },
        },
        "/task/{taskId}": {
            get: {
                summary: "Get task by ID",
                tags: ["Обучение"],
                parameters: [
                    {
                        name: "taskId",
                        in: "path",
                        description: "ID of the task",
                        required: true,
                        type: "integer",
                        example: 42,
                    },
                ],
                responses: {
                    200: {
                        description: "OK",
                        schema: {
                            type: "object",
                            properties: {
                                subject: {
                                    type: "string",
                                    example: "Русский язык",
                                },
                                number: {
                                    type: "number",
                                    example: 1,
                                },
                                theme: {
                                    type: "string",
                                    example:
                                        "Средства связи предложений в тексте",
                                },
                                subTheme: {
                                    type: "string",
                                    example: "Задания для подготовки",
                                },
                                tasks: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            id: {
                                                type: "number",
                                                example: 42,
                                            },
                                            subject: {
                                                type: "string",
                                                example: "Русский язык",
                                            },
                                            number: {
                                                type: "number",
                                                example: 1,
                                            },
                                            theme: {
                                                type: "string",
                                                example:
                                                    "Средства связи предложений в тексте",
                                            },
                                            subTheme: {
                                                type: "string",
                                                example:
                                                    "Задания для подготовки",
                                            },
                                            task: {
                                                type: "string",
                                                example:
                                                    "<p>Самостоятельно подберите указательное местоимение, которое должно стоять на месте пропуска во втором (2) предложении второго абзаца текста. Запишите это местоимение.</p><p><b>Прочитайте текст и выполните задания 1−3.</b></p><p>После встречи в поезде с художником я приехал в Ленинград. Снова открылись передо мной торжественные <b>ансамбли</b> его площадей и пропорциональных зданий.</p><p>Я подолгу всматривался в них, стараясь разгадать их архитектурную тайну. Она заключалась в том, что &lt;...&gt; здания производили впечатление величия, на самом же деле они были невелики. Одна из самых замечательных построек  — здание Главного штаба, вытянутое плавной дугой против Зимнего дворца,  — по своей высоте не превышает четырёхэтажного дома. А между тем оно гораздо величественнее любого современного высотного дома.</p><p>Разгадка была <b>простая</b>. Величественность зданий зависела от их соразмерности, гармонических пропорций и от небольшого <b>числа</b> украшений: оконных наличников, барельефов.</p><p>Всматриваясь в эти здания, понимаешь, что хороший <b>вкус</b>  — это прежде всего чувство меры.</p><p>Я уверен, что эти же законы соразмерности частей, отсутствия всего лишнего, простоты, при которой видна и <b>доставляет</b> истинное наслаждение каждая линия,  — всё это имеет некоторое отношение и к прозе.</p><p>Писатель, полюбивший совершенство классических архитектурных форм, не допустит в своей прозе тяжеловесной и неуклюжей композиции. Он будет добиваться соразмерности частей и строгости словесного рисунка.</p><p>Композиция прозаической вещи должна быть доведена до такого состояния, чтобы нельзя было ничего выбросить и ничего прибавить без того, чтобы не нарушились смысл повествования и закономерное течение событий.</p><p><i>(По К. Г. Паустовскому)</i></p>",
                                            },
                                            solution: {
                                                type: "string",
                                                example:
                                                    "<p><b>Пояснение (см. также Правило ниже). </b></p><p>Приведём верное написание:</p><p>Она заключалась в том, что &lt;ЭТИ&gt; здания производили впечатление величия, на самом же деле они были невелики. </p><p>Почему не подходит местоимение «такие»: данное местоимение должно указывать на признак из предыдущего предложения. А признаков нет. Если мы говорим: мне нравятся «такие», значит, в предыдущей фразе было названо, какие именно. </p><p>Местоимение «те» не подходит.</p>",
                                            },
                                            answer: {
                                                type: "string",
                                                example: "эти",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        "/test/{testId}": {
            get: {
                summary: "Get test by ID",
                tags: ["Обучение"],
                parameters: [
                    {
                        name: "testId",
                        in: "path",
                        description: "ID of the test",
                        required: true,
                        type: "integer",
                        example: 8,
                    },
                ],
                responses: {
                    200: {
                        description: "OK",
                        schema: {
                            type: "object",
                            properties: {
                                test: {
                                    type: "object",
                                    properties: {
                                        id: {
                                            type: "number",
                                            example: 8,
                                        },
                                        isOfficial: {
                                            type: "boolean",
                                            example: false,
                                        },
                                        isPrivate: {
                                            type: "boolean",
                                            example: false,
                                        },
                                        isExam: {
                                            type: "boolean",
                                            example: true,
                                        },
                                        date: {
                                            type: "string",
                                            format: "date-time",
                                            example: "2023-10-19T09:11:40.289Z",
                                        },
                                        subject: {
                                            type: "string",
                                            example: "Русский язык",
                                        },
                                        durationMinutes: {
                                            type: "number",
                                            example: 210,
                                        },
                                        tasksCount: {
                                            type: "number",
                                            example: 27,
                                        },
                                        user: {
                                            type: "object",
                                            properties: {
                                                id: {
                                                    type: "number",
                                                    example: 2,
                                                },
                                                nickname: {
                                                    type: "string",
                                                    example: "xw1nchester",
                                                },
                                                avatar: {
                                                    type: "string",
                                                    example:
                                                        "https://resez.ru/api/24052034-a74e-40c8-b931-ca626523cfce.gif",
                                                },
                                            },
                                        },
                                        tasks: {
                                            type: "array",
                                            items: {
                                                type: "object",
                                                properties: {
                                                    id: {
                                                        type: "number",
                                                        example: 42,
                                                    },
                                                    number: {
                                                        type: "number",
                                                        example: 1,
                                                    },
                                                    theme: {
                                                        type: "string",
                                                        example:
                                                            "Средства связи предложений в тексте",
                                                    },
                                                    isDetailedAnswer: {
                                                        type: "boolean",
                                                        example: false,
                                                    },
                                                    subTheme: {
                                                        type: "string",
                                                        example:
                                                            "Задания для подготовки",
                                                    },
                                                    task: {
                                                        type: "string",
                                                        example:
                                                            "<p>Самостоятельно подберите указательное местоимение, которое должно стоять на месте пропуска во втором (2) предложении второго абзаца текста. Запишите это местоимение.</p><p><b>Прочитайте текст и выполните задания 1−3.</b></p><p>После встречи в поезде с художником я приехал в Ленинград. Снова открылись передо мной торжественные <b>ансамбли</b> его площадей и пропорциональных зданий.</p><p>Я подолгу всматривался в них, стараясь разгадать их архитектурную тайну. Она заключалась в том, что &lt;...&gt; здания производили впечатление величия, на самом же деле они были невелики. Одна из самых замечательных построек  — здание Главного штаба, вытянутое плавной дугой против Зимнего дворца,  — по своей высоте не превышает четырёхэтажного дома. А между тем оно гораздо величественнее любого современного высотного дома.</p><p>Разгадка была <b>простая</b>. Величественность зданий зависела от их соразмерности, гармонических пропорций и от небольшого <b>числа</b> украшений: оконных наличников, барельефов.</p><p>Всматриваясь в эти здания, понимаешь, что хороший <b>вкус</b>  — это прежде всего чувство меры.</p><p>Я уверен, что эти же законы соразмерности частей, отсутствия всего лишнего, простоты, при которой видна и <b>доставляет</b> истинное наслаждение каждая линия,  — всё это имеет некоторое отношение и к прозе.</p><p>Писатель, полюбивший совершенство классических архитектурных форм, не допустит в своей прозе тяжеловесной и неуклюжей композиции. Он будет добиваться соразмерности частей и строгости словесного рисунка.</p><p>Композиция прозаической вещи должна быть доведена до такого состояния, чтобы нельзя было ничего выбросить и ничего прибавить без того, чтобы не нарушились смысл повествования и закономерное течение событий.</p><p><i>(По К. Г. Паустовскому)</i></p>",
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        "/test/generate-exam": {
            post: {
                summary: "Generate exam",
                tags: ["Обучение"],
                parameters: [],
                requestBody: {
                    description: "Test parameters",
                    content: {
                        "application/json": {
                            example: {
                                id: 52,
                                isOfficial: false,
                                isPrivate: false,
                                isExam: true,
                                subject: "Информатика",
                                tasksCount: 27,
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: "OK",
                        schema: {
                            type: "object",
                            properties: {
                                test: {
                                    type: "object",
                                    properties: {
                                        id: {
                                            type: "number",
                                            example: 52,
                                        },
                                        isOfficial: {
                                            type: "boolean",
                                            example: false,
                                        },
                                        isPrivate: {
                                            type: "boolean",
                                            example: false,
                                        },
                                        isExam: {
                                            type: "boolean",
                                            example: true,
                                        },
                                        subject: {
                                            type: "string",
                                            example: "Информатика",
                                        },
                                        tasksCount: {
                                            type: "number",
                                            example: 27,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        "/test/generate-custom": {
            post: {
                summary: "Generate custom test",
                tags: ["Обучение"],
                parameters: [],
                requestBody: {
                    description: "Test parameters",
                    content: {
                        "application/json": {
                            example: {
                                test: {
                                    id: 53,
                                    isOfficial: false,
                                    isPrivate: false,
                                    isExam: false,
                                    subject: "Информатика",
                                    tasksCount: 9,
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: "OK",
                        schema: {
                            type: "object",
                            properties: {
                                test: {
                                    type: "object",
                                    properties: {
                                        id: {
                                            type: "number",
                                            example: 53,
                                        },
                                        isOfficial: {
                                            type: "boolean",
                                            example: false,
                                        },
                                        isPrivate: {
                                            type: "boolean",
                                            example: false,
                                        },
                                        isExam: {
                                            type: "boolean",
                                            example: false,
                                        },
                                        subject: {
                                            type: "string",
                                            example: "Информатика",
                                        },
                                        tasksCount: {
                                            type: "number",
                                            example: 9,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        "/test/check": {
            post: {
                summary: "Check test results",
                tags: ["Обучение"],
                parameters: [],
                requestBody: {
                    description: "Test check parameters",
                    content: {
                        "application/json": {
                            example: {
                                id: 51,
                                spentSeconds: 3000,
                                tasksWithoutDetailedAnswer: [
                                    {
                                        id: 18,
                                        answer: "4",
                                    },
                                ],
                                tasKSWITHDETAILEDANSWER: [
                                    {
                                        ID: 22,
                                        PRIMARYSCORE: 1,
                                    },
                                ],
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: "OK",
                        schema: {
                            type: "object",
                            properties: {
                                isExam: {
                                    type: "boolean",
                                    example: true,
                                },
                                tasksWithoutDetailedAnswerResult: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            id: {
                                                type: "number",
                                                example: 279,
                                            },
                                            number: {
                                                type: "number",
                                                example: 1,
                                            },
                                            answer: {
                                                type: "string",
                                                example: "2",
                                            },
                                            isCorrect: {
                                                type: "boolean",
                                                example: false,
                                            },
                                            correctAsnwer: {
                                                type: "string",
                                                example: "40",
                                            },
                                            primaryScore: {
                                                type: "number",
                                                example: 0,
                                            },
                                        },
                                    },
                                },
                                totalPrimaryScore: {
                                    type: "number",
                                    example: 3,
                                },
                                maxPrimaryScore: {
                                    type: "number",
                                    example: 29,
                                },
                                totalSecondaryScore: {
                                    type: "number",
                                    example: 20,
                                },
                            },
                        },
                    },
                },
            },
        },
        "/admin/user": {
            get: {
                summary: "Get users",
                tags: ["Админка"],
                responses: {
                    200: {
                        description: "OK",
                        schema: {
                            type: "object",
                            properties: {
                                users: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            id: {
                                                type: "number",
                                                example: 2,
                                            },
                                            nickname: {
                                                type: "string",
                                                example: "l4ndar",
                                            },
                                            firstName: {
                                                type: "null",
                                            },
                                            lastName: {
                                                type: "null",
                                            },
                                            registrationDate: {
                                                type: "string",
                                                example:
                                                    "2023-12-19T17:33:53.664Z",
                                            },
                                            isVerified: {
                                                type: "boolean",
                                                example: true,
                                            },
                                            isBlocked: {
                                                type: "boolean",
                                                example: false,
                                            },
                                            avatar: {
                                                type: "null",
                                            },
                                            status: {
                                                type: "string",
                                                example: "Новечок",
                                            },
                                            level: {
                                                type: "number",
                                                example: 1,
                                            },
                                            xp: {
                                                type: "number",
                                                example: 0,
                                            },
                                            xpLimit: {
                                                type: "number",
                                                example: 1000,
                                            },
                                            roles: {
                                                type: "array",
                                                items: {
                                                    type: "object",
                                                    properties: {
                                                        id: {
                                                            type: "number",
                                                            example: 1,
                                                        },
                                                        role: {
                                                            type: "string",
                                                            example: "Immortal",
                                                        },
                                                        textColor: {
                                                            type: "string",
                                                            example: "#EF3B3B",
                                                        },
                                                        backgroundColor: {
                                                            type: "string",
                                                            example:
                                                                "#EF3B3B1A",
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                                totalCount: {
                                    type: "number",
                                    example: 2,
                                },
                                isLast: {
                                    type: "boolean",
                                    example: true,
                                },
                                elementsCount: {
                                    type: "number",
                                    example: 2,
                                },
                            },
                        },
                    },
                },
            },
        },
        "/admin/block": {
            put: {
                summary: "Block user",
                tags: ["Админка"],
                parameters: [
                    {
                        name: "body",
                        in: "body",
                        description: "User ID to block",
                        required: true,
                        schema: {
                            type: "object",
                            properties: {
                                userId: {
                                    type: "number",
                                    example: 1,
                                },
                            },
                        },
                    },
                ],
                responses: {
                    200: {
                        description: "OK",
                        schema: {
                            type: "object",
                            properties: {
                                user: {
                                    type: "object",
                                    properties: {
                                        id: {
                                            type: "number",
                                            example: 1,
                                        },
                                        nickname: {
                                            type: "string",
                                            example: "aTUgp2ceJ9eVxwHvu",
                                        },
                                        firstName: {
                                            type: "null",
                                        },
                                        lastName: {
                                            type: "null",
                                        },
                                        registrationDate: {
                                            type: "string",
                                            example: "2023-12-19T16:45:31.185Z",
                                        },
                                        isVerified: {
                                            type: "boolean",
                                            example: true,
                                        },
                                        isBlocked: {
                                            type: "boolean",
                                            example: true,
                                        },
                                        avatar: {
                                            type: "null",
                                        },
                                        status: {
                                            type: "string",
                                            example: "Новечок",
                                        },
                                        level: {
                                            type: "number",
                                            example: 1,
                                        },
                                        xp: {
                                            type: "number",
                                            example: 0,
                                        },
                                        xpLimit: {
                                            type: "number",
                                            example: 1000,
                                        },
                                        roles: {
                                            type: "array",
                                            items: {
                                                type: "object",
                                                properties: {
                                                    id: {
                                                        type: "number",
                                                        example: 1,
                                                    },
                                                    role: {
                                                        type: "string",
                                                        example: "Immortal",
                                                    },
                                                    textColor: {
                                                        type: "string",
                                                        example: "#EF3B3B",
                                                    },
                                                    backgroundColor: {
                                                        type: "string",
                                                        example: "#EF3B3B1A",
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        "/admin/unblock": {
            put: {
                summary: "Unblock user",
                tags: ["Админка"],
                parameters: [
                    {
                        name: "body",
                        in: "body",
                        description: "User ID to unblock",
                        required: true,
                        schema: {
                            type: "object",
                            properties: {
                                userId: {
                                    type: "number",
                                    example: 1,
                                },
                            },
                        },
                    },
                ],
                responses: {
                    200: {
                        description: "OK",
                        schema: {
                            type: "object",
                            properties: {
                                user: {
                                    type: "object",
                                    properties: {
                                        id: {
                                            type: "number",
                                            example: 1,
                                        },
                                        nickname: {
                                            type: "string",
                                            example: "aTUgp2ceJ9eVxwHvu",
                                        },
                                        firstName: {
                                            type: "null",
                                        },
                                        lastName: {
                                            type: "null",
                                        },
                                        registrationDate: {
                                            type: "string",
                                            example: "2023-12-19T16:45:31.185Z",
                                        },
                                        isVerified: {
                                            type: "boolean",
                                            example: true,
                                        },
                                        isBlocked: {
                                            type: "boolean",
                                            example: false,
                                        },
                                        avatar: {
                                            type: "null",
                                        },
                                        status: {
                                            type: "string",
                                            example: "Новечок",
                                        },
                                        level: {
                                            type: "number",
                                            example: 1,
                                        },
                                        xp: {
                                            type: "number",
                                            example: 0,
                                        },
                                        xpLimit: {
                                            type: "number",
                                            example: 1000,
                                        },
                                        roles: {
                                            type: "array",
                                            items: {
                                                type: "object",
                                                properties: {
                                                    id: {
                                                        type: "number",
                                                        example: 1,
                                                    },
                                                    role: {
                                                        type: "string",
                                                        example: "Immortal",
                                                    },
                                                    textColor: {
                                                        type: "string",
                                                        example: "#EF3B3B",
                                                    },
                                                    backgroundColor: {
                                                        type: "string",
                                                        example: "#EF3B3B1A",
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        "/admin/notify": {
            post: {
                summary: "Send notification to users",
                tags: ["Админка"],
                parameters: [
                    {
                        name: "body",
                        in: "body",
                        description: "Notification details",
                        required: true,
                        schema: {
                            type: "object",
                            properties: {
                                title: {
                                    type: "string",
                                    example: "Киффлом",
                                },
                                sender: {
                                    type: "string",
                                    example: "Админ",
                                },
                                userIDs: {
                                    type: "array",
                                    items: {
                                        type: "number",
                                        example: 1,
                                    },
                                },
                                date: {
                                    type: "string",
                                    example: "2024-08-21T20:05:00.000+05:00",
                                },
                                content: {
                                    type: "string",
                                    example: "Контент",
                                },
                            },
                        },
                    },
                ],
                responses: {
                    200: {
                        description: "OK",
                        schema: {
                            type: "object",
                            properties: {
                                notify: {
                                    type: "object",
                                    properties: {
                                        id: {
                                            type: "number",
                                            example: 6,
                                        },
                                        title: {
                                            type: "string",
                                            example: "Киффлом",
                                        },
                                        content: {
                                            type: "string",
                                            example: "Контент",
                                        },
                                        sender: {
                                            type: "string",
                                            example: "Админ",
                                        },
                                        notifyTypeId: {
                                            type: "number",
                                            example: 1,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        "/admin/role": {
            get: {
                summary: "Get roles",
                tags: ["Админка"],
                parameters: [
                    {
                        name: "limit",
                        in: "query",
                        description:
                            "Limit the number of roles returned (optional)",
                        required: false,
                        type: "integer",
                    },
                ],
                responses: {
                    200: {
                        description: "OK",
                        schema: {
                            type: "object",
                            properties: {
                                roles: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            id: {
                                                type: "number",
                                                example: 1,
                                            },
                                            role: {
                                                type: "string",
                                                example: "Immortal",
                                            },
                                            textColor: {
                                                type: "string",
                                                example: "#EF3B3B",
                                            },
                                            backgroundColor: {
                                                type: "string",
                                                example: "#EF3B3B1A",
                                            },
                                            permissionsCount: {
                                                type: "number",
                                                example: 29,
                                            },
                                            usersCount: {
                                                type: "number",
                                                example: 1,
                                            },
                                        },
                                    },
                                },
                                totalCount: {
                                    type: "number",
                                    example: 1,
                                },
                                isLast: {
                                    type: "boolean",
                                    example: true,
                                },
                                elementsCount: {
                                    type: "number",
                                    example: 1,
                                },
                            },
                        },
                    },
                },
            },
            post: {
                summary: "Create role",
                tags: ["Админка"],
                parameters: [
                    {
                        name: "body",
                        in: "body",
                        description: "Role details",
                        required: true,
                        schema: {
                            type: "object",
                            properties: {
                                role: {
                                    type: "string",
                                    example: "1233",
                                },
                                permissions: {
                                    type: "array",
                                    items: {
                                        type: "number",
                                        example: 8,
                                    },
                                },
                                textColor: {
                                    type: "string",
                                    example: "#AAAB",
                                },
                                backgroundColor: {
                                    type: "string",
                                    example: "#DDDB",
                                },
                            },
                        },
                    },
                ],
                responses: {
                    200: {
                        description: "OK",
                        schema: {
                            type: "object",
                            properties: {
                                role: {
                                    type: "object",
                                    properties: {
                                        id: {
                                            type: "number",
                                            example: 2,
                                        },
                                        role: {
                                            type: "string",
                                            example: "1233",
                                        },
                                        textColor: {
                                            type: "string",
                                            example: "#AAAB",
                                        },
                                        backgroundColor: {
                                            type: "string",
                                            example: "#DDDB",
                                        },
                                        permissionsCount: {
                                            type: "number",
                                            example: 8,
                                        },
                                        usersCount: {
                                            type: "number",
                                            example: 0,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            put: {
                summary: "Update role",
                tags: ["Админка"],
                parameters: [
                    {
                        name: "body",
                        in: "body",
                        description: "Updated role details",
                        required: true,
                        schema: {
                            type: "object",
                            properties: {
                                id: {
                                    type: "number",
                                    example: 1,
                                },
                                role: {
                                    type: "string",
                                    example: "Роль с правами 1 2 3 4 6",
                                },
                                permissions: {
                                    type: "array",
                                    items: {
                                        type: "number",
                                        example: 4,
                                    },
                                },
                                textColor: {
                                    type: "string",
                                    example: "#AAAB",
                                },
                                backgroundColor: {
                                    type: "string",
                                    example: "#DDDB",
                                },
                            },
                        },
                    },
                ],
                responses: {
                    200: {
                        description: "OK",
                        schema: {
                            type: "object",
                            properties: {
                                role: {
                                    type: "object",
                                    properties: {
                                        id: {
                                            type: "number",
                                            example: 1,
                                        },
                                        role: {
                                            type: "string",
                                            example: "Роль с правами 1 2 3 4 6",
                                        },
                                        textColor: {
                                            type: "string",
                                            example: "#AAAB",
                                        },
                                        backgroundColor: {
                                            type: "string",
                                            example: "#DDDB",
                                        },
                                        permissionsCount: {
                                            type: "number",
                                            example: 8,
                                        },
                                        usersCount: {
                                            type: "number",
                                            example: 0,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        "/admin/role/give": {
            post: {
                summary: "Assign role to user",
                tags: ["Админка"],
                parameters: [
                    {
                        name: "body",
                        in: "body",
                        description: "Assignment details",
                        required: true,
                        schema: {
                            type: "object",
                            properties: {
                                userId: {
                                    type: "number",
                                    example: 1,
                                },
                                roleId: {
                                    type: "number",
                                    example: 23,
                                },
                            },
                        },
                    },
                ],
                responses: {
                    200: {
                        description: "OK",
                        schema: {
                            type: "object",
                            properties: {
                                error: {
                                    type: "boolean",
                                    example: false,
                                },
                                message: {
                                    type: "string",
                                    example: "Успешно",
                                },
                            },
                        },
                    },
                },
            },
        },
        "/admin/subject": {
            get: {
                summary: "Get subjects",
                tags: ["Админка"],
                responses: {
                    200: {
                        description: "OK",
                        schema: {
                            type: "object",
                            properties: {
                                totalCount: {
                                    type: "number",
                                    example: 1,
                                },
                                subjects: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            id: {
                                                type: "number",
                                                example: 2,
                                            },
                                            subject: {
                                                type: "string",
                                                example: "Информатика2",
                                            },
                                            isPublished: {
                                                type: "boolean",
                                                example: true,
                                            },
                                            subjectTasksCount: {
                                                type: "number",
                                                example: 6,
                                            },
                                            tasksCount: {
                                                type: "number",
                                                example: 0,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            post: {
                summary: "Create a new subject",
                tags: ["Админка"],
                parameters: [
                    {
                        name: "body",
                        in: "body",
                        description: "Subject details",
                        required: true,
                        schema: {
                            type: "object",
                            properties: {
                                subject: {
                                    type: "string",
                                    example: "Информатика2",
                                },
                                subjectTasks: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            theme: {
                                                type: "string",
                                                example: "Тема 1",
                                            },
                                            primaryScore: {
                                                type: "string",
                                                example: "1",
                                            },
                                            isDetailedAnswer: {
                                                type: "boolean",
                                                example: false,
                                            },
                                            subThemes: {
                                                type: "array",
                                                items: {
                                                    type: "object",
                                                    properties: {
                                                        subTheme: {
                                                            type: "string",
                                                            example:
                                                                "Подтема 1",
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                                durationMinutes: {
                                    type: "integer",
                                    example: 240,
                                },
                                isMark: {
                                    type: "boolean",
                                    example: false,
                                },
                                isPublished: {
                                    type: "boolean",
                                    example: true,
                                },
                            },
                        },
                    },
                ],
                responses: {
                    200: {
                        description: "OK",
                        schema: {
                            type: "object",
                            properties: {
                                subject: {
                                    type: "object",
                                    properties: {
                                        id: {
                                            type: "number",
                                            example: 1,
                                        },
                                        subject: {
                                            type: "string",
                                            example: "Информатика2",
                                        },
                                        isPublished: {
                                            type: "boolean",
                                            example: true,
                                        },
                                        subjectTasksCount: {
                                            type: "number",
                                            example: 6,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            put: {
                summary: "Update subject by ID",
                tags: ["Админка"],
                parameters: [
                    {
                        name: "body",
                        in: "body",
                        description: "Updated subject details",
                        required: true,
                        schema: {
                            type: "object",
                            properties: {
                                id: {
                                    type: "number",
                                    example: 1,
                                },
                                subject: {
                                    type: "string",
                                    example: "Предмет бла",
                                },
                                durationMinutes: {
                                    type: "integer",
                                    example: 255,
                                },
                                isMark: {
                                    type: "boolean",
                                    example: true,
                                },
                                isPublished: {
                                    type: "boolean",
                                    example: false,
                                },
                                subjectTasks: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            theme: {
                                                type: "string",
                                                example: "Тема 1 измененная",
                                            },
                                            primaryScore: {
                                                type: "integer",
                                                example: 5,
                                            },
                                            isDetailedAnswer: {
                                                type: "boolean",
                                                example: false,
                                            },
                                            subThemes: {
                                                type: "array",
                                                items: {
                                                    type: "object",
                                                    properties: {
                                                        subTheme: {
                                                            type: "string",
                                                            example:
                                                                "Подтема 1 измененная",
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                ],
                responses: {
                    200: {
                        description: "OK",
                        schema: {
                            type: "object",
                            properties: {
                                subject: {
                                    type: "object",
                                    properties: {
                                        id: {
                                            type: "number",
                                            example: 1,
                                        },
                                        subject: {
                                            type: "string",
                                            example: "Предмет бла",
                                        },
                                        isPublished: {
                                            type: "boolean",
                                            example: false,
                                        },
                                        subjectTasksCount: {
                                            type: "number",
                                            example: 2,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            delete: {
                summary: "Delete subject by ID",
                tags: ["Админка"],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "ID of the subject to delete",
                        required: true,
                        type: "integer",
                    },
                ],
                responses: {
                    200: {
                        description: "OK",
                        schema: {
                            type: "object",
                            properties: {
                                subject: {
                                    type: "object",
                                    properties: {
                                        id: {
                                            type: "number",
                                            example: 1,
                                        },
                                        subject: {
                                            type: "string",
                                            example: "Предмет бла",
                                        },
                                        isPublished: {
                                            type: "boolean",
                                            example: false,
                                        },
                                        subjectTasksCount: {
                                            type: "number",
                                            example: 2,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        "/admin/task": {
            post: {
                summary: "Create task",
                tags: ["Админка"],
                parameters: [
                    {
                        name: "body",
                        in: "body",
                        description: "Task details",
                        required: true,
                        schema: {
                            type: "object",
                            properties: {
                                subThemeId: {
                                    type: "number",
                                    example: 12,
                                },
                                task: {
                                    type: "string",
                                    example: "Задание 1231516",
                                },
                                solution: {
                                    type: "string",
                                    example: "Решение",
                                },
                                answer: {
                                    type: "string",
                                    example: "Ответ",
                                },
                                isVerified: {
                                    type: "boolean",
                                    example: true,
                                },
                            },
                        },
                    },
                ],
                responses: {
                    200: {
                        description: "OK",
                        schema: {
                            type: "object",
                            properties: {
                                task: {
                                    type: "object",
                                    properties: {
                                        id: {
                                            type: "number",
                                            example: 1,
                                        },
                                        number: {
                                            type: "number",
                                            example: 1,
                                        },
                                        subject: {
                                            type: "string",
                                            example: "Информатика2",
                                        },
                                        theme: {
                                            type: "string",
                                            example: "Тема 1",
                                        },
                                        subTheme: {
                                            type: "string",
                                            example: "Подтема 1",
                                        },
                                        user: {
                                            type: "object",
                                            properties: {
                                                id: {
                                                    type: "number",
                                                    example: 2,
                                                },
                                                nickname: {
                                                    type: "string",
                                                    example: "l4ndar",
                                                },
                                                avatar: {
                                                    type: "string",
                                                    example: null,
                                                },
                                            },
                                        },
                                        date: {
                                            type: "string",
                                            example: "2023-12-23T06:25:49.906Z",
                                        },
                                        task: {
                                            type: "string",
                                            example: "Задание 1231516",
                                        },
                                        isVerified: {
                                            type: "boolean",
                                            example: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            put: {
                summary: "Update task",
                tags: ["Админка"],
                parameters: [
                    {
                        name: "body",
                        in: "body",
                        description: "Updated task details",
                        required: true,
                        schema: {
                            type: "object",
                            properties: {
                                id: {
                                    type: "number",
                                    example: 1,
                                },
                                subThemeId: {
                                    type: "number",
                                    example: 12,
                                },
                                task: {
                                    type: "string",
                                    example:
                                        "Задание перенесено из подтемы 189 в подтему 188 (2)",
                                },
                                solution: {
                                    type: "string",
                                    example: "Решение",
                                },
                                answer: {
                                    type: "string",
                                    example: "Ответ",
                                },
                                isVerified: {
                                    type: "boolean",
                                    example: true,
                                },
                            },
                        },
                    },
                ],
                responses: {
                    200: {
                        description: "OK",
                        schema: {
                            type: "object",
                            properties: {
                                task: {
                                    type: "object",
                                    properties: {
                                        id: {
                                            type: "number",
                                            example: 1,
                                        },
                                        number: {
                                            type: "number",
                                            example: 1,
                                        },
                                        subject: {
                                            type: "string",
                                            example: "Информатика2",
                                        },
                                        theme: {
                                            type: "string",
                                            example: "Тема 1",
                                        },
                                        subTheme: {
                                            type: "string",
                                            example: "Подтема 1",
                                        },
                                        user: {
                                            type: "object",
                                            properties: {
                                                id: {
                                                    type: "number",
                                                    example: 2,
                                                },
                                                nickname: {
                                                    type: "string",
                                                    example: "l4ndar",
                                                },
                                                avatar: {
                                                    type: "string",
                                                    example: null,
                                                },
                                            },
                                        },
                                        date: {
                                            type: "string",
                                            example: "2023-12-23T06:25:49.906Z",
                                        },
                                        task: {
                                            type: "string",
                                            example:
                                                "Задание перенесено из подтемы 189 в подтему 188 (2)",
                                        },
                                        isVerified: {
                                            type: "boolean",
                                            example: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        "/admin/task/{id}": {
            get: {
                summary: "Get task by ID",
                tags: ["Админка"],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "ID of the task",
                        required: true,
                        type: "integer",
                    },
                ],
                responses: {
                    200: {
                        description: "OK",
                        schema: {
                            type: "object",
                            properties: {
                                task: {
                                    type: "object",
                                    properties: {
                                        id: {
                                            type: "number",
                                            example: 1,
                                        },
                                        subject: {
                                            type: "object",
                                            properties: {
                                                id: {
                                                    type: "number",
                                                    example: 2,
                                                },
                                                subject: {
                                                    type: "string",
                                                    example: "Информатика2",
                                                },
                                            },
                                        },
                                        subjectTask: {
                                            type: "object",
                                            properties: {
                                                id: {
                                                    type: "number",
                                                    example: 9,
                                                },
                                                number: {
                                                    type: "number",
                                                    example: 1,
                                                },
                                                theme: {
                                                    type: "string",
                                                    example: "Тема 1",
                                                },
                                            },
                                        },
                                        subTheme: {
                                            type: "object",
                                            properties: {
                                                id: {
                                                    type: "number",
                                                    example: 12,
                                                },
                                                subTheme: {
                                                    type: "string",
                                                    example: "Подтема 1",
                                                },
                                            },
                                        },
                                        isVerified: {
                                            type: "boolean",
                                            example: true,
                                        },
                                        task: {
                                            type: "string",
                                            example:
                                                "Задание перенесено из подтемы 189 в подтему 188 (2)",
                                        },
                                        solution: {
                                            type: "string",
                                            example: "Решение",
                                        },
                                        answer: {
                                            type: "string",
                                            example: "Ответ",
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            delete: {
                summary: "Delete task by ID",
                tags: ["Админка"],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "ID of the task to delete",
                        required: true,
                        type: "integer",
                    },
                ],
                responses: {
                    200: {
                        description: "OK",
                        schema: {
                            type: "object",
                            properties: {
                                task: {
                                    type: "object",
                                    properties: {
                                        id: {
                                            type: "number",
                                            example: 1,
                                        },
                                        number: {
                                            type: "number",
                                            example: 1,
                                        },
                                        subject: {
                                            type: "string",
                                            example: "Информатика2",
                                        },
                                        theme: {
                                            type: "string",
                                            example: "Тема 1",
                                        },
                                        subTheme: {
                                            type: "string",
                                            example: "Подтема 1",
                                        },
                                        user: {
                                            type: "object",
                                            properties: {
                                                id: {
                                                    type: "number",
                                                    example: 2,
                                                },
                                                nickname: {
                                                    type: "string",
                                                    example: "l4ndar",
                                                },
                                                avatar: {
                                                    type: "string",
                                                    example: null,
                                                },
                                            },
                                        },
                                        date: {
                                            type: "string",
                                            example: "2023-12-23T06:25:49.906Z",
                                        },
                                        task: {
                                            type: "string",
                                            example:
                                                "Задание перенесено из подтемы 189 в подтему 188 (2)",
                                        },
                                        isVerified: {
                                            type: "boolean",
                                            example: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};
