import axios, { AxiosResponse } from 'axios';

const authURL = 'https://betacall-backend.onrender.com/api/users';

interface SignInResponseData {
  accessToken: string;
  message: string;
  refreshToken: string;
  user: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    appwriteId: string;
    verified: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export const userSignIn = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<AxiosResponse<SignInResponseData>> => {
  try {
    const response = await axios.post<SignInResponseData>(`${authURL}/login`, {
      email,
      password,
    });
    return response;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return err.response as AxiosResponse<SignInResponseData>;
    }
    throw err;
  }
};

export const userSignUp = async ({
  email,
  firstName,
  lastName,
  password,
  appwriteId,
  terms,
}: {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  appwriteId?: string;
  terms: boolean;
}): Promise<AxiosResponse<unknown>> => {
  try {
    const response = await axios.post<unknown>(`${authURL}/register`, {
      email,
      firstName,
      lastName,
      password,
      appwriteId,
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

export const userAppwriteSignIn = async ({
  email,
  appwriteId,
}: {
  email: string;
  appwriteId: string;
}): Promise<AxiosResponse<SignInResponseData>> => {
  try {
    const response = await axios.post<SignInResponseData>(
      `${authURL}/login/appwrite`,
      {
        email,
        appwriteId,
      }
    );
    return response;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return err.response as AxiosResponse<SignInResponseData>;
    }
    throw err;
  }
};

export const resendVerification = async (email: string) => {
  try {
    const response = await axios.post(`${authURL}/resend-verification`, {
      email,
    });
    return response;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return err.response as AxiosResponse<unknown>;
    }
    throw err;
  }
};
