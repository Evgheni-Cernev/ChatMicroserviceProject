import { Request, Response } from 'express';
import axios from 'axios';
import FormData from 'form-data';

export const getUserById = async (req: Request, res: Response) => {
  try {
    const response = await axios.get(`${process.env.USER_SERVICE_BASE_URL}/profile/${req.params.userId}`);
    
    res.json(response.data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserById = async (req: Request, res: Response) => {
  try {
    const response = await axios.put(`${process.env.USER_SERVICE_BASE_URL}/profile/${req.params.userId}`, req.body);
    
    res.json(response.data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserAll = async (req: Request, res: Response) => {
  try {

    const response = await axios.get(`${process.env.USER_SERVICE_BASE_URL}/all`, req.body);
    
    res.json(response.data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserAvatarById = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).send('No file uploaded.');
      return;
    }

    const formData = new FormData();
    formData.append('file', req.file.buffer, req.file.originalname);  // Здесь предполагается, что multer используется с memoryStorage

    const url = `${process.env.USER_SERVICE_BASE_URL}/profile/avatar/${req.params.userId}`;

    const response = await axios.put(url, formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer YOUR_AUTH_TOKEN`, // Убедитесь, что передаёте токен авторизации, если это необходимо
      }
    });

    res.json(response.data);
  } catch (error: any) {
    console.error('Error uploading avatar:', error);
    res.status(500).json({ message: error.message });
  }
};






