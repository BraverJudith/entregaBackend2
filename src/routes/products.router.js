import { Router } from "express";
import { procesaErrores } from "../utils.js";
import { ProductController } from "../controller/ProductController.js";


const router = Router();

// Obtener todos los productos
router.get('/', ProductController.getProduct);

// Obtener producto por ID
router.get("/:pid", ProductController.getProductBy);

// Agregar un nuevo producto
router.post("/", ProductController.addNewProduct);

// Actualizar un producto por ID
router.put("/:pid", async (req, res) => {
    const { pid } = req.params;
    const productoActualizado = req.body;
    try {
        await productManagerDB.updateProduct(pid,productoActualizado)
        res.json({
            message: "Producto actualizado exitosamente"
        });
    } catch (error) {
        procesaErrores(res,error);
    }
});

// Eliminar un producto
router.delete("/:pid", async (req, res) => {
    const { pid } = req.params;

    try{
        await productManagerDB.deleteProduct(pid);
        res.status(201).json({
            message: "Producto eliminado con exito"
        });
    } catch (error) {
        procesaErrores(res,error);
    }
});

export default router;
