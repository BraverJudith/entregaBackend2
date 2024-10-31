import { Router } from 'express';
import passport from 'passport';
import jwt from "jsonwebtoken";
import { config } from '../config/config.js';

export const router = Router();

// Ruta protegida
router.get(
    '/ruta-protegida',
    passport.authenticate("current", { session: false }),
    (req, res) => {
        res.status(200).json({
            message: "Acceso concedido a la ruta protegida",
            usuario: req.user, // Usuario autenticado extraído del token JWT
        });
    }
);

// Ruta de autenticación con GitHub
router.get('/github', passport.authenticate("github", {}));

router.get("/error", (req, res) => {
    res.status(401).json({ error: 'Error al autenticar' });
});

router.get('/githubcallback',
    passport.authenticate("github", { failureRedirect: "/error" }),
    (req, res) => {
        req.session.user = req.user;
        res.status(200).json({
            message: "Login exitoso",
            usuarioLogueado: req.user
        });
    }
);

// Ruta de registro
router.post("/registro",
    passport.authenticate("registro", { session: false, failureRedirect: "/error" }),
    (req, res) => {
        console.log(req.user);
        res.status(201).json({
            message: `Registro exitoso para ${req.user.name}`,
            usuario: req.user
        });
    }
);

// Ruta de inicio de sesión
router.post("/login", async (req, res) => {
    console.log("Datos de entrada:", req.body); // Log de los datos ingresados

    passport.authenticate("login", { session: false }, async (error, user, info) => {
        if (error) {
            console.error("Error en la autenticación:", error); // Log del error
            return res.status(401).json({ error: info.message || "Error al autenticar" });
        }

        if (!user) {
            console.log("Usuario no encontrado:", info.message); // Log si no se encuentra el usuario
            return res.status(401).json({ error: info.message || "Error al autenticar" });
        }

        console.log("Usuario autenticado:", user); // Log del usuario autenticado

        const token = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: "1h" });

        // Guarda el token en la cookie
        res.cookie("token", token, { httpOnly: true, secure: true });

        res.status(200).json({
            message: `Login exitoso para ${user.first_name}`,
            usuarioLogueado: user,
            token: token
        });
    })(req, res);
});


export default router;
