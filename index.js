import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import device from "express-device";
import useragent from "express-useragent";
import cors from "cors";

import { router } from "./routes/router.js";
import { sequelize } from "./db/connection.js";
import "./db/models.js";
import { CORS_OPTIONS } from "./consts/CORS-OPTIONS.js";
import { errorMiddleWare } from "./middlewares/error-middleware.js";

import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "./swagger.js";

const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(device.capture());
app.use(useragent.express());
app.use(cors({ ...CORS_OPTIONS }));
app.use("/api", router);
app.use(errorMiddleWare);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ alter: true });

        app.listen(PORT, () => {
            console.log(`Sever started on port ${PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
};

start();
