import sequelize, {
  Room,
  Message,
  RoomParticipants,
  RoomAttributes,
} from "../models";
import { getUserById } from "./messageService";

import { Transaction } from "sequelize";

import axios from "axios";

export const createRoom = async (
  userIds: number[],
  adminUserId: number,
  isDirectMessage: boolean,
  chatName: string
): Promise<RoomAttributes> => {
  const transaction: Transaction = await sequelize.transaction();

  try {
    // Ensure user IDs are unique and sorted
    const uniqueUserIds = [...new Set(userIds)].sort((a, b) => a - b);

    const rooms: RoomAttributes[] = await Room.findAll({
      where: { adminUserId },
      include: [
        {
          model: RoomParticipants,
          as: "participants",
          attributes: ["userId"],
          required: true,
        },
      ],
      transaction,
    });

    const matchingRoom = rooms.find((room) => {
      const participantIds = room.participants
        ?.map((p) => p.userId)
        .sort((a, b) => a - b);
      return JSON.stringify(participantIds) === JSON.stringify(uniqueUserIds);
    });

    if (matchingRoom) {
      await transaction.commit();
      return matchingRoom;
    }

    const room: RoomAttributes = await Room.create(
      {
        isDirectMessage,
        adminUserId,
        chatName,
      },
      { transaction }
    );

    await Promise.all(
      uniqueUserIds.map((userId) =>
        RoomParticipants.create(
          {
            roomId: room.id as number,
            userId,
            role: userId === adminUserId ? "admin" : "participant",
          },
          { transaction }
        )
      )
    );

    await transaction.commit();
    return room;
  } catch (error) {
    await transaction.rollback();
    console.error("Error while creating or finding room:", error);
    throw new Error("Error while creating or finding room.");
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
      include: [
        {
          model: RoomParticipants,
          as: "participants",
          attributes: ["userId"],
          required: true,
        },
      ],
    });

    const roomsWithAdminAndParticipants = await Promise.all(
      rooms.map(async (room) => {
        const { adminUserId, participants, ...other } = room.toJSON();

        // Get admin user details
        const adminUser = adminUserId ? await getUserById(adminUserId) : null;
        if (!adminUser) {
          return;
        }

        // Get details for each participant
        const participantsWithDetails = participants
          ? await Promise.all(
              participants.map(async (participant) => {
                const user = await getUserById(participant.userId);
                return {
                  userId: participant.userId,
                  username: user.username,
                  email: user.email,
                };
              })
            )
          : null;

        return {
          ...other,
          adminUser: {
            username: adminUser.username,
            email: adminUser.email,
            id: adminUser.id,
          },
          participants: participantsWithDetails,
        };
      })
    );

    return roomsWithAdminAndParticipants;
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
export const getRecipientsByRoomId = async (roomId: number) => {
  try {
    const room = await Room.findOne({
      where: { id: roomId },
      include: [
        {
          model: RoomParticipants,
          as: "participants",
        },
      ],
    });

    if (!room) {
      throw new Error(`Room with id ${roomId} not found`);
    }

    const participants = room.participants ?? [];

    const participantsWithKeys = await Promise.all(
      participants.map(async (participant: any) => {
        const response = await axios.get(
          `${process.env.USER_SERVICE_BASE_URL}/profile/${participant.userId}`
        );
        const { publicKey } = response.data;
        return { userId: participant.userId, publicKey };
      })
    );

    return participantsWithKeys;
  } catch (error) {
    console.error("Error fetching recipients by room ID:", error);
    throw error;
  }
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
