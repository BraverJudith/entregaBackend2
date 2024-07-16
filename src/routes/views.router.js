import { Router } from "express";
import ProductManager from "../dao/fs/productManager.js"; 

const productManager = new ProductManager("./src/data/products.json");
const router = Router();

router.get("/", async (req, res) => {
    res.redirect("/home");
});

router.get ("/realtimeproducts", async (req,res) => {
    res.render("realtimeproducts");
});

router.get ("/home", async (req,res) => {
    try {
        const productos = await productManager.getProducts();
        res.render("home", { productos });
    } catch (error) {
        console.error("Error al obtener productos", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});
export default router;
