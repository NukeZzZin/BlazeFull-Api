import express from "express";
import UserModel from "../models/user";
import functions from "../utils/scripts";
import bcrypt from "bcrypt";

const router: express.Router = express.Router();

router.post("/api/v2/auth/login", async (request, response) => {
    const callback = await UserModel.findOne({ email: request.body.email }).exec().catch((e) => response.json({ code: 500, message: "Internal Server Error", success: false }));
    if (!request.body.email && !request.body.password) return response.json({ code: 50035, message: "Invalid Form Body", success: false }).status(400);
    if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g.test(request.body.email.toLowerCase())) return response.json({ code: 50035, message: "Email Format Is Invalid", success: false }).status(400);
    if (!callback) return response.json({ code: 50035, message: "Email Does Not Exist", success: false }).status(400);
    if (!await bcrypt.compare(request.body.password, callback?.password)) return response.json({  }).status(400);
    return response.json({ code: 0, message: await functions.GenerateToken(callback?.id), success: true }).status(200);
});

module.exports = router;