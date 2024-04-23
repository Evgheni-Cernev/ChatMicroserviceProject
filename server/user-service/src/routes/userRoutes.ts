import { Router } from 'express';
import UserController from '../controllers/UserController';
import { authenticate } from "../middlewares";

const router = Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);

router.use(authenticate);
router.get('/profile/:userId', UserController.getProfile);
router.put('/profile/:userId', UserController.updateProfile);


export default router;
