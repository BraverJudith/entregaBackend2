import passport from "passport";
import jwt from "jsonwebtoken";
import { config } from '../config/config.js';

class SessionsService {
    static async login(req, res) {
        return new Promise((resolve, reject) => {
            passport.authenticate("login", { session: false }, (error, user, info) => {
                if (error || !user) {
                    return reject(new Error(info?.message || "Error al autenticar"));
                }
                const token = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: "1h" });
                resolve({ token, user });
            })(req, res);
        });
    }
}

export default SessionsService;
