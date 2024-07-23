import { Router } from "express";
import ProductManager from "../dao/db/product.managerdb.js"; 

const productManager = new ProductManager();
const router = Router();

router.get("/", async (req, res) => {
    res.redirect("/home");
});

router.get("/", async (req, res) => {
    res.redirect("/home");
});

router.get ("/realtimeproducts", async (req,res) => {
    res.render("realtimeproducts");
});

router.get('/home', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort = 'asc', query = '', category, availability } = req.query;

        // Configura el ordenamiento basado en el parámetro `sort`
        const sortOption = sort === 'desc' ? { price: -1 } : sort === 'asc' ? { price: 1 } : {};

        // Construye el filtro basado en `query`, `category`, y `availability`
        const filter = {};
        if (query) {
            filter.title = new RegExp(query, 'i');
        }
        if (category) {
            filter.category = category;
        }
        if (availability) {
            filter.status = availability === 'true'; // Asumiendo que availability es 'true' o 'false'
        }

        const productos = await productManager.getProducts(
            filter,
            {
                limit: parseInt(limit, 10),
                page: parseInt(page, 10),
                sort: sortOption
            }
        );
        const prevLink = productos.hasPrevPage ? `/home?page=${productos.prevPage}&limit=${limit}&sort=${sort}&query=${query}&category=${category}&availability=${availability}` : null;
        const nextLink = productos.hasNextPage ? `/home?page=${productos.nextPage}&limit=${limit}&sort=${sort}&query=${query}&category=${category}&availability=${availability}` : null;

        res.render('home', {
            productos: productos.docs,
            totalPages: productos.totalPages,
            prevPage: productos.prevPage,
            nextPage: productos.nextPage,
            currentPage: productos.page,
            hasPrevPage: productos.hasPrevPage,
            hasNextPage: productos.hasNextPage,
            prevLink: prevLink,
            nextLink: nextLink
        });



    } catch (err) {
        console.error('Error al obtener productos:', err);
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener productos'
        });
    }
});

        
router.get ("/carts/:cid", async (req, res) =>{
    const cartId = req.params.cid;

    try{
        const cart = await cartManager.getCartById(cartId);
        if(!cart) {
            console.log(`Cart with ${cartId} not found`);
            return res.status(404).json({ error: "Cart not found"});
        }
        console.log(cart)
        const productsInCart = cart.products.map(item => ({
            product: item.toObject(),
            quantity: item.quantity   
        }));
        res.render("carts", { products: productsInCart}); 
        } catch (error){
        console.error("Error getting the cart", error);
        res.status(500).json({ error: "Internal server error"}); 
        }
    });
export default router;

