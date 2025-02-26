import axios, { AxiosResponse } from 'axios';
import {
  userSignIn,
  userGoogleSignIn,
  resendVerification,
  userSignUp,
} from '../../../app/api/auth/route';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Auth API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('userSignIn', () => {
    it('should return data on successful sign in', async () => {
      const mockResponse: AxiosResponse = {
        data: {
          accessToken: 'fakeAccessToken',
          message: 'Authentication successful',
          refreshToken: 'fakeRefreshToken',
          user: {
            _id: '1',
            createdAt: '2020-01-01T00:00:00Z',
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            role: 'user',
            updatedAt: '2020-01-01T00:00:00Z',
            __v: 0,
          },
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: {} },
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);
      const response = await userSignIn({
        email: 'test@example.com',
        password: '123456',
      });
      // Use a type assertion for response.data
      const data = response.data as {
        accessToken: string;
        message: string;
        refreshToken: string;
        user: {
          _id: string;
          createdAt: string;
          email: string;
          firstName: string;
          lastName: string;
          role: string;
          updatedAt: string;
          __v: number;
        };
      };

      expect(data.accessToken).toBe('fakeAccessToken');
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://betacall-backend.onrender.com/api/users/login',
        { email: 'test@example.com', password: '123456' }
      );
    });

    it('should return an error response on failed sign in', async () => {
      const errorResponse: AxiosResponse = {
        data: { message: 'User not found' },
        status: 404,
        statusText: 'Not Found',
        headers: {},
        config: { headers: {} },
      };

      // Simulate an axios error
      mockedAxios.post.mockRejectedValueOnce({
        response: errorResponse,
        isAxiosError: true,
      });
      const response = await userSignIn({
        email: 'nonexistent@example.com',
        password: 'wrongpass',
      });
      // Use a type assertion for response.data as well
      const data = response.data as { message: string };
      expect(data.message).toBe('User not found');
    });
  });

  describe('userGoogleSignIn', () => {
    it('should return data on successful Google sign in', async () => {
      const mockResponse: AxiosResponse = {
        data: {
          accessToken: 'googleAccessToken',
          message: 'Authentication successful',
          refreshToken: 'googleRefreshToken',
          user: {
            _id: '2',
            createdAt: '2020-02-01T00:00:00Z',
            email: 'google@example.com',
            firstName: 'Google',
            lastName: 'User',
            role: 'user',
            updatedAt: '2020-02-01T00:00:00Z',
            __v: 0,
          },
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: {} },
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);
      const response = await userGoogleSignIn({
        email: 'google@example.com',
        appwriteId: 'google-appwrite-id',
      });
      const data = response.data as {
        accessToken: string;
        message: string;
        refreshToken: string;
        user: {
          _id: string;
          createdAt: string;
          email: string;
          firstName: string;
          lastName: string;
          role: string;
          updatedAt: string;
          __v: number;
        };
      };

      expect(data.accessToken).toBe('googleAccessToken');
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://betacall-backend.onrender.com/api/users/login/appwrite',
        { email: 'google@example.com', appwriteId: 'google-appwrite-id' }
      );
    });
  });

  describe('resendVerification', () => {
    it('should return a success response', async () => {
      const mockResponse: AxiosResponse = {
        data: { message: 'Verification email resent' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: {} },
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);
      const response = await resendVerification('test@example.com');
      const data = response.data as { message: string };

      expect(data.message).toBe('Verification email resent');
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://betacall-backend.onrender.com/api/users/resend-verification',
        { email: 'test@example.com' }
      );
    });
  });

  describe('userSignUp', () => {
    it('should return a success response on sign up', async () => {
      const mockResponse: AxiosResponse = {
        data: { message: 'User created, verify email sent.' },
        status: 201,
        statusText: 'Created',
        headers: {},
        config: { headers: {} },
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);
      const response = await userSignUp({
        email: 'newuser@example.com',
        firstName: 'New',
        lastName: 'User',
        password: 'password123',
        terms: true,
      });
      const data = response.data as { message: string };

      expect(data.message).toBe('User created, verify email sent.');
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://betacall-backend.onrender.com/api/users/register',
        {
          email: 'newuser@example.com',
          firstName: 'New',
          lastName: 'User',
          password: 'password123',
          appwriteId: undefined,
          terms: true,
        }
      );
    });
  });
});
