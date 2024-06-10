import axios from '../http/axios';

export const getAllUsers = async ({
  userId,
}: {
  userId: number;
}): Promise<any> => {
  console.log('In getAllUsers');

  const response = await axios({
    method: 'GET',
    url: `/user/all/${userId}`,
  });

  return response.data;
};
