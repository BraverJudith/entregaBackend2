import { Router } from 'express';
import CartManager from '../dao/db/cart.managerdb.js';

const router = Router();
const cartManager = new CartManager();

router.post('/', async (req, res) => {
    try {
        const cart = await cartManager.crearCarrito();
        res.json(cart);
    } catch (err) {
        console.error('Error al crear carrito:', err);
        res.status(500).json({ status: 'error', message: 'Error al crear carrito' });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartManager.getCarritoById(cid);
        res.json(cart);
    } catch (err) {
        console.error(`Error al obtener carrito ${cid}:`, err);
        res.status(500).json({ status: 'error', message: `Error al obtener carrito ${cid}` });
    }
});

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
