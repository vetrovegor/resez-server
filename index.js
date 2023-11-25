import express from "express";
import 'dotenv/config';

const PORT = process.env.PORT || 8080;

const app = express();

const start = async() => {
    try {
        app.listen(PORT, () => {
            console.log(`Sever started on port ${PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
}

start();