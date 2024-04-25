import express from "express";
import { createServer } from "http";
import dotenv from 'dotenv';
import { json, urlencoded } from "body-parser";
import { messageRoutes, roomRoutes } from "./routes";
import config from "./config/config";
import { errorHandler } from "./utils/errorHandler";
import logger from "./utils/logger";
import cors from "cors";
import { initializeSocket } from "./config/socketConfig";


dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = initializeSocket(httpServer);

app.use(cors());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});
app.use(json());
app.use(urlencoded({ extended: true }));

app.use("/api/rooms", roomRoutes(io));
app.use("/api/messages", messageRoutes(io));

app.use(errorHandler);

const PORT = config.port ||3009;

httpServer.listen(PORT, () => {
  console.log(`Server and WebSocket server are running on port ${PORT}.`);
});

export default app;
