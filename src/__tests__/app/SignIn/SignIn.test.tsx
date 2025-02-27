jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(() => new URLSearchParams('')),
  useRouter: jest.fn(() => ({ push: jest.fn() })),
}));

jest.mock('@/app/api/auth/route', () => ({
  userSignIn: jest.fn(),
  userAppwriteSignIn: jest.fn(),
}));

jest.mock('@/lib/appwrite', () => ({
  account: {
    createOAuth2Session: jest.fn(),
    get: jest.fn(),
  },
}));

import React from 'react';
import { fireEvent, render, screen, waitFor } from '../../../../test-utils';
import '@testing-library/jest-dom';
import SignInPage from '@/app/signIn/page';
import { AxiosHeaders, AxiosResponse } from 'axios';
import { userSignIn, userAppwriteSignIn } from '@/app/api/auth/route';
import { account } from '@/lib/appwrite';
import { OAuthProvider } from 'appwrite';
import { useRouter, useSearchParams } from 'next/navigation';

const emptyHeaders = new AxiosHeaders();

describe('Sign In Page', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams(''));
  });

  it('matches the snapshot', () => {
    const { container } = render(<SignInPage />);
    expect(container).toMatchSnapshot();
  });

  it('shows spinner on form submit and hides it after request resolves', async () => {
    let resolveRequest!: (value: AxiosResponse<{ message: string }>) => void;
    const requestPromise = new Promise<AxiosResponse<{ message: string }>>(
      (resolve) => {
        resolveRequest = resolve;
      }
    );
    (userSignIn as jest.Mock).mockReturnValue(requestPromise);

    render(<SignInPage />);

    const emailInput = screen.getByPlaceholderText('Enter your email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const passwordInput = screen.getByPlaceholderText('Enter your password');
    fireEvent.change(passwordInput, { target: { value: '{S[6O$}V56v^' } });

    const submitButton = screen.getByTestId('button-submit');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });

    resolveRequest({
      data: { message: 'Authentication successful' },
      status: 200,
      statusText: 'OK',
      headers: emptyHeaders,
      config: { headers: emptyHeaders },
    });

    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });
  });

  it('sets error message when bad request with status 403', async () => {
    let resolveRequest!: (value: AxiosResponse<{ message: string }>) => void;
    const requestPromise = new Promise<AxiosResponse<{ message: string }>>(
      (resolve) => {
        resolveRequest = resolve;
      }
    );
    (userSignIn as jest.Mock).mockReturnValue(requestPromise);

    render(<SignInPage />);

    const emailInput = screen.getByPlaceholderText('Enter your email');
    fireEvent.change(emailInput, { target: { value: 'testFail@example.com' } });

    const passwordInput = screen.getByPlaceholderText('Enter your password');
    fireEvent.change(passwordInput, { target: { value: '{S[6O$}V56v^' } });

    const submitButton = screen.getByTestId('button-submit');
    fireEvent.click(submitButton);

    resolveRequest({
      data: { message: 'Invalid or expired password reset token' },
      status: 403,
      statusText: 'Forbidden',
      headers: emptyHeaders,
      config: { headers: emptyHeaders },
    });
  });

  it('sets error message when bad request with status 401', async () => {
    let resolveRequest!: (value: AxiosResponse<{ message: string }>) => void;
    const requestPromise = new Promise<AxiosResponse<{ message: string }>>(
      (resolve) => {
        resolveRequest = resolve;
      }
    );
    (userSignIn as jest.Mock).mockReturnValue(requestPromise);

    render(<SignInPage />);

    const emailInput = screen.getByPlaceholderText('Enter your email');
    fireEvent.change(emailInput, { target: { value: 'testFail@example.com' } });

    const passwordInput = screen.getByPlaceholderText('Enter your password');
    fireEvent.change(passwordInput, { target: { value: '{S[6O$}V56v^' } });

    const submitButton = screen.getByTestId('button-submit');
    fireEvent.click(submitButton);

    resolveRequest({
      data: { message: 'Invalid credentials' },
      status: 401,
      statusText: 'Unauthorized',
      headers: emptyHeaders,
      config: { headers: emptyHeaders },
    });

    await waitFor(() => {
      expect(
        screen.getByText('Incorrect email or password')
      ).toBeInTheDocument();
    });
  });

  describe('OAuth2 session creation', () => {
    it('calls createOAuth2Session for Google login', () => {
      (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams(''));
      render(<SignInPage />);
      const googleButton = screen.getByText('Sign In with Google');
      fireEvent.click(googleButton);
      expect(account.createOAuth2Session).toHaveBeenCalledWith(
        OAuthProvider.Google,
        'http://localhost:3000/signIn?socialMedia=true',
        'http://localhost:3000/signIn?socialMedia=false'
      );
    });

    it('calls createOAuth2Session for GitHub login', () => {
      (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams(''));
      render(<SignInPage />);
      const githubButton = screen.getByText('Sign Up with GitHub');
      fireEvent.click(githubButton);
      expect(account.createOAuth2Session).toHaveBeenCalledWith(
        OAuthProvider.Github,
        'http://localhost:3000/signIn?socialMedia=true',
        'http://localhost:3000/signIn?socialMedia=false'
      );
    });
  });

  describe('Social media sign-in useEffect', () => {
    it('handles social sign-in with status 200', async () => {
      const pushMock = jest.fn();
      (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
      const searchParams = new URLSearchParams('socialMedia=true&other=1');
      (useSearchParams as jest.Mock).mockReturnValue(searchParams);

      const userData = {
        email: 'user@example.com',
        $id: '123',
        name: 'John Doe',
      };
      (account.get as jest.Mock).mockResolvedValue(userData);
      (userAppwriteSignIn as jest.Mock).mockResolvedValue({
        status: 200,
        data: { accessToken: 'access', refreshToken: 'refresh' },
      });
      const replaceStateSpy = jest
        .spyOn(window.history, 'replaceState')
        .mockImplementation(() => {});

      render(<SignInPage />);
      await waitFor(() => {
        expect(pushMock).toHaveBeenCalledWith('/');
      });
      expect(replaceStateSpy).toHaveBeenCalledWith(null, '', '?other=1');
      replaceStateSpy.mockRestore();
    });

    it('handles social sign-in with status 403', async () => {
      const pushMock = jest.fn();
      (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
      const searchParams = new URLSearchParams('socialMedia=true');
      (useSearchParams as jest.Mock).mockReturnValue(searchParams);

      const userData = {
        email: 'user@example.com',
        $id: '123',
        name: 'John Doe',
      };
      (account.get as jest.Mock).mockResolvedValue(userData);
      (userAppwriteSignIn as jest.Mock).mockResolvedValue({
        status: 403,
        data: {},
      });

      render(<SignInPage />);
      await waitFor(() => {
        expect(pushMock).toHaveBeenCalledWith(`/verify/${userData.email}`);
      });
    });

    it('handles social sign-in with status 404', async () => {
      const pushMock = jest.fn();
      (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
      const searchParams = new URLSearchParams('socialMedia=true');
      (useSearchParams as jest.Mock).mockReturnValue(searchParams);

      const userData = {
        email: 'user@example.com',
        $id: '123',
        name: 'John Doe',
      };
      (account.get as jest.Mock).mockResolvedValue(userData);
      (userAppwriteSignIn as jest.Mock).mockResolvedValue({
        status: 404,
        data: {},
      });

      render(<SignInPage />);
      await waitFor(() => {
        expect(pushMock).toHaveBeenCalledWith(
          `/signUp?socialMedia=true&step=2&email=${encodeURIComponent(
            userData.email
          )}&appwriteId=${encodeURIComponent(userData.$id)}&firstName=${encodeURIComponent(
            'John'
          )}&lastName=${encodeURIComponent('Doe')}`
        );
      });
    });

    it('check new password visibility', () => {
      render(<SignInPage />);
      const passwordInput = screen.getByPlaceholderText(
        'Enter your password'
      ) as HTMLInputElement;

      expect(passwordInput.type).toBe('password');

      const icons = screen.getAllByTestId('icon-textInput');
      const newPasswordToggleIcon = icons[1];
      fireEvent.click(newPasswordToggleIcon);

      expect(passwordInput.type).toBe('text');
    });

    it('logs error when account.get() fails with an error not including "missing scope"', async () => {
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const pushMock = jest.fn();
      (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
      const searchParams = new URLSearchParams('socialMedia=true');
      (useSearchParams as jest.Mock).mockReturnValue(searchParams);

      const error = new Error('Test error');
      (account.get as jest.Mock).mockRejectedValue(error);

      render(<SignInPage />);
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Error fetching google account data:',
          error
        );
      });
      consoleErrorSpy.mockRestore();
    });
  });
});
