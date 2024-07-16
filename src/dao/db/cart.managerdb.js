import CartModel from "../models/cart.model.js";


class CartManager {
    
    async crearCarrito() {
        try{
            const newCart = new CartModel({products: []});
            await newCart.save();
            return newCart;
        }
        catch (error){
            console.log ("Error al crear carrito", error);
            throw error;
        }
    }

    async getCarritoById(cartId) {
        try {
            const carrito = await CartModel.findById(cartId);

            if (!carrito) {
                throw new Error(`No existe un carrito con el id ${cartId}`);
            }
            return carrito;
        } catch (error) {
            console.error("Error al obtener el carrito por ID", error);
            throw error;
        }
    }

    async agregarProductoAlCarrito(cartId, productId, quantity = 1) {
        try {
            const carrito = await this.getCarritoById(cartId);
            const productExist = carrito.products.find(p => p.product.toString() === productId);
            if (productExist) {
                productExist.quantity += quantity;
            } else {
                carrito.products.push({ product: productId, quantity });
            }

            carrito.markModified("products");
            await carrito.save();
            return carrito;

        } catch (error) {
            console.log("Error al modificar carrito")
        }
    }
    async updateProductQuantity(cartId, productId, quantity) {
        try {
            const carrito = await this.getCarritoById(cartId);
            const productExist = carrito.products.find(p => p.product.toString() === productId);
            if (productExist) {
                productExist.quantity = quantity;
                carrito.markModified("products");
                await carrito.save();
            } else {
                throw new Error(`El producto con ID ${productId} no está en el carrito`);
            }
            return carrito;
        } catch (error) {
            console.log("Error al actualizar cantidad del producto en el carrito", error);
            throw error;
        }
    }
    async eliminarProductoDelCarrito(cartId, productId) {
        try {
            const carrito = await this.getCarritoById(cartId);
            const index = carrito.products.findIndex(p => p.product.toString() === productId);
            if (index !== -1) {
                carrito.products.splice(index, 1);
                carrito.markModified("products");
                await carrito.save();
            }
            return carrito;
        } catch (error) {
            console.log("Error al eliminar producto del carrito", error);
            throw error;
        }
    }
    async updateCart(cartId, products) {
        try {
            const carrito = await this.getCarritoById(cartId);
            carrito.products = products; 
            carrito.markModified("products");
            await carrito.save();
            return carrito;
        } catch (error) {
            console.log("Error al actualizar carrito", error);
            throw error;
        }
    }
    async clearCart(cartId) {
        try {
            const carrito = await this.getCarritoById(cartId);
            carrito.products = []; 
            await carrito.save();
            return carrito;
        } catch (error) {
            console.log(`Error al limpiar carrito ${cartId}`, error);
            throw error;
        }
    }
}

export default CartManager;