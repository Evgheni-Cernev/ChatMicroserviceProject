import axios from '../http/axios';

export const signup = async ({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name: string;
}): Promise<any> => {
  const response = await axios({
    method: 'POST',
    url: '/register',
    data: { email, password, name },
  });

  return response.data;
};

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<any> => {
  const response = await axios({
    method: 'POST',
    url: '/login',
    data: { email, password },
  });

  return response.data;
};
