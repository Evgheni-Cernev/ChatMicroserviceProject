import { Server as HttpServer } from "http";
import { Server as SocketServer, Socket } from "socket.io";

export const initSocket = (httpServer: HttpServer) => {
  const io = new SocketServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true,
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log("A user connected", socket.id);

    socket.on("disconnect", () => {
      console.log("User disconnected", socket.id);
    });

    socket.on("chat message", (msg) => {
      console.log("Message received:", msg);
      io.emit("chat message", msg);
    });
  });

  return io;
};
