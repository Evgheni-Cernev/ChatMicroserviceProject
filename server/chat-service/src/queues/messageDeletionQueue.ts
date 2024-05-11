import Bull from 'bull';
import { Message } from '../models';

export const messageDeletionQueue = new Bull('message-deletion', { redis: 'redis://:yourpassword@message-delete-db:6379'});

messageDeletionQueue.process(async (job) => {
    const { messageId } = job.data;
    await Message.destroy({ where: { id: messageId } });
    console.warn(`Message with ID ${messageId} has been deleted.`);
});
