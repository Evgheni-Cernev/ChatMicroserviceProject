import { Request, Response } from "express";
import * as RoomService from "../services/roomService";

export const createRoom = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userIds, adminUserId, isDirectMessage } = req.body;

    if (!Array.isArray(userIds) || userIds.length < 2) {
      res.status(400).json({
        message: "An array of user IDs with at least two users is required.",
      });
      return;
    }

    if (!adminUserId) {
      res.status(400).json({ message: "Admin user ID is required." });
      return;
    }

    if (!userIds.includes(adminUserId)) {
      res.status(400).json({
        message: "Admin user ID must be one of the room participants.",
      });
      return;
    }

    const room = await RoomService.createRoom(
      userIds,
      adminUserId,
      isDirectMessage
    );

    if (req.io) {
      req.io.emit("room_created", { room });
    }

    res.status(201).json({ room });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getRooms = async (req: Request, res: Response): Promise<void> => {
  try {
    const {userId } = req.params;
    const rooms = await RoomService.getRoomsByUserId( parseInt(userId));
    res.status(200).json(rooms);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const setRoomMessageExpirationTime = async (req: Request, res: Response): Promise<void> => {
  try {
    const { roomId, adminUserId } = req.params;
    const { messageExpirationTime } = req.body;

    await RoomService.setMessageExpirationTime(parseInt(roomId), messageExpirationTime, parseInt(adminUserId));
    res.status(200).json({ message: "Message expiration time has been updated successfully." });
  } catch (error) {
    console.error("Error while setting message expiration time:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};


