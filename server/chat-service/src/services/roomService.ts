import { Room } from "../models";
import { Op } from "sequelize";

export const createRoom = async (user1Id: number, user2Id: number) => {
  const existingRoom = await Room.findOne({
    where: {
      [Op.or]: [
        { user1Id, user2Id },
        { user1Id: user2Id, user2Id: user1Id },
      ],
    },
  });

  if (existingRoom) {
    throw new Error("Room already exists");
  }

  return await Room.create({ user1Id, user2Id });
};

export const getRoomsByUserId = async (userId: number) => {
  return await Room.findAll({
    where: {
      [Op.or]: [{ user1Id: userId }, { user2Id: userId }],
    },
  });
};
