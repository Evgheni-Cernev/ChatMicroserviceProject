import { Message } from "../models";
import * as fs from 'fs';
import * as path from 'path';

export const sendMessage = async (
  roomId: number,
  senderId: number,
  content: string,
  file?: Express.Multer.File
) => {
  let filePath: string | undefined;
  let fileExtension: string | undefined;

  if (file) {
    filePath = file.filename;
    console.log(file)
    const filenameParts = file.originalname.split(".");
    fileExtension = filenameParts[filenameParts.length - 1];
  }

  return await Message.create({
    roomId,
    senderId,
    content,
    filePath,
    fileExtension,
    timestamp: new Date(),
  });
};

export const getFileByName = async (fileName: string) => {
  const directoryPath = path.join(__dirname, '../../uploads');
  const filePath = path.join(directoryPath, fileName);

  try {
      const fileContent = await fs.promises.readFile(filePath);
      
      return fileContent;
  } catch (error) {
      throw new Error(`Ошибка чтения файла ${fileName}: ${error}`);
  }
};

export const getMessagesByRoomId = async (roomId: number) => {
  return await Message.findAll({
    where: { roomId },
  });
};
