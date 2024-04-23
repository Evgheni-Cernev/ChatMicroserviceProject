import express from "express";
import { json, urlencoded } from "body-parser";
import userRoutes from "./routes/userRoutes";
import { logger } from "./middlewares";
import config from "./config/config";

const app = express();

app.use(logger);
app.use(json());
app.use(urlencoded({ extended: true }));

app.use("/api/users", userRoutes);

const PORT = config.port || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

export default app;
