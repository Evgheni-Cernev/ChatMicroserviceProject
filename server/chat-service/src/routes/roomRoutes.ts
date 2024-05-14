import { Router } from "express";
import * as roomController from "../controllers/roomController";
import { Server as SocketIOServer } from "socket.io";


export const roomRoutes = (io: SocketIOServer) => {
  const router = Router();
  router.use((req, res, next) => {
    req.io = io;
    next();
  });

  router.post("/", roomController.createRoom);
  router.get("/:roomId/public-keys", roomController.getChatRecipientsPublicKeys);

  router.post("/:roomId/:adminUserId", roomController.setRoomMessageExpirationTime);

  router.get("/:userId", roomController.getRooms);


  return router;
};
