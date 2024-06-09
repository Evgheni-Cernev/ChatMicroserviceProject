import { Router } from 'express';
import {UserService} from '../services/userService';
import {TokenService} from '../services/tokenService';
import {RedisService} from '../services/redisService';
import AuthController from '../controllers/authController';

const router = Router();

const userService = new UserService(process.env.USER_SERVICE_BASE_URL ?? '');
const tokenService = new TokenService();
const redisService = new RedisService();

const authController = new AuthController(userService, tokenService, redisService);

router.post('/register', (req, res) => authController.register(req, res));

router.post('/login', (req, res) => authController.login(req, res));

router.post('/logout', (req, res) => authController.logout(req, res));

router.post('/verify-token', (req, res) => authController.verifyToken(req, res));
router.post('/verify-token/get-user', (req, res) => authController.verifyTokenGetUser(req, res));

export default router;
