import express from "express";
import { json, urlencoded } from "body-parser";
import userRoutes from "./routes/userRoutes";
import { logger } from "./middlewares";
import config from "./config/config";
import cors from 'cors';
import dotenv from 'dotenv';

const app = express();

dotenv.config();

app.use(cors());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(logger);
app.use(json());
app.use(urlencoded({ extended: true }));

app.use("/api/users", userRoutes);

const PORT = config.port ||3009;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

export default app;
