import express from "express";
import { createServer } from "http";
import dotenv from "dotenv";
import { json, urlencoded } from "body-parser";
import { messageRoutes, roomRoutes } from "./routes";
import config from "./config/config";
import { errorHandler } from "./utils/errorHandler";
import logger from "./utils/logger";
import cors from "cors";
import { initializeSocket } from "./config/socketConfig";
import { initializeRedis } from "./utils/redisUtil";
import { setupMessageWatcher } from "./services/messageWatcher";

dotenv.config();

const app = express();
const httpServer = createServer(app);
export const io = initializeSocket(httpServer);

const ALLOWED_ORIGIN = [
  process.env.ALLOWED_USER_SERVICE_BASE_URL ?? "",
  process.env.ALLOWED_GATEWAY_SERVICE_BASE_URL ?? "",
  process.env.ALLOWED_AUTH_SERVICE_BASE_URL ?? "",
];

initializeRedis()
  .then(() => {
    console.log("Redis is ready");
  })
  .catch((err) => {
    console.error("Failed to connect to Redis", err);
  });

app.use(cors());
app.use(
  cors({
    origin: ALLOWED_ORIGIN,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

app.use((req, res, next) => {
  (req).io = io;
  next();
});

app.use(json());
app.use(urlencoded({ extended: true }));

app.use("/api/rooms", roomRoutes(io));
app.use("/api/messages", messageRoutes(io));

app.use(errorHandler);

setupMessageWatcher();

const PORT = config.port || 3009;

httpServer.listen(PORT, () => {
  console.log(`Server and WebSocket server are running on port ${PORT}.`);
});

export default app;
