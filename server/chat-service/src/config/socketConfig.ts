import { Server as SocketIOServer } from "socket.io";
import { checkAuthService } from "../services/checkAuthService";
import http from "http";

export const initializeSocket = (server: http.Server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.use(async (socket: any, next) => {
    const token = socket.handshake.query.token || socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication error: Token not provided"));
    }

    try {
      const userId = await checkAuthService(token);
      if (userId) {
        socket.userId = userId;
        next();
      } else {
        next(new Error("Authentication error: Invalid token"));
      }
    } catch (error) {
      console.error("Authentication error:", error);
      next(new Error("Authentication error: Failed to validate token"));
    }
  });

  io.on("connection", (socket: any) => {
    console.log(
      `New user connected with id ${socket.id} and user ID ${socket.userId}`
    );

    socket.on("subscribeToRoom", (roomId: string) => {
      console.log(`User ${socket.userId} subscribed to room ${roomId}`);
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      ({ roomId, message }: { roomId: string; message: string }) => {
        console.log(
          `Message sent to room ${roomId} by user ${
            socket.userId
          }: ${JSON.stringify(message)}`
        );
        io.to(roomId).emit("sendMessage", { roomId, message });
      }
    );

    socket.on(
      "deleteMessage",
      ({ messageId, roomId }: { messageId: string; roomId: string }) => {
        console.log(`Message ${messageId} deleted from room ${roomId}`);
        io.to(roomId).emit("message_deleted", { messageId });
      }
    );

    socket.on("disconnect", () => {
      console.log(`User ${socket.id} disconnected`);
    });
  });

  return io;
};
