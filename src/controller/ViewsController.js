
import { productService } from "../services/Product.service.js"; 
import { CartService } from "../services/Cart.service.js";

class ViewsController{
    async renderHome (req, res) {
        try {
            const {
                limit = 10,
                page = 1,
                sort = 'asc', // Orden predeterminado
                query = '', // Consulta predeterminada
                category = '', // Categoría predeterminada
                availability = '' // Disponibilidad predeterminada
            } = req.query;
            const products = await productService.getProducts({}, { page, limit });
            const prevLink = products.hasPrevPage ? `/home?page=${products.prevPage}&limit=${limit}&sort=${sort}&query=${query}&category=${category}&availability=${availability}` : null;
            const nextLink = products.hasNextPage ? `/home?page=${products.nextPage}&limit=${limit}&sort=${sort}&query=${query}&category=${category}&availability=${availability}` : null;

            res.render('home', {
                productos: products.docs,
                totalPages: products.totalPages,
                prevPage: products.prevPage,
                nextPage: products.nextPage,
                currentPage: products.page,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
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
    };

    async renderRealtimeProducts (req, res) {
        res.render("realtimeproducts");
    };

    async renderLogin (req, res) {
        res.render('login');
    };

    async renderCart (req, res) {
        const cartId = req.params.cid;
        try {
            const cart = await CartService.getCartById(cartId);
            if(!cart) {
                console.log(`Cart with ${cartId} not found`);
                return res.status(404).json({ error: "Cart not found"});
            }
            const productsInCart = cart.products.map(item => ({
                product: item.toObject(),
                quantity: item.quantity   
            }));
            res.render("carts", { products: productsInCart }); 
        } catch (error) {
            console.error("Error getting the cart", error);
            res.status(500).json({ error: "Internal server error"}); 
        }
    };
    async renderRegistro (req, res) { 
        const token = req.cookies["coderCookieToken"];
        if (token) return res.redirect("/productos");
        res.render("register");
    }

    async renderProfile (req, res) {
        res.render("profile", { user: req.user });
    }

}
export const viewsController = new ViewsController();