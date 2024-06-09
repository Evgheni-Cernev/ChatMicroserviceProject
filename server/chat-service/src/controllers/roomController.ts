import { Request, Response } from "express";
import * as RoomService from "../services/roomService";
import { Server as SocketIOServer, Socket } from "socket.io";

export const createRoom = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userIds, adminUserId, isDirectMessage, chatName } = req.body;

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

    if(!chatName) {
      res.status(400).json({
        message: "chatName is required",
      });
    }

    const room = await RoomService.createRoom(
      userIds,
      adminUserId,
      isDirectMessage,
      chatName
    );

    if (req.io) {
      userIds.forEach((userId) => {
        const sockets = findAllSocketsForUser(req.io, userId);
        sockets.forEach((socket) => {
          socket.emit("room_created", { room });
        });
      });
      res.status(201).json({ room });
    } else {
      console.error("Socket.io is not initialized on the request object.");
      res.status(500).json({ message: "Socket.io is not initialized." });
    }
  } catch (error: any) {
    console.error("Failed to create room:", error);
    res.status(500).json({ message: error.message });
  }
};

function findAllSocketsForUser(io: SocketIOServer, userId: number): Socket[] {
  let sockets: Socket[] = [];
  io.of("/").sockets.forEach((socket) => {
    if ((socket as any).userId === userId) {
      sockets.push(socket);
    }
  });
  return sockets;
}

export const getRooms = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const rooms = await RoomService.getRoomsByUserId(parseInt(userId));
    res.status(200).json(rooms);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const setRoomMessageExpirationTime = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { roomId, adminUserId } = req.params;
    const { messageExpirationTime } = req.body;

    await RoomService.setMessageExpirationTime(
      parseInt(roomId),
      messageExpirationTime,
      parseInt(adminUserId)
    );
    res.status(200).json({
      message: "Message expiration time has been updated successfully.",
    });
  } catch (error) {
    console.error("Error while setting message expiration time:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getChatRecipientsPublicKeys = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { roomId } = req.params;
    const recipients = await RoomService.getRecipientsByRoomId(
      parseInt(roomId)
    );

    res.json(recipients);
  } catch (error) {
    console.error("Error fetching chat recipients public keys:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching public keys" });
  }
};
