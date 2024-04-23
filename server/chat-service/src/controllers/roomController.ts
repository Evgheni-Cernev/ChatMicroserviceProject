import { Request, Response } from 'express';
import * as RoomService from '../services/roomService';

export const createRoom = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user1Id, user2Id } = req.body;
    const room = await RoomService.createRoom(user1Id, user2Id);
    req.io.emit('room_created', { room });
    res.status(201).json(room);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getRooms = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const rooms = await RoomService.getRoomsByUserId(parseInt(userId));
    res.status(200).json(rooms);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
