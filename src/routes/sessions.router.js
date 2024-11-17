import { Router } from 'express';
import passport from 'passport';
import { SessionsController } from '../controller/SessionController.js';

const router = Router();

router.get('/ruta-protegida', passport.authenticate("current", { session: false }), SessionsController.rutaProtegida);

router.post('/registro', passport.authenticate("registro", { session: false }), SessionsController.registro);

router.post('/login', passport.authenticate("login", { session: false }), SessionsController.login);

router.get("/logout", SessionsController.logOut);

router.get("/error", SessionsController.error);
router.get("*", SessionsController.pageNotFound);

//router.get("/current", passportCall("current"), current);


export default router;
