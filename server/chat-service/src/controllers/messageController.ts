import { Request, Response } from "express";
import * as MessageService from "../services/messageService";
import mime from "mime";
import * as fs from "fs";
import * as path from "path";

export const sendMessage = async (req: Request, res: Response) => {
  const { roomId, senderId, content, encryptedKeys } = req.body;
  const file = req.file ? req.file : undefined;

  try {
    const message = await MessageService.sendMessage(
      roomId,
      senderId,
      content,
      encryptedKeys,
      file
    );

    if (req.io && req.io.to) {
      req.io.to(roomId).emit("sendMessage", {
        roomId,
        message: {
          ...message,
        },
      });
      res.status(201).json({
        ...message,
      });
    } else {
      console.error("Socket.io instance not available on req object");
      res
        .status(500)
        .json({ message: "Internal server error, socket.io not initialized" });
    }
  } catch (error: any) {
    console.error("Error sending message:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to send message" });
  }
};

export const getFile = async (req: Request, res: Response) => {
  const { fileName } = req.params;
  const directoryPath = path.join(__dirname, "../../uploads");
  const filePath = path.join(directoryPath, fileName);

  try {
    const fileContent = await fs.promises.readFile(filePath);
    const mimeType = mime.lookup(filePath);

    res.setHeader("Content-Type", mimeType || "application/octet-stream");
    res.status(200).send(fileContent);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;
    const messages = await MessageService.getMessagesByRoomId(parseInt(roomId));
    res.status(200).json(messages);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
