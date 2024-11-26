import { CartDAO } from '../dao/CartDAO.js';

export class CartService {
    
    // Obtiene todos los carritos
    static async getCarts() {
        try {
        const carts = await CartDAO.getCarts();
        return carts;
        } catch (error) {
        throw new Error("Error al cargar carritos");
        }
    }

    // Crea un carrito nuevo vacío
    static async createCart() {
        try {
            const cart = await CartDAO.createCart(); 
            return cart;
        } catch (error) {
            console.error("Error al crear el carrito:", error);
            throw new Error('Error al crear el carrito');
        }
    }
    static async createCartForUser(userId) {
        try {
            const cart = await CartDAO.createCart({
                user: userId, 
                items: [] 
            });

            return cart; // Devuelve el carrito creado
        } catch (error) {
            console.error("Error al crear el carrito:", error);
            throw new Error('Error al crear el carrito');
        }
    }

    // Obtiene un carrito por su ID
    static async getCartById(cartId) {
        try {
        const cart = await CartDAO.getCartById(cartId);
        if (!cart) {
            throw new Error("Cart not found");
        }
        return cart;
        } catch (error) {
        throw new Error("Error al obtener carrito por ID");
        }
    }

    // Agrega un producto al carrito
    static async addProductToCart(cartId, productId, quantity = 1) {
        try {
        const updatedCart = await CartDAO.addProductToCart(cartId, productId, quantity);
        return updatedCart;
        } catch (error) {
        throw new Error("Error al agregar producto al carrito");
        }
    }

    // Elimina un producto del carrito
    static async removeProductFromCart(cartId, productId) {
        try {
        const updatedCart = await CartDAO.removeProductFromCart(cartId, productId);
        return updatedCart;
        } catch (error) {
        throw new Error("Error al eliminar producto");
        }
    }

    // Actualiza la cantidad de un producto en el carrito
    static async updateProductQuantity(cartId, productId, quantity) {
        try {
        const updatedCart = await CartDAO.updateProductQuantity(cartId, productId, quantity);
        return updatedCart;
        } catch (error) {
        throw new Error("Error al actualizar cantidad de producto");
        }
    }

    // Borra el carrito
    static async clearCart(cartId) {
        try {
        const clearedCart = await CartDAO.clearCart(cartId);
        return clearedCart;
        } catch (error) {
        throw new Error("Error in CartService while clearing the cart");
        }
    }
}