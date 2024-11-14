import passport from "passport";
import local from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { userService } from "../services/User.service.js";
import { createHash, isValidPassword } from "../utils.js";
import { config } from "./config.js";

const cookieExtractor = req => req?.cookies?.token || null;

export const initPassport = () => {
    passport.use("current",
        new JwtStrategy(
            {
                jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
                secretOrKey: config.JWT_SECRET
            },
            async (jwt_payload, done) => {
                try {
                    const user = await userService.findById(jwt_payload.id); 
                    return user ? done(null, user) : done(null, false);
                }  catch (error) {
                    return done(error, false);
                }
            }
        )
    );

    // Estrategia de registro
    passport.use("registro",
        new local.Strategy(
            {
                passReqToCallback: true,
                usernameField: "email"
            },
            async (req, username, password, done) => {
                try {
                    const { first_name, last_name, age } = req.body;
                    let { role } = req.body;
                    if (!first_name || !last_name || !age) {
                        return done(null, false, { message: `Nombre, apellido y edad son requeridos` });
                    }
                    if (role) {
                        role = role.toLowerCase();
                        if (role !== "admin" && role !== "user") {
                            return done(null, false, { message: `Solo se admite rol user/admin` });
                        }
                    }

                    const exist = await userService.getUserByEmail(username); 
                    if (exist) {
                        return done(null, false, { message: `El usuario ${username} ya existe` });
                    }

                    const hashedPassword = createHash(password);
                    const newUser = await userService.createUser({
                        first_name,
                        last_name,
                        email: username,
                        age,
                        password: hashedPassword,
                        role
                    });
                    return done(null, newUser);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    // Estrategia de inicio de sesión
    passport.use("login",
        new local.Strategy(
            {
                usernameField: "email"
            },
            async (username, password, done) => {
                try {
                    const user = await userService.getUserByEmail(username);
                    if (!user) {
                        return done(null, false, { message: 'Usuario no encontrado o Contraseña incorrecta' });
                    }
                    if (!isValidPassword(user, password)) { 
                        return done(null, false, { message: 'Usuario no encontrado o Contraseña incorrecta' });
                    }
                    delete user.password; 
                    return done(null, user);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );
};