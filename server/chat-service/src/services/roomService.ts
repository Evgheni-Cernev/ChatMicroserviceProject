import { Room, Message } from "../models";
import { Op } from "sequelize";

export const createRoom = async (user1Id: number, user2Id: number) => {
  const existingRoom = await Room.findOne({
    where: {
      [Op.or]: [
        { user1Id, user2Id },
      ],
    },
  });

  if (existingRoom) {
    throw new Error("Room already exists");
  }

  const room = await Room.create({ user1Id, user2Id });

  return room;
};

export const getRoomsByUserId = async (userId: number) => {

  return await Room.findAll({
    where: {
      [Op.or]: [{ user1Id: userId }, { user2Id: userId }],
    },
  });
};

export const getRoomById = async (roomId: number) => {

  return await Room.findAll({
    where: {
      id: roomId
    },
    include: [Message]
  });
};
