import SessionsService from '../services/Session.service.js';

export class SessionsController {
    static async registro(req, res) {
        try {
            const user = req.user;
            if (!user) { 
                return res.status(400).json({ error: "Error en el registro, usuario no creado." });
            }
            res.status(201).json({
                message: `Registro exitoso para ${user.first_name}`,
                usuario: user
            });
        } catch (error) {
            res.status(500).json({ error: "Error en el registro" });
        }
    }

    static async login(req, res) {
        try {
            const { token, user } = await SessionsService.login(req, res);
            res.cookie("sestok", token, { httpOnly: true, secure: true });
            res.redirect("/api/products?page=1");
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }

    static async rutaProtegida(req, res) {
        res.status(200).json({
            message: "Acceso concedido a la ruta protegida",
            usuario: req.user,
        });
    }
}

