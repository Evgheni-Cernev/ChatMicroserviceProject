import dotenv from "dotenv";

dotenv.config();

interface Config {
  port: number;
  redisUrl: string;
  jwtSecret: string;
  jwtExpiration: number;
}

const config: Config = {
  port: parseInt(process.env.PORT || "3009", 10),
  redisUrl: process.env.REDIS_URL || "redis://:yourpassword@auth-db:6379",
  jwtSecret: process.env.JWT_SECRET || "your_jwt_secret",
  jwtExpiration: parseInt(process.env.JWT_EXPIRATION || "3600", 10),
};

export default config;
