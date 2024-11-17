
import { productService } from "../services/Product.service.js"; 
import { CartService } from "../services/Cart.service.js";
import { CartDAO } from "../dao/CartDAO.js";

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
        try {
            const cartId = req.params.cid; 
            const cart = await CartDAO.getCartById(cartId);
        
            if (!cart) {
                return res.status(404).send('Carrito no encontrado');
            }
            console.log('Carrito con productos poblados:', cart);
            const populatedCart = cart.toObject(); 

            populatedCart.products = populatedCart.products.map(item => {
            if (item.product.toObject) {
                item.product = item.product.toObject();
                }
                return item;
            });

            res.render('carts', {
                cart: populatedCart
            });
            } catch (error) {
            console.error('Error mostrando el carrito:', error);
            res.status(500).send('Error interno del servidor');
            }
    };

    async renderProfile (req, res) {
        res.render("profile", { user: req.user });
    }
    async renderRegistro (req, res) { 
        const token = req.cookies["sestoken"];
        if (token) return res.redirect("/productos");
        res.render("register");
    }
}
export const viewsController = new ViewsController();