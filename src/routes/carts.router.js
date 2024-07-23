import { Router } from 'express';
import CartManager from '../dao/db/cart.managerdb.js';
import CartModel from '../dao/models/cart.model.js';

const router = Router();
const cartManager = new CartManager();
const cartModel = new CartModel();

//Creo nuevo carrito
router.post('/', async (req, res) => {
    try {
        const cart = await cartManager.crearCarrito();
        res.json(cart);
    } catch (err) {
        console.error('Error al crear carrito:', err);
        res.status(500).json({ status: 'error', message: 'Error al crear carrito' });
    }
});
//Lista todos los carritos
router.get("/", async (req, res) => {
    try {
        const cart = await cartManager.obtenerCarrito();
        res.status(200).json(cart);
    } catch (error) {
        console.error("Error al listar los carritos", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});


//Lista los productos del carrito por ID
router.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await cartManager.getCarritoById(cid);
        res.json(cart);
    } catch (err) {
        console.error(`Error al obtener carrito ${cid}:`, err);
        res.status(500).json({ status: 'error', message: `Error al obtener carrito ${cid}` });
    }
});

//Agrega productos al carrito
router.post('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const quantity = req.body.quantity || 1;
        const cart = await cartManager.agregarProductoAlCarrito(cid, pid,quantity);
        res.json(cart.products);
    } catch (err) {
        console.error(`Error al eliminar producto ${pid} del carrito ${cid}:`, err);
        res.status(500).json({ status: 'error', message: `Error al eliminar producto ${pid} del carrito ${cid}` });
    }
});

//Borrar producto Por ID del carrito con ID
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await cartManager.eliminarProductoDelCarrito(cid, pid);
        res.json(cart);
    } catch (err) {
        console.error(`Error al eliminar producto ${pid} del carrito ${cid}:`, err);
        res.status(500).json({ status: 'error', message: `Error al eliminar producto ${pid} del carrito ${cid}` });
    }
});

//Actualiza carrito
router.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body;
        const cart = await cartManager.updateCart(cid, products);
        res.json(cart);
    } catch (err) {
        console.error(`Error al actualizar carrito ${cid}:`, err);
        res.status(500).json({ status: 'error', message: `Error al actualizar carrito ${cid}` });
    }
});

// funcion para agregar producto al carrito desde el boton agregar producto 
//-- no escuche que no habia que hacerlo por por eso no funciona bien hice lo que pude porque me faltan datos.
router.post('/add/:pid', async (req, res) => {
    const { productId } = req.params;
    try {
        if (!productId) {
            return res.status(400).json({ success: false, error: 'Falta el ID del producto' });
        }

        // Obtener todos los carritos
        let carts = await CartModel.find();
        
        // Seleccionar el último carrito
        let cart;
        if (carts.length === 0) {
            // Si no hay carritos, crear uno nuevo
            cart = new CartModel();
        } else {
            // Seleccionar el último carrito
            cart = carts[carts.length - 1];
        }

        // Verificar si el producto ya está en el carrito
        const productIndex = cart.products.findIndex(p => p.product.toString() === productId);

        if (productIndex !== -1) {
            // Si el producto ya está, aumentar la cantidad
            cart.products[productIndex].quantity += 1;
        } else {
            // Si el producto no está, agregarlo al carrito
            cart.products.push({ productId, quantity: 1 });
        }

        await cart.save();
        res.json({ success: true, cart });
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).json({ success: false, error: 'Error al agregar producto al carrito' });
    }
});



//Cambiar las cantidades de los productos en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const cart = await cartManager.updateProductQuantity(cid, pid, quantity);
        res.json(cart);
    } catch (err) {
        console.error(`Error al actualizar cantidad del producto ${pid} en carrito ${cid}:`, err);
        res.status(500).json({ status: 'error', message: `Error al actualizar cantidad del producto ${pid} en carrito ${cid}` });
    }
});

//Borrar carrito
router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartManager.clearCart(cid);
        res.json(cart);
    } catch (err) {
        console.error(`Error al eliminar carrito ${cid}:`, err);
        res.status(500).json({ status: 'error', message: `Error al eliminar carrito ${cid}` });
    }
});

export default router;
