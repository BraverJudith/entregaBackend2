import SessionsService from '../services/Session.service.js';
import { productService } from "../services/Product.service.js";
import { CartService } from "../services/Cart.service.js";
import { userService } from '../services/User.service.js';
import { createHash } from "../utils.js";

export class SessionsController {
    static async registro(req, res) {
        try {
            console.log("Iniciando proceso de registro");
    
            // Datos validados por Passport
            const { first_name, last_name, email, password, age } = req.user;
    
            // Crear un carrito para el usuario
            const cart = await CartService.createCart();
    
            // Crear el usuario con los datos validados
            const user = await userService.createUser({
                first_name,
                last_name,
                email,
                password: createHash(password),
                age,
                cart: cart._id, 
            });
    
            res.status(201).json({ message: "Usuario registrado correctamente", user });
        } catch (error) {
            console.error("Error al registrar el usuario:", error);
            res.status(500).json({ message: "Error al registrar el usuario", error: error.message });
        }
    }
    
    static async login(req, res) {
        try {
            const { token, user } = await SessionsService.login(req, res);
    
            const products = await productService.getProducts();
    
            res.cookie("sestok", token, { httpOnly: true, secure: true });
    
            return res.status(200).json({
                message: "Login exitoso",
                token,
                user,
                products,
            });
    
        } catch (error) {
            return res.status(401).json({ error: error.message });
        }
    }

    static async rutaProtegida(req, res) {
        res.status(200).json({
            message: "Acceso concedido a la ruta protegida",
            usuario: req.user,
        });
    }
    static async current(req, res) {
        if (!req.user) {
            return res.status(401).json({ error: "No autorizado" });
        }
        console.log(req.user)
        res.setHeader("Content-Type", "application/json");
        res.status(200).json({ usuario: req.user });
    };

    static async error(req, res)  {
        res.setHeader("Content-Type", "application/json");
        return res.status(500).json({
        error: "Error al autenticar con passport",
        });
    };
    
    static async pageNotFound (req, res) {
        res.setHeader("Content-Type", "application/json");
        return res.status(404).json({
        error: "page not found | 404",
        detalle: "La ruta solicitada no existe.",
        });
    };

    static async logOut (req, res) {
        res.clearCookie("sestok", { httpOnly: true });
        let { web } = req.query;
        if (web) {
          // Redirigir a la página de login con un mensaje de éxito
            return res.redirect("/login?mensaje=Logout exitoso...!!!");
        }
        res.setHeader("Content-Type", "application/json");
        return res.status(200).json({ payload: "Logout exitoso" });
    };

}

