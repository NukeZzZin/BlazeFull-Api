import express from "express";
import functions from "../utils/scripts";
import snowflake from "../utils/snowflake";
import UserModel, { UserInterface } from "../models/user"
import logger from "src/utils/logger";

const router: express.Router = express.Router()

router.post("/api/v2/register", async (request, response) => {
    const user_form: UserInterface = {
        username: request.body.username,
        avatar: null,
        email: request.body.email,
        id: `${snowflake.GenerateUUID()}`,
        verified: false,
        discriminator: functions.RandomIntBetween(1, 9999).toString().padStart(4, "0"),
        createdAt: new Date().toUTCString(),
        password: await functions.GenerateHashPassword(request.body.password, 12),
        phone: null
    }
    await new UserModel(user_form).save();
    return response.send({ token: await functions.GenerateToken(user_form.id) });
});



module.exports = router;