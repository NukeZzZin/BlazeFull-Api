import express from "express";
import functions from "../utils/scripts";
import bcrypt from "bcrypt";
import UserModel, { UserInterface } from "../models/user";

const router: express.Router = express.Router()

router.post("/api/v2/login", async (request, response) => {
    const user_form = await UserModel.findOne({ email: request.body.email }).exec().catch((error) => {
        response.json({  }).status(400)
    });
    if (!user_form) return response.status(400)
    if (!await bcrypt.compare(request.body.password, user_form?.password)) return response.status(404)

    response.json({ token: await functions.GenerateToken(user_form?.id) }).status(200);
});

module.exports = router;