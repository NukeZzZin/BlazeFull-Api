import express from "express";
import functions from "../utils/scripts";
import snowflake from "../utils/snowflake";
import UserModel, { UserInterface } from "../models/user"
import logger from "src/utils/logger";

const router: express.Router = express.Router()

router.post("/api/v2/recaptcha/:id", async (request, response) => {
    
});



module.exports = router;