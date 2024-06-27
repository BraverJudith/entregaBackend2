import { Router } from "express";
import ProductManager from "../controllers/productManager.js"; 

const productManager = new ProductManager("./src/data/products.json");
const router = Router();

router.get ("/realtimeproducts", async (req,res) => {
    res.render("realtimeproducts");
});

router.get ("/productos", async (req,res) => {
    res.render("home",{});
});
export default router;
