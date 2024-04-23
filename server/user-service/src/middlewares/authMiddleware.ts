import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/tokenUtils";
import { User } from '../models';

export const  authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided." });
  }

  try {
    const decoded = verifyToken(token);
    const user = await User.findOne({ where: { password:  decoded.password } });
    if(!user){
      throw new Error("Failed to authenticate token.")
    }

    req.body.userId = user.id;
    next();
  } catch (error) {
    res.status(401).json({ message: "Failed to authenticate token." });
  }
};
