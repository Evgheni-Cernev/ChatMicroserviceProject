import { Server } from "socket.io";
import http from "http";

export const initializeSocket = (server: http.Server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`New user connected with id ${socket.id}`);

    socket.on("subscribeToRoom", (roomId) => {
      console.log(`User ${socket.id} subscribed to room ${roomId}`);
      socket.join(roomId);
    });

    socket.on("sendMessage", ({ roomId, message }) => {
      console.log(`Message sent to room ${roomId}: ${JSON.stringify(message)}`);
      io.to(message);
    });

    socket.on("disconnect", () => {
      console.log(`User ${socket.id} disconnected`);
    });
  });

  return io;
};
