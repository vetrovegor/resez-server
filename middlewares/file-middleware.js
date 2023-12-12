import { config } from "../config.js";
import { ApiError } from "../errors/api-error.js";

export const fileMiddleware = (maxMb) => {
    return async (req, res, next) => {
        try {
            const files = req.files;
    
            if (!files || Object.keys(files).length === 0) {
                throw ApiError.badRequest('Файлы не найдены');
            }
    
            for (let fileKey in files) {
                const file = files[fileKey];
                const fileName = file.name;
    
                if (file.size > maxMb * 1024 * 1024) {
                    throw ApiError.badRequest(`Размер файла ${fileName} превышает ${maxMb} МБ`);
                }
            }
    
            next();            
        } catch (e) {
            next(e);
        }
    }
}