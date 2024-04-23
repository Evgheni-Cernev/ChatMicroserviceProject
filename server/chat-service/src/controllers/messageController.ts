import { Request, Response } from "express";
import * as MessageService from "../services/messageService";

export const sendMessage = async (req: Request, res: Response) => {
  const { roomId, senderId, content } = req.body;
  try {
    const message = await MessageService.sendMessage(roomId, senderId, content);
    req.io.to(roomId.toString()).emit("new_message", message);
    res.status(201).json(message);
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
