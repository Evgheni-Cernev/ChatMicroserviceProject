import jwt from "jsonwebtoken";
import config from "../config/config";

export const generateToken = (password: string): string => {
  return jwt.sign({ password }, config.jwtSecret, { expiresIn: "1h" });
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};
