import SessionsService from '../services/Session.service.js';

export class SessionsController {
    static async registro(req, res) {
        try {
            const user = req.user;
            res.status(201).json({
                message: `Registro exitoso para ${user.name}`,
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
            res.status(200).json({
                message: `Login exitoso para ${user.first_name}`,
                usuarioLogueado: user,
                token
            });
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

