import { Request, Response } from 'express';
import axios from 'axios';

export const login = async (req: Request, res: Response) => {
  try {
    const { data } = await axios.post(
      `${process.env.AUTH_SERVICE_BASE_URL}/login`,
      req.body
    );

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { data } = await axios.post(
      `${process.env.AUTH_SERVICE_BASE_URL}/register`,
      req.body
    );

    res.status(201).json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const response = await axios.get(
      `${process.env.AUTH_SERVICE_BASE_URL}/logout`,
      {
        headers: {
          authorization: req.headers['authorization'],
        },
      }
    );
    res.sendStatus(Number(response.status));
  } catch (error: any) {
    console.error('Logout failed:', error);
    res.status(500).json({ message: error.message });
  }
};
