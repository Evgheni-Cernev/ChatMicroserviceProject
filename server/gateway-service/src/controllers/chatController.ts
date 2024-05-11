import { Request, Response } from "express";
import axios from "axios";

export const createNewChat = async (req: Request, res: Response) => {
  try {
    const response = await axios.post(
      `${process.env.CHAT_SERVICE_BASE_URL}/rooms`,
      req.body
    );

    res.json(response.data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getChatRoomsByUserId = async (req: Request, res: Response) => {
  try {
    const response = await axios.get(
      `${process.env.CHAT_SERVICE_BASE_URL}/rooms/${req.params.userId}`
    );

    res.json(response.data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMessagesByRoomId = async (req: Request, res: Response) => {
  try {
    const response = await axios.get(
      `${process.env.CHAT_SERVICE_BASE_URL}/messages/${req.params.roomId}`
    );

    res.json(response.data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const setMessageExpirationTime = async (req: Request, res: Response) => {
  try {
    const response = await axios.post(
      `${process.env.CHAT_SERVICE_BASE_URL}/rooms/${req.params.roomId}/${req.params.adminUserId}`,
      req.body
    );

    res.json(response.data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const sendNewMessage = async (req: Request, res: Response) => {
  try {
    const response = await axios.post(
      `${process.env.CHAT_SERVICE_BASE_URL}/messages`,
      req.body
    );

    res.json(response.data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getFileByName = async (req: Request, res: Response) => {
  try {
    const response = await axios.get(
      `${process.env.CHAT_SERVICE_BASE_URL}/messages/file/${req.params.fileName}`,
    );

    res.json(response.data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
