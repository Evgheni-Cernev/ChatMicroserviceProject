import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/authService";

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userService = new AuthService(process.env.AUTH_SERVICE_BASE_URL ?? "");
  
  const token = req.cookies?.auth_token;
  console.log(token)

  if (token == null) return res.sendStatus(401); 

  try {
    const isValid = await userService.validateUser(token);
    console.log(isValid)
    if (isValid) {
      next();
    } else {
      return res.sendStatus(401); 
    }
  } catch (error) {
    console.error('Error validating token:', error);
    return res.sendStatus(500); 
  }
};
