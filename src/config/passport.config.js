
import passport from "passport";
import local from "passport-local";
import github from "passport-github2";
import session from 'express-session';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { UsersManagerDB } from "../dao/db/users.managerdb.js";
import { createHash, isValidPassword } from "../utils.js";
import { config } from "../config/config.js"

const opts = {
    jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req.cookies.token
    ]),
    secretOrKey: config.JWT_SECRET
};

export const initPassport = () => {

    passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
        try {
            const user = await UsersManagerDB.findById(jwt_payload.id);
            if (user) {
                return done(null, user);
            }
            return done(null, false);
        } catch (error) {
            return done(error, false);
        }
    }));
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
                    email: email || `${profile.username}@github.com`, // Usar username como email alternativo si email no está disponible
                    age: null,
                    password: "", 
                    role: "user",
                };
    
                // Comprobar si el usuario ya existe en la base de datos
                let user = await UsersManagerDB.getUserBy({ email: userData.email });
                if (!user) {
                    // Si el usuario no existe lo crea
                    user = await UsersManagerDB.createUser(userData);
                }
    
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));
    passport.use("registro",
        new local.Strategy(
            {
                passReqToCallback: true,
                usernameField: "email"
            },
            async (req, username, password, done) => {
                try {
                    const { first_name, last_name, age } = req.body;
    
                    if (!first_name || !last_name || !age) {
                        return done(null, false, { message: 'Nombre, apellido y edad son requeridos' });
                    }
    
                    // Verificar si el usuario ya existe
                    let exist = await UsersManagerDB.getUserBy({ email: username });
                    if (exist) {
                        return done(null, false, { message: 'El usuario ya existe' });
                    }
                    const hashedPassword = createHash(password);
                    let newUser = await UsersManagerDB.createUser({
                        first_name,
                        last_name,
                        email: username,
                        age,
                        password: hashedPassword,
                        role: "user"
                    });
    
                    return done(null, newUser);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );
    
    passport.use("login",
        new local.Strategy(
            {
                usernameField: "email"
            },
            async (username, password, done) => {
                try {
                    let user = await UsersManagerDB.getUserBy({ email: username });
                    console.log('Usuario encontrado:', user); // Muestra el usuario encontrado
    
                    if (!user) {
                        return done(null, false, { message: 'Usuario no encontrado' });
                    }
    
                    console.log('Contraseña proporcionada:', password); // Muestra la contraseña proporcionada
                    console.log('Contraseña almacenada:', user.password); // Muestra la contraseña hasheada
    
                    // Verifica la contraseña
                    if (!isValidPassword(user, password)) {
                        return done(null, false, { message: 'Contraseña incorrecta' });
                    }
    
                    delete user.password; // Eliminar la contraseña del objeto antes de enviarlo
                    return done(null, user);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );
    
    
    // passport.serializeUser((user, done) =>{
    //     done(null, user._id);
    // });
    // passport.deserializeUser(async (id, done) => {
    //     let user = await userService.findById(id);
    //     done(null, user);
    // });
}