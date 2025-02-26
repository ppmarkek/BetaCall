import axios, { AxiosResponse } from 'axios';

const URL =
  'https://betacall-backend.onrender.com/api/users/request-reset-password';

export const requestResetPassword = async (email: string) => {
  try {
    const response = await axios.post(URL, { email });
    return response;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return err.response as AxiosResponse<unknown>;
    }
    throw err;
  }
};