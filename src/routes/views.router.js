import { Router } from "express";
import { viewsController } from "../controller/ViewsController.js"
import { authenticateJWT } from "../middleware/auth.js";


const router = Router();

// Vista de home
router.get("/", viewsController.renderHome);

router.get ("/realtimeproducts", viewsController.renderRealtimeProducts);
// Vista de home
router.get('/home', viewsController.renderHome);

// Vista de login
router.get('/login', viewsController.renderLogin);

// Vista de cart
router.get ("/carts/:cid", viewsController.renderCart);

// Vista de registro
router.get("/register", viewsController.renderRegistro);

// Vista de perfil
router.get("/profile", authenticateJWT, viewsController.renderProfile);


export default router;

