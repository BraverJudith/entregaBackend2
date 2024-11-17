import passport from "passport";
import local from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { userService } from "../services/User.service.js";
import { isValidPassword } from "../utils.js";
import { config } from "./config.js";
import  UserDTO  from "../dto/UserDTO.js";

const searchToken = (req) => {
    let token = null;
    if (req.cookies && req.cookies.sestok) {
        token = req.cookies.sestok;
    }
    return token;
};

export const initPassport = () => {
    passport.use("current",
        new JwtStrategy(
            {
                jwtFromRequest: ExtractJwt.fromExtractors([searchToken]),
                secretOrKey: config.JWT_SECRET
            },
            async (jwt_payload, done) => {
                try {
                    const usuario=await userService.findById(jwt_payload.id)
                    if(!usuario){
                        return done (null,false)
                    }
                    const usuarioDTO = new UserDTO(usuario);
                    return done(null, usuarioDTO);
                    } catch (error) {
                    return done(error);
                    }
            }
        )
    );

    // Estrategia de registro
    passport.use(
        "registro",
        new local.Strategy(
            {
                passReqToCallback: true,
                usernameField: "email"
            },
            async (req, username, password, done) => {
                try {
                    const { first_name, last_name, age } = req.body;
    
                    // Validar campos básicos
                    if (!first_name || !last_name || !age || !password) {
                        return done(null, false, { message: "Todos los campos son obligatorios" });
                    }
    
                    // Verificar si el usuario ya existe
                    const exist = await userService.getUserByEmail(username);
                    if (exist) {
                        return done(null, false, { message: `El usuario ${username} ya existe` });
                    }
    
                    // Si pasa las validaciones, continuar al controller
                    return done(null, { first_name, last_name, age, email: username, password });
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
                    if (isValidPassword(user, password)) { 
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