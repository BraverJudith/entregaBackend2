import {fileURLToPath} from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import passport from 'passport';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const createHash = password => bcrypt.hashSync(password,bcrypt.genSaltSync(10));
export const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password);
};

export const procesaErrores = (res, error) =>{
    console.log(error);
    res.setHeader('Content-Type','application/json');
    return res.status(500).json(
        {
            error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
            // detalle:`${error.message}`
        }
    )
    
}
export const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function (error, user, info) {
            if (error) {
                return next(error)
            }
            if(!user) {
                return res.status(401).send({error: info.message ? info.message : info.toString() }); 
            }
            req.user = user; 
            next(); 
        })(req, res, next)
    }
}

//Middleware de autorizacion con passport: 

export const auth = (role) => {
    return async (req, res, next) => {
        if(req.user.role !== role) {
            return res.status(403).send({error: "No tenemos permiso para ingresar amiguitooooooooo jajajjajajja (risa malvada)"}); 
        }
        next();
    }
}

export default __dirname;