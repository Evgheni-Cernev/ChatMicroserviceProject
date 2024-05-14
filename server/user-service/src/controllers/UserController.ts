import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { UserInstance } from "../models";
import mime from "mime";
import * as fs from "fs";
import * as path from "path";

const userService = new UserService();

class UserController {
  async register(req: Request, res: Response) {
    try {
      const user = await userService.createUser(req.body as UserInstance);
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

  async getUserByEmail(req: Request, res: Response) {
    try {
      const user = await userService.getUserByEmail(req.params.email);
      res.json(user);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  async getUserAll(req: Request, res: Response) {
    try {
      const user = await userService.getUserAll(req.params.userId);
      res.json(user);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  async updateProfile(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId);
      const updatedUser = await userService.updateUser(
        userId,
        req.body as UserInstance,
      );
      res.json(updatedUser);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateAvatar(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId);
      const file = req.file;
      console.warn({userId, file})
      const updatedUser = await userService.updateAvatar(userId, file);

      res.json({ message: "Avatar updated successfully", user: updatedUser });
    } catch (error) {
      console.error("Error updating avatar:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getAvatar(req: Request, res: Response) {
    const { fileName } = req.params;
    const directoryPath = path.join(__dirname, "../../userAvatar");
    const filePath = path.join(directoryPath, fileName);
  
    try {
      const fileContent = await fs.promises.readFile(filePath);
      const mimeType = mime.lookup(filePath);
  
      res.setHeader("Content-Type", mimeType || "application/octet-stream");
      res.status(200).send(fileContent);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

}

export default new UserController();
