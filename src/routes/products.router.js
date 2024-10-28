import { Router } from "express";
import ProductManagerDB from "../dao/db/product.managerdb.js";
import ProductModel from "../dao/models/product.model.js";
import { procesaErrores } from "../utils.js";


const router = Router();
const productManagerDB = new ProductManagerDB();

// Obtener todos los productos

router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort = 'asc', query = '' } = req.query;
        const sortOption = sort === 'desc' ? { price: -1 } : { price: 1 };

        const productos = await productManagerDB.getProducts(
            {}, 
            {
                limit: parseInt(limit, 10),
                page: parseInt(page, 10),
                sort: sortOption,
                query: query
            }
        );

        res.json({
            payload: productos.docs,
            totalPages: productos.totalPages,
            prevPage: productos.prevPage,
            nextPage: productos.nextPage,
            page: productos.page,
            hasPrevPage: productos.hasPrevPage,
            hasNextPage: productos.hasNextPage,
            prevLink: productos.hasPrevPage ? `/api/products?page=${productos.prevPage}&limit=${limit}&sort=${sort}&query=${query}` : null,
            nextLink: productos.hasNextPage ? `/api/products?page=${productos.nextPage}&limit=${limit}&sort=${sort}&query=${query}` : null,
            isAsc: sort === 'asc',
            isDesc: sort === 'desc'
        });

    } catch (error) {
        procesaErrores(res,error);
    }
});




// Obtener producto por ID
router.get("/:pid", async (req, res) => { 
    const { pid } = req.params;
    try{
        const product = await productManagerDB.getProductById(pid);   
        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" });
        } else {
            res.render('productDetail', { product });
        }
    } catch (error) {
        procesaErrores(res,error);
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
        procesaErrores(res,error);
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
