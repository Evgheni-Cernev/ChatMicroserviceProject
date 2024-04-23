import { Request, Response } from "express";
import { UserService } from "../services/UserService";

const userService = new UserService();

class UserController {
  async register(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      const user = await userService.createUser(username, password);
      res.status(201).json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      const authData = await userService.authenticateUser(username, password);
      res.json(authData);
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }

  async getProfile(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId);
      const user = await userService.getUserById(userId);
      res.json(user);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  async updateProfile(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId);
      const { username, password } = req.body;
      const updatedUser = await userService.updateUser(
        userId,
        username,
        password
      );
      res.json(updatedUser);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new UserController();
