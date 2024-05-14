import { Message } from "../models";
import * as fs from "fs";
import * as path from "path";
import axios from "axios";
import { getRecipientsByRoomId } from "./roomService";

const getUserPublicKey = async (userId: number) => {
  const user = await getUserById(userId);
  return user ? user.publicKey : null;
};

export const sendMessage = async (
  roomId: number,
  senderId: number,
  content?: string,
  encryptedKeys?: any,
  file?: Express.Multer.File
) => {
  let filePath;
  let fileExtension;

  if (file) {
    filePath = file.filename;
    const filenameParts = file.originalname.split(".");
    fileExtension = filenameParts[filenameParts.length - 1];
  }

  const sender = await getUserById(senderId);

  const message = await Message.create({
    roomId,
    senderId,
    content,
    filePath,
    fileExtension,
    timestamp: new Date(),
  });

  return {
    ...message.get({ plain: true }),
    content: JSON.parse(message.content ?? ""),
    sender,
  };
};

export const getFileByName = async (fileName: string) => {
  const directoryPath = path.join(__dirname, "../../uploads");
  const filePath = path.join(directoryPath, fileName);

  try {
    const fileContent = await fs.promises.readFile(filePath);

    return fileContent;
  } catch (error) {
    throw new Error(`Ошибка чтения файла ${fileName}: ${error}`);
  }
};

export const getMessagesByRoomId = async (roomId: number) => {
  try {
    const messages = await Message.findAll({
      where: { roomId },
    });

    const resMessages = await Promise.all(
      messages.map(async (message) => {
        const sender = await getUserById(message.senderId);
        return {
          ...{
            ...message.get({ plain: true }),
            content: JSON.parse(message.content ?? ""),
          },
          sender,
        };
      })
    );

    return resMessages;
  } catch (error) {
    console.error("Error while fetching room data:", error);
    throw new Error("Failed to retrieve room data.");
  }
};

export const getUserById = async (userId: number | string) => {
  return await axios
    .get(`${process.env.USER_SERVICE_BASE_URL}/profile/${userId}`)
    .then((response) => {
      const {
        id,
        firstName,
        avatar,
        age,
        lastName,
        language,
        username,
        region,
        lastLoginDate,
        country,
        publicKey,
      } = response.data;
      return {
        id,
        firstName,
        avatar,
        age,
        lastName,
        language,
        username,
        region,
        lastLoginDate,
        country,
        publicKey,
      };
    });
};
