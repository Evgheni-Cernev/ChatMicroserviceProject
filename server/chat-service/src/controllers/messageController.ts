import { Request, Response } from "express";
import * as MessageService from "../services/messageService";
import mime from "mime";
import * as fs from 'fs';
import * as path from 'path';


export const sendMessage = async (req: Request, res: Response) => {
  const { roomId, senderId, content } = req.body;
  const file = req.file ? req.file : undefined;
  try {
    const message = await MessageService.sendMessage(
      roomId,
      senderId,
      content,
      file
    );
    req.io.emit("sendMessage", { roomId, message });
    res.status(201).json(message);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getFile = async (req: Request, res: Response) => {
  const { fileName } = req.params;
  const directoryPath = path.join(__dirname, '../../uploads');
  const filePath = path.join(directoryPath, fileName);

  try {
    const fileContent = await fs.promises.readFile(filePath);
    const mimeType = mime.lookup(filePath); // Определяем MIME-тип файла

    res.setHeader('Content-Type', mimeType || 'application/octet-stream');
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
