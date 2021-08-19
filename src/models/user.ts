import mongoose, { Schema, Document } from "mongoose";

export interface UserInterface {
    username: string;
    avatar: string | null;
    email: string;
    id: string;
    verified: boolean;
    discriminator: string;
    createdAt: string | Date;
    password: string;
    phone: string | null;
    actived: boolean
}

export interface UserDocument extends UserInterface, Document {
    id: string
}

export const UserSchema: Schema = new Schema({
    username: { type: String, required: true },
    avatar: { type: String, required: false, default: null },
    email: { type: String, required: true, unique: true },
    id: { type: String, required: true, unique: true },
    verified: { type: Boolean, required: true, default: false },
    discriminator: { type: String, required: true },
    createdAt: { type: String, required: true, default: new Date().toUTCString() },
    password: { type: String, required: true },
    phone: { type: String, required: false, default: null },
    actived: { type: Boolean, required: false, default: false }
    // birth: { type: Date, required: true }
});

const UserModel = mongoose.model<UserDocument>("UserSchema", UserSchema);

export default UserModel;