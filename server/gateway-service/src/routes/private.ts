import { Router } from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import * as ChatController from '../controllers/chatController';
import * as UserController from '../controllers/userController';
import multer from 'multer';
import { logout } from '../controllers/authController';

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.use(authenticateToken);

router.get('/logout', logout);

router.get('/user/avatar/:fileName', UserController.getUserAvatar);
router.get('/user/all/:userId', UserController.getUserAll);
router.get('/user/:userId', UserController.getUserById);

router.put(
  '/user/avatar/:userId',
  upload.single('file'),
  UserController.updateUserAvatarById
);
router.put('/user/:userId', UserController.updateUserById);

router.post('/chat/create', ChatController.createNewChat);

router.get(
  '/chat/:roomId/public-keys',
  ChatController.getChatRecipientsPublicKeys
);
router.post(
  '/chat/:roomId/:adminUserId',
  ChatController.setMessageExpirationTime
);
router.get('/chats/:userId', ChatController.getChatRoomsByUserId);
router.get('/messages/file/:fileName', ChatController.getFileByName);
router.get('/messages/:roomId', ChatController.getMessagesByRoomId);

router.post('/messages', upload.single('file'), ChatController.sendNewMessage);

export { router as privateRoutes };
