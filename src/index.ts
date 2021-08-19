import bodyParser from "body-parser";
import express from "express";
import logger from "./utils/logger";
import dotenv from "dotenv";
import compression from "compression";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";

const app = express();
const router: express.Router = express.Router()

dotenv.config();
app.use(cookieParser());
app.use(compression());
app.use(bodyParser.json({ inflate: true, limit: 1024000 }));
app.use(bodyParser.urlencoded({ extended: true }));

for(const routes of fs.readdirSync(path.resolve(__dirname, "./routes/")).filter(_ => _.endsWith(".ts"))) {
    app.use(require(path.resolve(__dirname, `./routes/${routes}`)));
}

mongoose.connect(`${process.env.MONGO_CONNECTION}`, { useNewUrlParser: true, useUnifiedTopology: true, autoIndex: true }, (error) => {
    if (error) return logger.error("unable to connect to database.");
    app.listen(Number(process.env.PORT) || 8000, () => {
        logger.sucess(`server running in http://localhost:${process.env.PORT || 8000}`);
    });
});