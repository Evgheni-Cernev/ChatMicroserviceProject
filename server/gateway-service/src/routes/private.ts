import { Router } from "express";
import { authenticateToken } from "../middlewares/authMiddleware";
import {
  createNewChat,
  getChatRoomsByUserId,
  getMessagesByRoomId,
  sendNewMessage
} from "../controllers/chatController";
import { getUserById, updateUserById } from "../controllers/userController";
import { logout } from "../controllers/authController";

const router = Router();

router.use(authenticateToken);
//auth
router.get("/logout", logout);

//user
router.get("/user/:userId", getUserById);
router.put("/user/:userId", updateUserById);

//chat
router.post("/chat/create", createNewChat);
router.get("/chats/:userId", getChatRoomsByUserId);
router.get("/messages/:roomId", getMessagesByRoomId);
router.post("/messages", sendNewMessage);


export { router as privateRoutes };
