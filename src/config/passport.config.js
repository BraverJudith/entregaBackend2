
import passport from "passport";
import local from "passport-local";
import github from "passport-github2";
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { UsersManagerDB } from "../dao/db/users.managerdb.js";
import { createHash, isValidPassword } from "../utils.js";
import  { config } from "./config.js";
// Función para extraer el token JWT de la cookie llamada "token"
const cookieExtractor = req => req?.cookies?.token || null;

export const initPassport = () => {
    // Estrategia JWT "current" para autenticación con token desde la cookie
    passport.use("current",
        new JwtStrategy(
            {
                jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
                secretOrKey: config.JWT_SECRET
            },
            async (jwt_payload, done) => {
                try {
                    const user = await UsersManagerDB.findById(jwt_payload.id);
                    return user ? done(null, user) : done(null, false);
                } catch (error) {
                    return done(error, false);
                }
            }
        )
    );

    // Estrategia de GitHub
    passport.use("github", new github.Strategy(
        {
            clientID: config.GITHUB_CLIENT_ID,
            clientSecret: config.GITHUB_CLIENT_SECRET,
            callbackURL: config.GITHUB_CALLBACK_URL
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const { name, email } = profile._json;
                const [first_name, last_name] = name ? name.split(" ") : ["", ""]; 
                const userData = {
                    first_name: first_name || "Nombre desconocido",
                    last_name: last_name || "Apellido desconocido",
                    email: email || `${profile.username}@github.com`,
                    age: null,
                    password: "", 
                    role: "user",
                };
    
                let user = await UsersManagerDB.getUserBy({ email: userData.email });
                if (!user) {
                    user = await UsersManagerDB.createUser(userData);
                }
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));

    // Estrategia de registro
    passport.use("registro",
        new local.Strategy(
            {
                passReqToCallback: true,
                usernameField: "email"
            },
            async (req, username, password, done) => {
                try {
                    const { first_name, last_name, age, role } = req.body;
                    if (!first_name || !last_name || !age) {
                        return done(null, false, { message: `Nombre, apellido y edad son requeridos` });
                    }
                    if(role){
                        role = role.toLowerCase()
                        if(role !== "admin" || role !== "user"){
                            return done(null, false, {message: `solo se admite rol user/admin`})
                        }
                    }
                    let exist = await UsersManagerDB.getUserBy({ email: username });
                    if (exist) {
                        return done(null, false, { message: `El usuario ${username} ya existe` });
                    }
                    const hashedPassword = createHash(password);
                    let newUser = await UsersManagerDB.createUser({
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
                    let user = await UsersManagerDB.getUserBy({ email: username });
                    console.log('Usuario encontrado:', user);
                    if (!user) {
                        return done(null, false, { message: 'Usuario no encontrado' });
                    }
                    if (isValidPassword(user, password)) {
                        return done(null, false, { message: 'Contraseña incorrecta' });
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

    // passport.serializeUser((user, done) =>{
    //     done(null, user._id);
    // });
    // passport.deserializeUser(async (id, done) => {
    //     let user = await userService.findById(id);
    //     done(null, user);
    // });
