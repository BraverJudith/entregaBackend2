import CartModel from "./models/cart.model.js";

export class CartDAO {

  // Obtiene todos los carritos
  static async getCarts () {
    try {
        const carts = await CartModel.find().populate('products.product');
        return carts;
    } catch (error) {
        console.error("Error getting all carts:", error);
        throw new Error("Error getting all carts");
    }
}

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

  //actualiza cantidades
  static async updateProductQuantity (cartId, pid, quantity) {
    try {
        const cart = await CartModel.findById(cartId);
        if (!cart) {
            return null; 
        }

        const productIndex = cart.products.findIndex(p => p.product.toString() === pid);

        if (productIndex !== -1) {d
            cart.products[productIndex].quantity = quantity;
        } else {
            cart.products.push({ product: pid, quantity });
        }

        await cart.save();

        return cart;
    } catch (error) {
        console.error("Error al actualizar cantidad del producto:", error);
        throw new Error("Error al actualizar cantidad del producto");
    }
}

// Borra el carrito por el cartId
static async clearCart (cartId) {
    try {
        const cart = await CartModel.findById(cartId);
        if (!cart) {
            return null; 
        }
        cart.products = [];
        await cart.save();
        return cart.toJSON();
    } catch (error) {
        console.error("Error al eliminar carrito:", error);
        throw new Error("Error al eliminar carrito");
    }
  }
}