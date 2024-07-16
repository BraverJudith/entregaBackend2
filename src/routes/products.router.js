import { Router } from "express";
import ProductManagerDB from "../dao/db/product.managerdb.js";
import ProductModel from "../dao/models/product.model.js";


const router = Router();
const productManagerDB = new ProductManagerDB();

// Obtener todos los productos

router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        const options = {
            limit: parseInt(limit),
            skip: (parseInt(page) - 1) * parseInt(limit),
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {}
        };
        const filter = query ? { category: query } : {};

        const products = await productManagerDB.getProducts(filter, options);
        const totalProducts = await ProductModel.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / limit);

        res.json({
            status: 'success',
            payload: products,
            totalPages,
            prevPage: page > 1 ? page - 1 : null,
            nextPage: page < totalPages ? page + 1 : null,
            page: parseInt(page),
            hasPrevPage: page > 1,
            hasNextPage: page < totalPages,
            prevLink: page > 1 ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
            nextLink: page < totalPages ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null
        });
    } catch (err) {
        console.error('Error al obtener productos:', err);
        res.status(500).json({ status: 'error', message: 'Error al obtener productos' });
    }
});

// Obtener producto por ID
router.get("/:pid", async (req, res) => {
    let { pid } = req.params;
    try{
        const product = await productManagerDB.getProductById(pid);   
        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" });
        } else {
            res.json(product);
        }
    } catch (error) {
        console.error ("Error al obtener el producto", error);
        res.status(500).json ({
            error:"Error interno del servidor"
        });
    }
});

// Agregar un nuevo producto
router.post("/", async (req, res) => {
    const newProduct = req.body;
    
    try {
        await productManagerDB.addProduct(newProduct);
        res.status(201).json({
            message: "Producto agregado con exito"
        });
    } catch (error) {
        console.error("Error al agregar el producto", error);
        res.status(500).json({
            error:"Error interno del servidor"
        });
    }  
});

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
        console.error("Error al actualizar el producto", error);
        res.status(500).json({
            error:"Error interno del servidor"
        });
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
        console.error("Error al eliminar el producto", error);
        res.status(500).json({
            error:"Error interno del servidor"
        });
    }
});

export default router;
