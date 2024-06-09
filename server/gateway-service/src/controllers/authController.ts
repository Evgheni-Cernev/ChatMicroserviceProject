import { Request, Response } from "express";
import axios from "axios";

export const login = async (req: Request, res: Response) => {
  try {
    const { data } = await axios.post(
      `${process.env.AUTH_SERVICE_BASE_URL}/login`,
      req.body
    );

    const token = data.token;

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json(data.user);
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

    const token = data.token;

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict", 
    });

    res.status(201).json(data.user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = async (req: Request, res: Response) => {
  const token = req.cookies?.auth_token;

  try {
    const response = await axios.post(
      `${process.env.AUTH_SERVICE_BASE_URL}/logout`,
      {
        token
      }
    );

    res.clearCookie("auth_token");

    res.sendStatus(Number(response.status));
  } catch (error: any) {
    console.error("Logout failed:", error);
    res.status(500).json({ message: error.message });
  }
};
