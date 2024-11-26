import { Router } from 'express';
import { CartController } from "../controller/CartController.js";
import { verificarRol } from "../middleware/auth.js"; 
import passport from 'passport';
import { viewsController } from '../controller/ViewsController.js';

const router = Router();

// Crea nuevo carrito
router.post('/', passport.authenticate('current', { session: false }), CartController.createCart);

// Obtener todos los carritos (solo accesible para admins)
router.get("/", passport.authenticate('current', { session: false }), verificarRol(["admin"]), CartController.getCarts);

// Lista los productos del carrito por ID
router.get('/:cid', passport.authenticate('current', { session: false }), viewsController.renderCart);

// Agrega productos al carrito
router.post('/:cid/product/:productId', passport.authenticate('current', { session: false }), CartController.addProductToCart);

// Borrar producto por ID del carrito con ID
router.delete('/:cid/product/:pid', passport.authenticate('current', { session: false }), CartController.deleteProductFromCart);

// Actualiza carrito
router.put('/:cid', passport.authenticate('current', { session: false }), CartController.updateCart);

// Actualizar la cantidad de un producto en el carrito
router.put('/:cid/product/:pid', passport.authenticate('current', { session: false }), CartController.updateProductQuantity);

// Finalizar la compra del carrito
router.post('/:cid/purchase', passport.authenticate('current', { session: false }), CartController.purchaseCart);

// Borrar el carrito del usuario
router.delete('/:cid', passport.authenticate('current', { session: false }), CartController.clearCart);

export default router;
