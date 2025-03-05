import axios, { AxiosResponse } from 'axios';

const resetPasswordURL =
  'https://betacall-backend.onrender.com/api/users/request-reset-password';

export const tokenResetPassword = async (
  newPassword: string,
  token: string
) => {
  try {
    const response = await axios.post(`${resetPasswordURL}/${token}`, {
      newPassword,
    });
    return response;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return err.response as AxiosResponse<unknown>;
    }
    throw err;
  }
};

export const requestResetPassword = async (email: string) => {
  try {
    const response = await axios.post(resetPasswordURL, { email });
    return response;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return err.response as AxiosResponse<unknown>;
    }
    throw err;
  }
};
