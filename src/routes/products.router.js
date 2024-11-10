import { Router } from "express";
import { ProductController } from "../controller/ProductController.js";


const router = Router();

// Obtener todos los productos
router.get('/', ProductController.getProduct);

// Obtener producto por ID
router.get("/:pid", ProductController.getProductBy);

// Agregar un nuevo producto
router.post("/", ProductController.addNewProduct);

// Actualizar un producto por ID
router.put("/:pid", ProductController.updateProduct);

// Eliminar un producto
router.delete("/:pid", ProductController.deleteProduct);

export default router;
