import { Router } from 'express';
import { userController } from '../controller/UserController.js';

const router = Router();

router.get('/users', userController.getAllUsers);

export default router;
