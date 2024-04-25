import { Router } from 'express';
import UserController from '../controllers/UserController';

const router = Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/email/:email', UserController.getUserByEmail);

router.get('/profile/:userId', UserController.getProfile);
router.put('/profile/:userId', UserController.updateProfile);


export default router;
