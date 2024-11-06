import CartModel from "./models/cart.model.js";

export class CartDAO {

    // Crear un nuevo carrito vacío
  static async createCart() {
    try {
      const newCart = await CartModel.create({ products: [] });
      return newCart.toJSON();
    } catch (error) {
      console.error("Error creating cart:", error);
      throw error;
    }
  }

  // Obtener un carrito por su ID
  static async getCartById(cartId) {
    try {
      const cart = await CartModel.findById(cartId).populate("products.product").lean();
      return cart;
    } catch (error) {
      console.error("Error getting cart by ID:", error);
      throw error;
    }
  }

  // Agregar un producto al carrito
  static async addProductToCart(cartId, productId, quantity = 1) {
    try {
      const cart = await CartModel.findById(cartId);
      if (!cart) throw new Error("Cart not found");

      // Buscar si el producto ya está en el carrito
      const existingProduct = cart.products.find(p => p.product.toString() === productId);
      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }

      await cart.save();
      return cart.toJSON();
    } catch (error) {
      console.error("Error adding product to cart:", error);
      throw error;
    }
  }

  // Eliminar un producto del carrito
  static async removeProductFromCart(cartId, productId) {
    try {
      const cart = await CartModel.findById(cartId);
      if (!cart) throw new Error("Cart not found");

      cart.products = cart.products.filter(p => p.product.toString() !== productId);
      await cart.save();
      return cart.toJSON();
    } catch (error) {
      console.error("Error removing product from cart:", error);
      throw error;
    }
  }

  // Vaciar el carrito
  static async clearCart(cartId) {
    try {
      const cart = await CartModel.findById(cartId);
      if (!cart) throw new Error("Cart not found");
      cart.products = [];
      await cart.save();
      return cart.toJSON();
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    }
  }
}