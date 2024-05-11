import { Router } from "express";
import * as messageController from "../controllers/messageController";
import {upload} from '../services/fileUploaderService'
import { Server as SocketIOServer } from "socket.io";


export const messageRoutes = (io: SocketIOServer) => {
  const router = Router();

  router.use((req, res, next) => {
    req.io = io;
    next();
  });

  router.post("/", upload, messageController.sendMessage);
  router.get("/file/:fileName", messageController.getFile);


  router.get("/:roomId", messageController.getMessages);

  return router;
};
