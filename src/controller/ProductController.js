import { ProductDao } from "../dao/ProductDAO.js";
import ProductModel  from "../dao/models/product.model.js";
import { procesaErrores } from "../utils.js";

export class ProductController {
    // Obtener todos los productos
    static getProduct = async (req, res) => {
        try {
        const { limit = 10, page = 1, sort = "asc", query = "" } = req.query;
        const sortOption = sort === "desc" ? { price: -1 } : { price: 1 };
        const productos = await ProductDao.getProducts(
            {},
            {
            limit: parseInt(limit, 10),
            page: parseInt(page, 10),
            sort: sortOption,
            query: query,
            }
        );
        res.setHeader('Content-Type','application/json');
        res.status(201).json({
            payload: productos.docs,
            totalPages: productos.totalPages,
            prevPage: productos.prevPage,
            nextPage: productos.nextPage,
            page: productos.page,
            hasPrevPage: productos.hasPrevPage,
            hasNextPage: productos.hasNextPage,
            prevLink: productos.hasPrevPage ? `/api/products?page=${productos.prevPage}&limit=${limit}&sort=${sort}&query=${query}`: null,
            nextLink: productos.hasNextPage ? `/api/products?page=${productos.nextPage}&limit=${limit}&sort=${sort}&query=${query}`: null,
            isAsc: sort === "asc",
            isDesc: sort === "desc",
        });
        } catch (error) {
        procesaErrores(res, error);
        }
    };
    // Obtener producto por ID
    static getProductBy = async (req, res) => {
        
        const { pid } = req.params;
        console.log(pid)
        try {
        const product = await ProductDao.findById(pid);
        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" });
        } else {
            res.setHeader('Content-Type','application/json');
            res.status(201).render("productDetail", { product });
        }
        } catch (error) {
        procesaErrores(res, error);
        }
    };
    // Agregar un nuevo producto al catalogo
    static addNewProduct = async (req, res) => {
        const {
        title,
        description,
        price,
        code,
        stock,
        category,
        img,
        thumbnails} = req.body;
        if (!title || !description || !price || !code || !stock || !category) {
        return res
            .status(400)
            .json({ message: "Todos los campos son obligatorios" });
        }
        try {
        const productExist = await ProductModel.findOne({ code });
        if (productExist) {
            return res.status(400).json({ message: "El código debe ser único" });
        }
        const newProduct = new ProductModel({
            title,
            description,
            price,
            img,
            code,
            stock,
            category,
            status: true,
            thumbnails: thumbnails || [],
        });
        await ProductDao.addProduct(newProduct);
        res.setHeader('Content-Type','application/json');
        res.status(201).json({ message: "Producto agregado con éxito" });
        } catch (error) {
        procesaErrores(res, error);
        }
    }
    //actualizar producto por ID
    static updateProduct = async (req, res) => {
        const { pid } = req.params;
        const productoActualizado = req.body;
        try {
            await ProductDao.updateProduct(pid,productoActualizado)
            res.status(201).json({
                message: "Producto actualizado exitosamente"
            });
        } catch (error) {
            procesaErrores(res,error);
        }
    }
    static deleteProduct = async (req, res) => {
        const { pid } = req.params;
        try{
            await ProductDao.deleteProduct(pid);
            res.setHeader('Content-Type','application/json')
            res.status(201).json({
                message: "Producto eliminado con exito"
            });
        } catch (error) {
            procesaErrores(res,error);
        }
    }
}
