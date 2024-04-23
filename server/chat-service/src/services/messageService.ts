import { Message } from "../models";

export const sendMessage = async (
  roomId: number,
  senderId: number,
  content: string
) => {
  return await Message.create({
    roomId,
    senderId,
    content,
    timestamp: new Date(),
  });
};

export const getMessagesByRoomId = async (roomId: number) => {
  return await Message.findAll({
    where: { roomId },
  });
};
