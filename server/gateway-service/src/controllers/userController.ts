import { Request, Response } from 'express';
import axios from 'axios';

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






