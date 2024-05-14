import { Request, Response } from "express";
import axios from "axios";
import FormData from "form-data";

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
    const formData = new FormData();

    Object.keys(req.body).forEach((key) => {
      if (key !== "file") {
        formData.append(key, req.body[key]);
      }
    });

    if (req.file) {
      formData.append("file", req.file.buffer, req.file.originalname);
    }

    const response = await axios.post(
      `${process.env.CHAT_SERVICE_BASE_URL}/messages`,
      formData
    );

    res.json(response.data);
  } catch (error: any) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getFileByName = async (req: Request, res: Response) => {
  try {
    const { fileName } = req.params;
    const url = `${process.env.CHAT_SERVICE_BASE_URL}/messages/file/${fileName}`;

    const response = await axios.get(url, {
      responseType: "arraybuffer",
    });

    const mimeType = response.headers["content-type"]; // Ensure correct MIME type is forwarded
    res.setHeader("Content-Type", mimeType || "application/octet-stream");
    res.status(200).send(Buffer.from(response.data));
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getChatRecipientsPublicKeys = async (
  req: Request,
  res: Response
) => {
  try {
    const response = await axios.get(
      `${process.env.CHAT_SERVICE_BASE_URL}/rooms/${req.params.roomId}/public-keys`,
      req.body
    );

    res.json(response.data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
