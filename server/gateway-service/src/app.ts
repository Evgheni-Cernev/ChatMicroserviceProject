import express from "express";
import { json, urlencoded } from "body-parser";
import { publicRoutes } from "./routes/public";
import { privateRoutes } from "./routes/private";
import { errorHandler } from "./middlewares/errorHandler";
import { logger } from "./middlewares/loggingMiddleware";
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(logger);

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '';

app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(cors({
  origin: ALLOWED_ORIGIN,
  methods: ["GET", "POST", "PUT", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-XSRF-TOKEN"],
  credentials: true,
}));

app.use(express.json());

app.use("/", publicRoutes, privateRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

export default app;
