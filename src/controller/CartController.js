import { CartDAO } from "../dao/CartDAO.js";
import { ProductDAO } from "../dao/ProductDAO.js";
import { TicketService } from "../services/Ticket.service.js";
import { v4 as uuidv4 } from 'uuid';
import { procesaErrores } from "../utils.js";

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
            user.cartId = cart._id;
            await user.save();
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
            const cart = await CartDAO.getCartById(user.cartId);
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
            const cart = await CartDAO.getCartById(user.cartId);
            if (!cart) {
                return res.status(404).json({ success: false, error: 'Carrito no encontrado' });
            }

            const updatedCart = await CartDAO.removeProductFromCart(user.cartId, pid);
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
            const cart = await CartDAO.getCartById(user.cartId);
            if (!cart) {
                return res.status(404).json({ success: false, error: 'Carrito no encontrado' });
            }

            const updatedCart = await CartDAO.updateCart(user.cartId, products);
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
            if (!user || !user.cartId) {
                return res.status(400).json({ success: false, error: 'No se encontró el carrito del usuario' });
            }

            const cart = await CartDAO.getCartById(user.cartId);

            if (!cart) {
                return res.status(404).json({ success: false, error: 'Carrito no encontrado' });
            }

            const productIndex = cart.products.findIndex(p => p.product.toString() === productId);

            if (productIndex !== -1) {
                cart.products[productIndex].quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }

            await cart.save();

            res.json({ success: true, cart });

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
            if (!user || !user.cartId) {
                return res.status(400).json({ status: 'error', message: 'El usuario no tiene un carrito asignado' });
            }

            const cart = await CartDAO.updateProductQuantity(user.cartId, pid, quantity);
            if (!cart) {
                return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
            }

            res.json(cart);
        } catch (err) {
            console.error(`Error al actualizar cantidad del producto ${pid}:`, err);
            res.status(500).json({ status: 'error', message: `Error al actualizar cantidad del producto ${pid}` });
        }
    }
    //Finalizar compra y creacion de ticket
    static purchaseCart = async (req, res) => {
        const { cid } = req.params;
        const user = req.user;

        try {
            const cart = await CartDAO.getCartById(cid);
            if (!cart) {
                return res.status(404).json({ success: false, error: 'Carrito no encontrado' });
            }

            let totalAmount = 0;
            const unavailableProducts = [];
            const productsToPurchase = [];

            for (const item of cart.products) {
                const product = await ProductDAO.getProductById(item.product);

                if (product.stock >= item.quantity) {
                    product.stock -= item.quantity;
                    await product.save();

                    totalAmount += product.price * item.quantity;
                    productsToPurchase.push({ product: item.product, quantity: item.quantity });
                } else {
                    unavailableProducts.push(item.product);
                }
            }

            // Generar el ticket con los datos de la compra
            const ticket = await TicketService.createTicket({
                code: uuidv4(),
                purchase_datetime: new Date(),
                amount: totalAmount,
                purchaser: user.email,
                products: productsToPurchase
            });

            cart.products = cart.products.filter(item => unavailableProducts.includes(item.product.toString()));
            await cart.save();

            res.json({ success: true, ticket, unavailableProducts });
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
