import { ProductDao } from "../dao/ProductDAO";

export class ProductController {
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
        res.json({
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
    static getProductBy = async (req, res) => {
        const { pid } = req.params;
        try {
        const product = await productManagerDB.getProductById(pid);
        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" });
        } else {
            res.render("productDetail", { product });
        }
        } catch (error) {
        procesaErrores(res, error);
        }
    };
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
        // Verificar si el código ya existe
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
        res.status(201).json({ message: "Producto agregado con éxito" });
        } catch (error) {
        procesaErrores(res, error);
        }
    }
}
/*try {
    
}*/
