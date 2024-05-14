import axios from "axios";

export const checkAuthService = async (token: string) => {
  return await axios
    .post(`${process.env.AUTH_SERVICE_BASE_URL}/verify-token/get-user`, {
      token,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching user profile:", error);
      return error;
    });
};
