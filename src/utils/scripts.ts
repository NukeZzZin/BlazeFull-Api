import logger from "./logger";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const functions = {
    GenerateHashPassword : async (password: string, salts: number): Promise<string> => {
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(salts, (error, salt) => {
                if (error) return logger.error("an error occurred while generating the salts.");
                bcrypt.hash(password, salt, (error, hash) => {
                    if (error) return reject(error);
                    return resolve(hash);
                });
            });
        });
    },

    RandomIntBetween: (minimum: number, maximum: number) => {
        return Math.floor(Math.random() * (maximum - minimum + 1) + minimum);
    },

    // PasswordSecurityLevel : async (password: string): Promise<number> => {
    //     let PasswordSecurityLevel: number = 1;
    //     switch (true) {
    //         case /^(?:([A-Z])*){8,12}$/.test(password) : PasswordSecurityLevel = 2;
    //             break;
    //         case /^(?:([A-Z])*([a-z])*){8,12}$/.test(password) : PasswordSecurityLevel = 3;
    //             break;
    //         case /^(?:([A-Z])*([a-z])*(\d)*){8,12}$/.test(password) : PasswordSecurityLevel = 4;
    //             break;
    //         case /^(?:([A-Z])*([a-z])*(\d)*(\W)*){8,12}$/.test(password) : PasswordSecurityLevel = 5;
    //             break;
    //     }
    //     return PasswordSecurityLevel;
    // },

    GenerateToken : async (id: string, algorithm: string = "HS256"): Promise<string> => {
        return new Promise((resolve, reject) => {
            jwt.sign({ id: id.toString() }, process.env.JWT?.toString(), { algorithm: algorithm }, (error, token) => {
                if (error) return reject(error);
                return resolve(token);
            });
        });
    },
}

export default functions