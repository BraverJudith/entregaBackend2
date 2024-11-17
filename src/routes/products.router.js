import { Router } from "express";
import { ProductController } from "../controller/ProductController.js";
import { verificarRol, isAdmin } from "../middleware/auth.js"; 
import { passportCall } from "../utils.js";


const router = Router();

// Obtener todos los productos
router.get('/', passportCall("current"), ProductController.getProduct);

// Obtener producto por ID
router.get("/:pid", ProductController.getProductBy);

// Agregar un nuevo producto
router.post("/", passportCall("current"), verificarRol(["admin"]), ProductController.addNewProduct);

// Actualizar un producto por ID
router.put("/:pid", passportCall("current"), verificarRol(["admin"]), ProductController.updateProduct);

// Eliminar un producto
router.delete("/:pid", passportCall("current"), isAdmin, ProductController.deleteProduct);

export default router;
