import { Room, Message, RoomParticipants } from "../models";
import { Op } from "sequelize";

export const createRoom = async (
  userIds: number[],
  adminUserId: number,
  isDirectMessage: boolean
) => {
  const sortedUserIds = userIds.sort((a, b) => a - b);

  try {
    const existingRoom = await Room.findOne({
      include: [
        {
          model: RoomParticipants,
          as: "participants",
          where: {
            userId: {
              [Op.in]: sortedUserIds,
            },
          },
        },
      ],
    });

    if (existingRoom) {
      // Проверяем, совпадает ли количество участников в найденной комнате с ожидаемым количеством
      const existingParticipantIds = existingRoom.participants?.map(
        (participant: any) => participant.userId
      );
      const missingParticipants = sortedUserIds.filter(
        (userId) => !existingParticipantIds?.includes(userId)
      );

      if (missingParticipants.length === 0) {
        // Все участники уже присутствуют в комнате, поэтому просто возвращаем эту комнату
        return existingRoom;
      }
    }
  } catch (error) {
    console.error("Error while finding existing room:", error);
    throw new Error("Error while finding existing room.");
  }

  try {
    const room = await Room.create({
      isDirectMessage: isDirectMessage,
      adminUserId: adminUserId,
    });

    await Promise.all(
      sortedUserIds.map((userId) => {
        return RoomParticipants.create({
          roomId: room.id as number,
          userId: userId,
          role: adminUserId === userId ? "admin" : "participant",
        });
      })
    );

    return room;
  } catch (error) {
    console.error("Error while creating room:", error);
    throw new Error("Error while creating room.");
  }
};

export const getRoomsByUserId = async (userId: number) => {
  try {
    const roomParticipants = await RoomParticipants.findAll({
      where: {
        userId: userId,
      },
    });

    const roomIds = roomParticipants.map((participant) => participant.roomId);
    const rooms = await Room.findAll({
      where: {
        id: roomIds,
      },
    });

    return rooms;
  } catch (error) {
    console.error("Error while fetching rooms by user ID:", error);
    throw new Error("Failed to fetch rooms by user ID.");
  }
};

export const getRoomById = async (roomId: number) => {
  return await Room.findAll({
    where: {
      id: roomId,
    },
    include: [Message],
  });
};

export const setMessageExpirationTime = async (
  roomId: number,
  messageExpirationTime: number,
  adminUserId: number
): Promise<void> => {
  const room = await Room.findByPk(roomId);
  if (!room) {
    throw new Error("Room not found.");
  }

  if (room.adminUserId !== adminUserId) {
    throw new Error(
      "You are not authorized to set message expiration time for this room."
    );
  }

  await room.update({ messageExpirationTime });
};
