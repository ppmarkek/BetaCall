import axios, { AxiosResponse, AxiosError, AxiosHeaders } from 'axios';
import {
  tokenResetPassword,
  requestResetPassword,
} from '@/app/api/userData/route';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const resetPasswordURL =
  'https://betacall-backend.onrender.com/api/users/request-reset-password';
const emptyHeaders = new AxiosHeaders();

describe('User Data API - tokenResetPassword', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('Successful responses', () => {
    it('should return data on successful password reset', async () => {
      const token = 'reset-token-123';
      const newPassword = 'newPassword!234';
      const mockResponse: AxiosResponse = {
        data: { message: 'Password updated successfully' },
        status: 200,
        statusText: 'OK',
        headers: emptyHeaders,
        config: { headers: emptyHeaders },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);
      const response = await tokenResetPassword(newPassword, token);

      expect(response.data).toEqual(mockResponse.data);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${resetPasswordURL}/${token}`,
        { newPassword }
      );
    });
  });

  describe('Error handling', () => {
    beforeEach(() => {
      jest
        .spyOn(axios, 'isAxiosError')
        .mockImplementation(
          (err): err is AxiosError =>
            !!err && (err as AxiosError).isAxiosError === true
        );
    });

    it('should return error response if axios error with response', async () => {
      const token = 'reset-token-123';
      const newPassword = 'newPassword!234';
      const errorResponse: AxiosResponse = {
        data: { message: 'Server error' },
        status: 500,
        statusText: 'Internal Server Error',
        headers: emptyHeaders,
        config: { headers: emptyHeaders },
      };

      const axiosError = new Error('Server error') as AxiosError;
      axiosError.isAxiosError = true;
      axiosError.response = errorResponse;

      mockedAxios.post.mockRejectedValue(axiosError);
      const response = await tokenResetPassword(newPassword, token);

      expect(response).toEqual(errorResponse);
    });

    it('should throw the error if axios error has no response', async () => {
      const token = 'reset-token-123';
      const newPassword = 'newPassword!234';
      const axiosError = new Error('Error without response') as AxiosError;
      axiosError.isAxiosError = true;
      axiosError.response = undefined;

      mockedAxios.post.mockRejectedValue(axiosError);
      await expect(tokenResetPassword(newPassword, token)).rejects.toThrow(
        'Error without response'
      );
    });

    it('should throw the error if it is not an axios error', async () => {
      const token = 'reset-token-123';
      const newPassword = 'newPassword!234';
      jest.spyOn(axios, 'isAxiosError').mockReturnValue(false);

      const nonAxiosError = new Error('Not an axios error');
      mockedAxios.post.mockRejectedValue(nonAxiosError);
      await expect(tokenResetPassword(newPassword, token)).rejects.toThrow(
        'Not an axios error'
      );
    });
  });
});

describe('User Data API - requestResetPassword', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('Successful responses', () => {
    it('should return data on successful reset password request', async () => {
      const email = 'test@example.com';
      const mockResponse: AxiosResponse = {
        data: { message: 'Reset email sent successfully' },
        status: 200,
        statusText: 'OK',
        headers: emptyHeaders,
        config: { headers: emptyHeaders },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);
      const response = await requestResetPassword(email);

      expect(response.data).toEqual(mockResponse.data);
      expect(mockedAxios.post).toHaveBeenCalledWith(resetPasswordURL, {
        email,
      });
    });
  });

  describe('Error handling', () => {
    beforeEach(() => {
      jest
        .spyOn(axios, 'isAxiosError')
        .mockImplementation(
          (err): err is AxiosError =>
            !!err && (err as AxiosError).isAxiosError === true
        );
    });

    it('should return error response if axios error with response', async () => {
      const email = 'test@example.com';
      const errorResponse: AxiosResponse = {
        data: { message: 'Server error' },
        status: 500,
        statusText: 'Internal Server Error',
        headers: emptyHeaders,
        config: { headers: emptyHeaders },
      };

      const axiosError = new Error('Server error') as AxiosError;
      axiosError.isAxiosError = true;
      axiosError.response = errorResponse;

      mockedAxios.post.mockRejectedValue(axiosError);
      const response = await requestResetPassword(email);

      expect(response).toEqual(errorResponse);
    });

    it('should throw the error if axios error has no response', async () => {
      const email = 'test@example.com';
      const axiosError = new Error('Error without response') as AxiosError;
      axiosError.isAxiosError = true;
      axiosError.response = undefined;

      mockedAxios.post.mockRejectedValue(axiosError);
      await expect(requestResetPassword(email)).rejects.toThrow(
        'Error without response'
      );
    });

    it('should throw the error if it is not an axios error', async () => {
      const email = 'test@example.com';
      jest.spyOn(axios, 'isAxiosError').mockReturnValue(false);

      const nonAxiosError = new Error('Not an axios error');
      mockedAxios.post.mockRejectedValue(nonAxiosError);
      await expect(requestResetPassword(email)).rejects.toThrow(
        'Not an axios error'
      );
    });
  });
});
