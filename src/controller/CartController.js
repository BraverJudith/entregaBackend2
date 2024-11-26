import { CartDAO } from "../dao/CartDAO.js";
import { ProductDao } from "../dao/ProductDAO.js";
import { ticketService } from "../services/Ticket.service.js";
import { v4 as uuidv4 } from 'uuid';
import { procesaErrores } from "../utils.js";
import { viewsController } from "./ViewsController.js";
import { UserDAO } from "../dao/UserDAO.js";
//import { sendPurchaseEmail } from '../utils.js';

export class CartController {
    //Obtiene todos los carritos (tengo que dejar solo al administrador)
    static getCarts = async (req, res) => {
        try {
            const cart = await CartDAO.getCarts();
            res.status(200).json(cart);
        } catch (error) {
            console.error("Error al listar los carritos", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    // Crea nuevo carrito
    static createCart = async (req, res) => {
        const user = req.user;
        try {
            const cart = await CartDAO.createCart();
            const updatedUser = await UserDAO.updateUser(
                user._id, 
                { cart_id: cart._id }, 
                { new: true }
            );
            res.json(cart);
        } catch (err) {
            console.error('Error al crear carrito:', err);
            res.status(500).json({ status: 'error', message: 'Error al crear carrito' });
        }
    }

    // Obtiene el carrito del usuario conectado (usando el cartId del usuario)
    static getCartByID = async (req, res) => {
        const user = req.user; 
        try {
            const cart = await CartDAO.getCartById(user.cart_id);
            if (!cart) {
                return res.status(404).json({ success: false, error: 'Carrito no encontrado' });
            }
            res.json(cart);
        } catch (err) {
            console.error(`Error al obtener el carrito del usuario ${user._id}:`, err);
            res.status(500).json({ status: 'error', message: `Error al obtener el carrito del usuario ${user._id}` });
        }
    }

    // Elimina un producto del carrito del usuario
    static deleteProductFromCart = async (req, res) => {
        const { pid } = req.params; 
        const user = req.user; 
        try {
            const cart = await CartDAO.getCartById(user.cart_id);
            if (!cart) {
                return res.status(404).json({ success: false, error: 'Carrito no encontrado' });
            }

            const updatedCart = await CartDAO.removeProductFromCart(user.cart_id, pid);
            res.json(updatedCart);
        } catch (err) {
            console.error(`Error al eliminar producto ${pid} del carrito del usuario ${user._id}:`, err);
            res.status(500).json({ status: 'error', message: `Error al eliminar producto ${pid} del carrito` });
        }
    }

    // Actualiza el carrito del usuario (añadir/actualizar productos)
    static updateCart = async (req, res) => {
        const user = req.user; 
        const { products } = req.body; 
        try {
            const cart = await CartDAO.getCartById(user.cart_id);
            if (!cart) {
                return res.status(404).json({ success: false, error: 'Carrito no encontrado' });
            }

            const updatedCart = await CartDAO.updateCart(user.cart_id, products);
            res.json(updatedCart);
        } catch (err) {
            console.error(`Error al actualizar carrito del usuario ${user._id}:`, err);
            res.status(500).json({ status: 'error', message: 'Error al actualizar el carrito' });
        }
    }

    // Agrega un producto al carrito del usuario
    static addProductToCart = async (req, res) => {
        const { productId } = req.params;
        const user = req.user;
        const quantity = req.body.quantity || 1;

        try {
            if (!productId) {
                return res.status(400).json({ success: false, error: 'Falta el ID del producto' });
            }
            console.log(user.cart_id)
            if (!user || !user.cart_id) {
                return res.status(400).json({ success: false, error: 'No se encontró el carrito del usuario' });
            }

            const cart = await CartDAO.getCartById(user.cart_id);
            console.log(cart)
            if (!cart) {
                return res.status(404).json({ success: false, error: 'Carrito no encontrado' });
            }

            const product = await ProductDao.getProductsBy({ _id: productId });
            if (!product || product.stock < quantity) {
                return res.status(400).json({ success: false, error: 'No hay suficiente stock para este producto' });
            }
            
            const productIndex = cart.products.findIndex(p => p.product.toString() === productId);
            if (productIndex !== -1) {
                cart.products[productIndex].quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }

            await cart.save();
            res.status(200).json({ 
                success: true, 
                message: 'Producto agregado al carrito', 
                cartUrl: `/carts/${cart._id}` 
            });
            
        } catch (error) {
            console.error('Error adding products to Cart:', error);
            res.status(500).json({ success: false, error: 'Error adding products to Cart'});
        }
    }

    //Actualizar cantidades
    static updateProductQuantity = async (req, res) => {
        const { pid } = req.params;
        const { quantity } = req.body; 
        const user = req.user; 

        try {
            if (!user || !user.cart_id) {
                return res.status(400).json({ status: 'error', message: 'El usuario no tiene un carrito asignado' });
            }

            const cart = await CartDAO.updateProductQuantity(user.cart_id, pid, quantity);
            if (!cart) {
                return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
            }

            res.json(cart);
        } catch (err) {
            console.error(`Error al actualizar cantidad del producto ${pid}:`, err);
            res.status(500).json({ status: 'error', message: `Error al actualizar cantidad del producto ${pid}` });
        }
    }
    // Método para mostrar el carrito en la vista
    static async showCart(req, res) {
        try {
        const cartId = req.params.cid; // El ID del carrito se pasa como parámetro
        const cart = await CartDAO.getCartById(cartId);
    
        if (!cart) {
            return res.status(404).send("Cart not found");
        }
    
        // Renderizar la vista de cart.handlebars y pasarle los datos del carrito
        //res.render("carts", { cart });
        viewsController.renderCart();
        } catch (error) {
        console.error("Error showing cart:", error);
        res.status(500).send("Internal Server Error");
        }
    }
    //Finalizar compra y creacion de ticket
    static purchaseCart = async (req, res) => {
        try {
            const { cid } = req.params;
            const cartId = cid || req.user.cart_id; 
            const user = req.user;
            const userEmail = user.email;
        
            const cart = await CartDAO.getCartById(cartId);
            if (!cart) {
                return res.status(404).json({ success: false, error: 'Carrito no encontrado' });
            }
        
            let totalAmount = 0;
            const unavailableProducts = [];
            const productsToPurchase = [];
            const failedProducts = [];
        
            for (const item of cart.products) {
                const product = await ProductDao.getProductsBy({ _id: item.product });
                if (!product) {
                    unavailableProducts.push(item.product);
                    continue; 
                }
        
                if (product.stock >= item.quantity) {
                    product.stock -= item.quantity; 
                    await product.save(); 
        
                    totalAmount += product.price * item.quantity;
                    productsToPurchase.push({ product: item.product, quantity: item.quantity }); 
                } else {
                    unavailableProducts.push(item.product); 
                    failedProducts.push(item); 
                }
            }

            if (failedProducts.length > 0 && productsToPurchase.length === 0) {
                return res.render('carts', { 
                    cart: { products: failedProducts }, 
                    message: 'No se pudo realizar la compra. Algunos productos no tienen suficiente stock.',
                });
            }
            let ticket = null;
            if (productsToPurchase.length > 0) {
                ticket = await ticketService.finalizePurchase({
                    code: uuidv4(), 
                    purchase_datetime: new Date(), 
                    amount: totalAmount, 
                    purchaser: userEmail, 
                    products: productsToPurchase, 
                });
            }
            if (!ticket) {
                console.error('No se pudo generar el ticket');
                return res.status(500).json({ success: false, error: 'Error al generar el ticket' });
            }
            //await sendPurchaseEmail(userEmail, ticket);
            await CartDAO.clearCart(cartId);
            const plainTicket = ticket.toObject();
            res.json({ 
                success: true,
                ticket: plainTicket, 
                unavailableProducts: failedProducts, 
                message: ticket 
                    ? 'Compra realizada exitosamente. Revisa el ticket.' 
                    : 'Algunos productos no se pudieron comprar por falta de stock.',
            });
        
        } catch (error) {
            console.error('Error al procesar la compra del carrito:', error);
            res.status(500).json({ success: false, error: 'Error al procesar la compra del carrito' });
        }
    };
    
    // Borra el carrito
    static clearCart = async (req, res) => {
        const user = req.user;
        try {
            if (!user || !user.cartId) {
                return res.status(400).json({ status: 'error', message: 'El usuario no tiene un carrito asignado' });
            }
            const cart = await CartDAO.clearCart(user.cartId);
            if (!cart) {
                return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
            }
            res.json(cart);
        } catch (err) {
            console.error(`Error al eliminar carrito del usuario ${user._id}:`, err);
            res.status(500).json({ status: 'error', message: `Error al eliminar carrito del usuario ${user._id}` });
        }
    }
};
