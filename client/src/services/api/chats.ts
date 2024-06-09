import axios from '../http/axios';

export const getUserChats = async ({
  userId,
}: {
  userId: number;
}): Promise<{ token: any; user: any }> => {
  console.log('In signup');

  const response = await axios({
    method: 'GET',
    url: `/chats/${userId}`,
  });

  return response.data;
};
