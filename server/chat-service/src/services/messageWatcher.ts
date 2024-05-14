import { Message, Room } from "../models";
import { messageDeletionQueue } from "../queues/messageDeletionQueue";

export async function setupMessageWatcher() {
  Message.afterCreate(async (message, options) => {
    const room = await Room.findByPk(message.roomId);
    if (room && room.messageExpirationTime != null) {
      const delay = room.messageExpirationTime * 1000;
      (await messageDeletionQueue.add({ messageId: message.id }, { delay }));
      console.warn(
        `Scheduled deletion for message ${message.id} in ${delay} ms.`
      );
    } else {
      console.warn(
        `No expiration time set for room ${message.roomId}, or room does not exist.`
      );
    }
  });
}
