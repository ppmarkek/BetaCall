import axios, { AxiosResponse } from 'axios';

const authURL = 'https://betacall-backend.onrender.com/api/users';

export const userSignIn = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<AxiosResponse<unknown>> => {
  try {
    const response = await axios.post<unknown>(`${authURL}/login`, {
      email,
      password,
    });
    return response;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return err.response as AxiosResponse<unknown>;
    }
    throw err;
  }
};

export const userSignUp = async ({
  email,
  firstName,
  lastName,
  password,
  terms,
}: {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  terms: boolean;
}): Promise<AxiosResponse<unknown>> => {
  try {
    const response = await axios.post<unknown>(`${authURL}/register`, {
      email,
      firstName,
      lastName,
      password,
      terms,
    });
    return response;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return err.response as AxiosResponse<unknown>;
    }
    throw err;
  }
};
