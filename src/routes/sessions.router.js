import { Router } from 'express';
import passport from 'passport';
import jwt from "jsonwebtoken";
import {config} from '../config/config.js';
import cookieParser from "cookie-parser";

export const router = Router();

router.get('/github', passport.authenticate("github", {}));

router.get("/error", (req, res) => {
    res.status(401).json({ error: 'Error al autenticar'});
});

router.get('/githubcallback',
    passport.authenticate("github", { failureRedirect: "/api/sessions/error" }),
    (req, res) => {
        req.session.user = req.user;
        res.status(200).json({
            message: "Login exitoso",
            usuarioLogueado: req.user
        });
    }
);

router.post("/registro",
    passport.authenticate("registro", { session: false, failureRedirect: "/api/sessions/error" }),
    (req, res) => {
        console.log(req.user);  // Verifica la estructura de req.user
        res.status(201).json({
            message: `Registro exitoso para ${req.user.name}`,
            usuario: req.user
        });
    }
);

router.post("/login", async (req, res) => {
    console.log('Cuerpo de la solicitud de inicio de sesión:', req.body); // Agrega este log
    passport.authenticate("login", { session: false }, async (error, user, info) => {
        if (error || !user) {
            return res.status(401).json({ error: info.message || "Error al autenticar" });
        }
        
        const token = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: "1h" });
        
        return res.status(200).json({
            message: `Login exitoso para ${user.first_name}`,
            usuarioLogueado: user,
            token: token
        });
    })(req, res);
});




export default router;
