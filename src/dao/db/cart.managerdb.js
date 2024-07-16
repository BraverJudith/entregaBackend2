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
}

export default CartManager;