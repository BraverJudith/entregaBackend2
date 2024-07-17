import { Router } from 'express';
import CartManager from '../dao/db/cart.managerdb.js';

const router = Router();
const cartManager = new CartManager();

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

// Agregar producto al carrito desde botton
router.post('/:add', async (req, res) => {
    const { productId } = req.body;
    try {
        await cartManager.agregarProductoAlCarrito(productId);
        res.json({ success: true, message: 'Producto agregado al carrito' });
    } catch (err) {
        console.error('Error al agregar producto al carrito:', err);
        res.status(500).json({ success: false, message: 'Error al agregar producto al carrito' });
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
