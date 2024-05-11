import { Router } from "express";
import { authenticateToken } from "../middlewares/authMiddleware";
import * as ChatController from "../controllers/chatController";
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
router.post("/chat/create", ChatController.createNewChat);
router.post(
  "/chat/:roomId/:adminUserId",
  ChatController.setMessageExpirationTime
);
router.get("/chats/:userId", ChatController.getChatRoomsByUserId);
router.get("/messages/:roomId", ChatController.getMessagesByRoomId);
router.post("/messages", ChatController.sendNewMessage);
router.get("/file/:fileName", ChatController.getFileByName);

export { router as privateRoutes };
