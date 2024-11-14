import { Router } from 'express';
import  { CartController }  from "../controller/CartController.js";
import { isAdmin } from "../middleware/auth.js"; 
import passport from 'passport';


const router = Router();

//Creo nuevo carrito
router.post('/', passport.authenticate('jwt', { session: false }), CartController.createCart);

// Obtener todos los carritos (solo accesible para admins)
router.get("/", passport.authenticate('jwt', { session: false }), isAdmin, CartController.getCarts);

//Lista los productos del carrito por ID
router.get('/:cid', passport.authenticate('jwt', { session: false }), CartController.getCartByID);

//Agrega productos al carrito
router.post('/:cid/products/:productId', passport.authenticate('jwt', { session: false }), CartController.addProductToCart);

//Borrar producto Por ID del carrito con ID
router.delete('/:cid/products/:pid', passport.authenticate('jwt', { session: false }), CartController.deleteProductFromCart);

//Actualiza carrito
router.put('/:cid', passport.authenticate('jwt', { session: false }),CartController.updateCart);

// Actualizar la cantidad de un producto en el carrito
router.put('/:cid/products/:pid', passport.authenticate('jwt', { session: false }), CartController.updateProductQuantity);

//Finalizar la compra del carrito
router.post('/:cid/purchase', passport.authenticate('jwt', { session: false }), CartController.purchaseCart);

// Borrar el carrito del usuario
router.delete('/:cid', passport.authenticate('jwt', { session: false }), CartController.clearCart);

export default router;
