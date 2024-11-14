import { userService } from "../services/User.service.js";
import { createHash, isValidPassword } from "../utils.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

class UserController {
    async register(req, res) {
        const { first_name, last_name, email, age, password, role } = req.body;
        try {
            const existingUser = await userService.getUserByEmail(email);
            if (existingUser) {
                return res.status(400).json({ message: "El usuario ya existe" });
            }
            const hashedPassword = createHash(password);
            const newUser = await userService.createUser({
                first_name,
                last_name,
                email,
                age,
                password: hashedPassword,
                role: role.toLowerCase() === "admin" ? "admin" : "user"
            });

            res.status(201).json({ message: "Usuario registrado exitosamente", usuario: newUser });
        } catch (error) {
            res.status(500).json({ message: "Error en el registro", error: error.message });
        }
    }

    async login(req, res) {
        passport.authenticate("login", { session: false }, (error, user, info) => {
            if (error || !user) {
                return res.status(401).json({ message: info ? info.message : 'Error al autenticar' });
            }
            const token = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: "1h" });
            res.cookie("sestoken", token, { httpOnly: true, secure: true });
            res.status(200).json({ message: "Inicio de sesión exitoso", token });
        })(req, res, next);
    }

    async getUserProfile(req, res) {
        try {
            const userId = req.user.id;
            const user = await userService.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }
            res.status(200).json({ usuario: user });
        } catch (error) {
            res.status(500).json({ message: "Error al obtener el perfil", error: error.message });
        }
    }
    
    async getAllUsers(req, res) {
        try {
            const users = await userService.getAllUsers(); // Llama al servicio para obtener todos los usuarios
            res.status(200).json(users); // Devuelve los usuarios como respuesta
        } catch (error) {
            res.status(500).json({ message: "Error al obtener los usuarios", error: error.message });
        }
    }
}

export const userController = new UserController();
