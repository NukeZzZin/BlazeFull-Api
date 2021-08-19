import express from "express";
import UserModel, { UserInterface } from "../models/user";
import functions from "../utils/scripts";
import snowflake from "../utils/snowflake";

const router: express.Router = express.Router()

router.post("/api/v2/auth/register", async (request, response) => {
    if (!request.body.username && !request.body.email && !request.body.password) return response.json({ code: 50035, message: "Invalid Form Body", success: false }).status(400);
    if (await UserModel.findOne({ email: request.body.email }).exec().catch((e) => response.json({ code: 500, message: "Internal Server Error", success: false }).status(500))) return response.json({ code: 50035, message: "Email Already Registered", success: false }).status(400);
    if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g.test(request.body.email.toLowerCase())) return response.json({ code: 50035, message: "Email Format Is Invalid", success: false }).status(400);
    const user_form: UserInterface = {
        username: request.body.username,
        avatar: null,
        email: request.body.email.toLowerCase(),
        id: `${snowflake.GenerateUUID()}`,
        verified: false,
        discriminator: functions.RandomIntBetween(1, 9999).toString().padStart(4, "0"),
        createdAt: new Date().toUTCString(),
        password: await functions.GenerateHashPassword(request.body.password, 12),
        phone: null,
        actived: false
    }
    await new UserModel(user_form).save();
    return response.json({ code: 0, message: await functions.GenerateToken(user_form.id), success: true }).status(200);
});

module.exports = router;