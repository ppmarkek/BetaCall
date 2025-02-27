import axios, { AxiosResponse, AxiosError, AxiosHeaders } from 'axios';
import {
  userSignIn,
  userSignUp,
  userAppwriteSignIn,
  resendVerification,
} from '../../../app/api/auth/route';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const emptyHeaders = new AxiosHeaders();

describe('Auth API', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  // ---------------------------
  // Tests for userSignIn
  // ---------------------------
  describe('userSignIn - Successful responses', () => {
    it('should return data on successful sign in', async () => {
      const mockResponse: AxiosResponse = {
        data: {
          message: 'Authentication successful',
          user: {
            _id: '67bf427b467db8378700259d',
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'Test',
            role: 'user',
            appwriteId: null,
            verified: true,
            createdAt: '2025-02-26T16:34:03.913Z',
            __v: 0,
          },
        },
        status: 200,
        statusText: 'OK',
        headers: emptyHeaders,
        config: { headers: emptyHeaders },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);
      const response = await userSignIn({
        email: 'test@example.com',
        password: '{S[6O$}V56v^',
      });

      expect(response.data).toEqual(mockResponse.data);
    });

    it('should return data on user not found sign in', async () => {
      const mockResponse: AxiosResponse = {
        data: {
          message: 'Authentication successful',
        },
        status: 404,
        statusText: 'Not Found',
        headers: emptyHeaders,
        config: { headers: emptyHeaders },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);
      const response = await userSignIn({
        email: 'fail@example.com',
        password: '{S[6O$}V56v^',
      });

      expect(response.data).toEqual(mockResponse.data);
    });

    it('should return data on account not verified sign in', async () => {
      const mockResponse: AxiosResponse = {
        data: {
          message: 'Account not verified',
        },
        status: 403,
        statusText: 'Forbidden',
        headers: emptyHeaders,
        config: { headers: emptyHeaders },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);
      const response = await userSignIn({
        email: 'testNotVerified@example.com',
        password: '{S[6O$}V56v^',
      });

      expect(response.data).toEqual(mockResponse.data);
    });

    it('should return data on invalid credentials sign in', async () => {
      const mockResponse: AxiosResponse = {
        data: {
          message: 'Invalid credentials',
        },
        status: 401,
        statusText: 'Unauthorized',
        headers: emptyHeaders,
        config: { headers: emptyHeaders },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);
      const response = await userSignIn({
        email: 'test@example.com',
        password: '{S[6O$}V56v^_',
      });

      expect(response.data).toEqual(mockResponse.data);
    });
  });

  describe('userSignIn - Error handling', () => {
    beforeEach(() => {
      jest
        .spyOn(axios, 'isAxiosError')
        .mockImplementation(
          (err): err is AxiosError =>
            !!err && (err as AxiosError).isAxiosError === true
        );
    });

    it('should return response if the error is an axios error with a response', async () => {
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

      const response = await userSignIn({
        email: 'test@example.com',
        password: '{S[6O$}V56v^_',
      });

      expect(response).toEqual(errorResponse);
    });

    it('should throw the error if it is an axios error without a response', async () => {
      const axiosError = new Error('Error without response') as AxiosError;
      axiosError.isAxiosError = true;
      axiosError.response = undefined;

      mockedAxios.post.mockRejectedValue(axiosError);

      await expect(
        userSignIn({ email: 'test@example.com', password: '{S[6O$}V56v^_' })
      ).rejects.toThrow('Error without response');
    });

    it('should throw the error if it is not an axios error', async () => {
      jest.spyOn(axios, 'isAxiosError').mockReturnValue(false);

      const nonAxiosError = new Error('Not an axios error');

      mockedAxios.post.mockRejectedValue(nonAxiosError);

      await expect(
        userSignIn({ email: 'test@example.com', password: '{S[6O$}V56v^_' })
      ).rejects.toThrow('Not an axios error');
    });
  });

  // ---------------------------
  // Tests for userSignUp
  // ---------------------------
  describe('userSignUp - Successful responses', () => {
    it('should return data on successful sign up', async () => {
      const mockResponse: AxiosResponse = {
        data: {
          message: 'User created, verify email sent.',
        },
        status: 201,
        statusText: 'Created',
        headers: emptyHeaders,
        config: { headers: emptyHeaders },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);
      const response = await userSignUp({
        firstName: 'Test',
        lastName: 'Test',
        email: 'test@example.com',
        password: '{S[6O$}V56v^',
        terms: true,
      });

      expect(response.data).toEqual(mockResponse.data);
    });

    it('should return data on user found sign up', async () => {
      const mockResponse: AxiosResponse = {
        data: {
          message: 'A user with the same email already exists',
        },
        status: 400,
        statusText: 'Bad Request',
        headers: emptyHeaders,
        config: { headers: emptyHeaders },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);
      const response = await userSignUp({
        firstName: 'Test',
        lastName: 'Test',
        email: 'test@example.com',
        password: '{S[6O$}V56v^',
        terms: true,
      });

      expect(response.data).toEqual(mockResponse.data);
    });
  });

  describe('userSignUp - Error handling', () => {
    beforeEach(() => {
      jest
        .spyOn(axios, 'isAxiosError')
        .mockImplementation(
          (err): err is AxiosError =>
            !!err && (err as AxiosError).isAxiosError === true
        );
    });

    it('should return response if the error is an axios error with a response', async () => {
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

      const response = await userSignUp({
        firstName: 'Test',
        lastName: 'Test',
        email: 'test@example.com',
        password: '{S[6O$}V56v^',
        terms: true,
      });

      expect(response).toEqual(errorResponse);
    });

    it('should throw the error if it is an axios error without a response', async () => {
      const axiosError = new Error('Error without response') as AxiosError;
      axiosError.isAxiosError = true;
      axiosError.response = undefined;

      mockedAxios.post.mockRejectedValue(axiosError);

      await expect(
        userSignUp({
          firstName: 'Test',
          lastName: 'Test',
          email: 'test@example.com',
          password: '{S[6O$}V56v^',
          terms: true,
        })
      ).rejects.toThrow('Error without response');
    });

    it('should throw the error if it is not an axios error', async () => {
      jest.spyOn(axios, 'isAxiosError').mockReturnValue(false);

      const nonAxiosError = new Error('Not an axios error');

      mockedAxios.post.mockRejectedValue(nonAxiosError);

      await expect(
        userSignUp({
          firstName: 'Test',
          lastName: 'Test',
          email: 'test@example.com',
          password: '{S[6O$}V56v^',
          terms: true,
        })
      ).rejects.toThrow('Not an axios error');
    });
  });

  // ---------------------------
  // Tests for userAppwriteSignIn
  // ---------------------------
  describe('userAppwriteSignIn - Successful responses', () => {
    it('should return data on successful appwrite sign in', async () => {
      const mockResponse: AxiosResponse = {
        data: {
          message: 'Authentication successful',
          user: {
            _id: '67bf427b467db8378700259d',
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'Test',
            role: 'user',
            appwriteId: 'appwriteId123',
            verified: true,
            createdAt: '2025-02-26T16:34:03.913Z',
            __v: 0,
          },
        },
        status: 200,
        statusText: 'OK',
        headers: emptyHeaders,
        config: { headers: emptyHeaders },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);
      const response = await userAppwriteSignIn({
        email: 'test@example.com',
        appwriteId: 'appwriteId123',
      });

      expect(response.data).toEqual(mockResponse.data);
    });
  });

  describe('userAppwriteSignIn - Error handling', () => {
    beforeEach(() => {
      jest
        .spyOn(axios, 'isAxiosError')
        .mockImplementation(
          (err): err is AxiosError =>
            !!err && (err as AxiosError).isAxiosError === true
        );
    });

    it('should return response if the error is an axios error with a response', async () => {
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

      const response = await userAppwriteSignIn({
        email: 'test@example.com',
        appwriteId: 'invalidAppwriteId',
      });

      expect(response).toEqual(errorResponse);
    });

    it('should throw the error if it is an axios error without a response', async () => {
      const axiosError = new Error('Error without response') as AxiosError;
      axiosError.isAxiosError = true;
      axiosError.response = undefined;

      mockedAxios.post.mockRejectedValue(axiosError);

      await expect(
        userAppwriteSignIn({
          email: 'test@example.com',
          appwriteId: 'invalidAppwriteId',
        })
      ).rejects.toThrow('Error without response');
    });

    it('should throw the error if it is not an axios error', async () => {
      jest.spyOn(axios, 'isAxiosError').mockReturnValue(false);

      const nonAxiosError = new Error('Not an axios error');

      mockedAxios.post.mockRejectedValue(nonAxiosError);

      await expect(
        userAppwriteSignIn({
          email: 'test@example.com',
          appwriteId: 'invalidAppwriteId',
        })
      ).rejects.toThrow('Not an axios error');
    });
  });

  // ---------------------------
  // Tests for resendVerification
  // ---------------------------
  describe('resendVerification - Successful responses', () => {
    it('should return data on successful resend verification', async () => {
      const mockResponse: AxiosResponse = {
        data: {
          message: 'The letter has been resent.',
        },
        status: 200,
        statusText: 'OK',
        headers: emptyHeaders,
        config: { headers: emptyHeaders },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);
      const response = await resendVerification('test@example.com');

      expect(response.data).toEqual(mockResponse.data);
    });
  });

  describe('resendVerification - Error handling', () => {
    beforeEach(() => {
      jest
        .spyOn(axios, 'isAxiosError')
        .mockImplementation(
          (err): err is AxiosError =>
            !!err && (err as AxiosError).isAxiosError === true
        );
    });

    it('should return response if the error is an axios error with a response', async () => {
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

      const response = await resendVerification('test@example.com');

      expect(response).toEqual(errorResponse);
    });

    it('should throw the error if it is an axios error without a response', async () => {
      const axiosError = new Error('Error without response') as AxiosError;
      axiosError.isAxiosError = true;
      axiosError.response = undefined;

      mockedAxios.post.mockRejectedValue(axiosError);

      await expect(resendVerification('test@example.com')).rejects.toThrow(
        'Error without response'
      );
    });

    it('should throw the error if it is not an axios error', async () => {
      jest.spyOn(axios, 'isAxiosError').mockReturnValue(false);

      const nonAxiosError = new Error('Not an axios error');

      mockedAxios.post.mockRejectedValue(nonAxiosError);

      await expect(resendVerification('test@example.com')).rejects.toThrow(
        'Not an axios error'
      );
    });
  });
});
