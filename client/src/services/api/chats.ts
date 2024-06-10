import axios from '../http/axios';

export const getUserChats = async ({
  userId,
}: {
  userId: number;
}): Promise<any> => {
  console.log('In getUserChats');

  const response = await axios({
    method: 'GET',
    url: `/chats/${userId}`,
  });

  return response.data;
};

export const createChat = async ({
  userIds,
  adminUserId,
  isDirectMessage,
  chatName,
}: {
  userIds: number[];
  adminUserId: number;
  isDirectMessage: boolean;
  chatName: string;
}): Promise<any> => {
  console.log('In createChat');

  const response = await axios({
    method: 'POST',
    url: `/chat/create`,
    data: { userIds, adminUserId, isDirectMessage, chatName },
  });

  return response.data;
};

export const sendMessage = async ({
  userIds,
  adminUserId,
  isDirectMessage,
  chatName,
}: {
  userIds: number[];
  adminUserId: number;
  isDirectMessage: boolean;
  chatName: string;
}): Promise<any> => {
  console.log('In createChat');

  const response = await axios({
    method: 'POST',
    url: `/chat/create`,
    data: { userIds, adminUserId, isDirectMessage, chatName },
  });

  return response.data;
};
