import { Router } from "express";
import * as messageController from "../controllers/messageController";
import { Server as SocketIOServer } from "socket.io";

export const messageRoutes = (io: SocketIOServer) => {
  const router = Router();

  router.use((req, res, next) => {
    req.io = io;
    next();
  });

  router.post("/", messageController.sendMessage);

  router.get("/:roomId", messageController.getMessages);

  return router;
};
