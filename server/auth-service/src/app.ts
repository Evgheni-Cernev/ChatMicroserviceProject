import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";

import authRouter from "./routes/authRoutes";

import { initializeRedis } from "./utils/redisUtil";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3009;

const ALLOWED_ORIGIN = [
  process.env.ALLOWED_USER_SERVICE_BASE_URL ?? "",
  process.env.ALLOWED_GATEWAY_SERVICE_BASE_URL ?? "",
  process.env.ALLOWED_AUTH_SERVICE_BASE_URL ?? "",
  process.env.ALLOWED_CHAT_SERVICE_BASE_URL ?? "",
];

app.use(cors());
app.use(
  cors({
    origin: ALLOWED_ORIGIN,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

initializeRedis()
  .then(() => {
    console.log("Redis is ready");
  })
  .catch((err) => {
    console.error("Failed to connect to Redis", err);
  });

app.use(morgan("dev"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
  }
);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
