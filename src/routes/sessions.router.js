import { Router } from 'express';
import passport from 'passport';
import { SessionsController } from '../controller/SessionController.js';

const router = Router();

router.get('/ruta-protegida', passport.authenticate("current", { session: false }), SessionsController.rutaProtegida);

router.post('/registro', passport.authenticate("registro", { session: false, failureRedirect: "/error" }), SessionsController.registro);

router.post('/login', SessionsController.login);

export default router;
