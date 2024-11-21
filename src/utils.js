import {fileURLToPath} from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import passport from 'passport';
import nodemailer from 'nodemailer';
import { config } from "./config/config.js";


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
            return res.status(403).send({error: "No tenemos permiso para ingresar"}); 
        }
        next();
    }
}

export const error500 = (res,error)=>{
    console.log(error)
    res.setHeader('Content-Type','application/json');
    return res.status(500).json({
        error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
        detalle: `${error.message}` // Aquí se usa el mensaje del error capturado
    });
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,  
    auth: {
        user: 'szkopbaty@gmail.com',
        pass: config.PASSWORD_MAIL
    }
});


const sendPurchaseEmail = async (toEmail, ticket) => {
    const mailOptions = {
        from: 'szkopbaty@gmail.com',
        to: toEmail,
        subject: 'Confirmación de Compra',
        text: `Gracias por tu compra. Aquí están los detalles de tu compra: 
        Ticket Code: ${ticket.code}
        Monto: ${ticket.amount}`
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error al enviar el correo:', error);
    }
};


export { sendPurchaseEmail };
export default __dirname;