import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../../../test-utils';
import '@testing-library/jest-dom';
import axios from 'axios';
import { resendVerification } from '@/app/api/auth/route';
import VerifyToken from 'src/app/verify/token/[token]/page';
import VerifyEmail, { handleResendVerification } from 'src/app/verify/[email]/page';
import { useParams, useSearchParams } from 'next/navigation';

const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock('axios');
jest.mock('@/app/api/auth/route', () => ({
  resendVerification: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
  useSearchParams: jest.fn(),
}));

describe('handleResendVerification function', () => {
  const setBeenVerified = jest.fn();
  const setLoading = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call resendVerification with the first element if emailToVerify is an array', async () => {
    const emailArray = ['test@example.com'];
    (resendVerification as jest.Mock).mockResolvedValueOnce({ status: 400 });

    await handleResendVerification(emailArray, setBeenVerified, setLoading);

    expect(resendVerification).toHaveBeenCalledWith('test@example.com');
    expect(setBeenVerified).toHaveBeenCalledWith(true);
    expect(setLoading).toHaveBeenCalledWith(false);
  });

  it('should call resendVerification with the email string if emailToVerify is a string', async () => {
    const emailString = 'test@example.com';
    (resendVerification as jest.Mock).mockResolvedValueOnce({ status: 400 });

    await handleResendVerification(emailString, setBeenVerified, setLoading);

    expect(resendVerification).toHaveBeenCalledWith('test@example.com');
    expect(setBeenVerified).toHaveBeenCalledWith(true);
    expect(setLoading).toHaveBeenCalledWith(false);
  });
});

describe('VerifyToken Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display spinner while loading', () => {
    mockedAxios.get.mockImplementation(() => new Promise(() => {}));
    (useParams as jest.Mock).mockReturnValue({ token: 'dummy-token' });
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue('test@example.com'),
    });
    const { container } = render(<VerifyToken />);
    expect(container.querySelector('.chakra-spinner')).toBeInTheDocument();
  });

  it('should display success message and Sign In link when account is verified', async () => {
    const successMessage = 'Account verified successfully';
    mockedAxios.get.mockResolvedValueOnce({
      data: { message: successMessage },
    });
    (useParams as jest.Mock).mockReturnValue({ token: 'dummy-token' });
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue('test@example.com'),
    });
    const { container } = render(<VerifyToken />);
    await waitFor(() =>
      expect(container.querySelector('.chakra-spinner')).not.toBeInTheDocument()
    );
    expect(screen.getByText(successMessage)).toBeInTheDocument();
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  });

  it('should display error message with Resend Email link for an expired/invalid token', async () => {
    const errorMessage = 'The link is invalid or expired';
    mockedAxios.get.mockRejectedValueOnce({
      response: { data: { message: errorMessage } },
    });
    (useParams as jest.Mock).mockReturnValue({ token: 'dummy-token' });
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue('test@example.com'),
    });
    const { container } = render(<VerifyToken />);
    await waitFor(() =>
      expect(container.querySelector('.chakra-spinner')).not.toBeInTheDocument()
    );
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    const resendLink = screen.getByText(/resend email/i);
    expect(resendLink).toBeInTheDocument();
    (resendVerification as jest.Mock).mockResolvedValueOnce({ status: 400 });
    fireEvent.click(resendLink);
    await waitFor(() => {
      expect(resendVerification).toHaveBeenCalledWith('test@example.com');
    });
  });

  it('should display Sign In link when account has already been verified', async () => {
    const errorMessage = 'The account has already been verified';
    mockedAxios.get.mockRejectedValueOnce({
      response: { data: { message: errorMessage } },
    });
    (useParams as jest.Mock).mockReturnValue({ token: 'dummy-token' });
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue('test@example.com'),
    });
    const { container } = render(<VerifyToken />);
    await waitFor(() =>
      expect(container.querySelector('.chakra-spinner')).not.toBeInTheDocument()
    );
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  });

  it('should not call axios and remain in loading state if token is missing', async () => {
    (useParams as jest.Mock).mockReturnValue({ token: undefined });
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue('test@example.com'),
    });
    const { container } = render(<VerifyToken />);
    expect(container.querySelector('.chakra-spinner')).toBeInTheDocument();
    expect(mockedAxios.get).not.toHaveBeenCalled();
  });

  it('should display "Account verified successfully" after a successful resend action', async () => {
    const errorMessage = 'The link is invalid or expired';
    mockedAxios.get.mockRejectedValueOnce({
      response: { data: { message: errorMessage } },
    });
    (useParams as jest.Mock).mockReturnValue({ token: 'dummy-token' });
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue('test@example.com'),
    });
    const { container } = render(<VerifyToken />);
    await waitFor(() =>
      expect(container.querySelector('.chakra-spinner')).toBeNull()
    );
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    (resendVerification as jest.Mock).mockResolvedValueOnce({ status: 400 });
    fireEvent.click(screen.getByText(/resend email/i));
    await waitFor(() => {
      expect(
        screen.getByText(/account verified successfully/i)
      ).toBeInTheDocument();
    });
  });

  it('should call console.error when resendVerification throws an error', async () => {
    const errorObj = { response: { data: { message: 'Test error' } } };
    (mockedAxios.get as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: 'The link is invalid or expired' } },
    });
    (useParams as jest.Mock).mockReturnValue({ token: 'dummy-token' });
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue('test@example.com'),
    });
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const { container } = render(<VerifyToken />);
    await waitFor(() =>
      expect(container.querySelector('.chakra-spinner')).not.toBeInTheDocument()
    );
    expect(
      screen.getByText('The link is invalid or expired')
    ).toBeInTheDocument();
    (resendVerification as jest.Mock).mockRejectedValueOnce(errorObj);
    const resendLink = screen.getByText(/resend email/i);
    fireEvent.click(resendLink);
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(errorObj);
    });
    consoleErrorSpy.mockRestore();
  });
});

describe('VerifyEmail Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display success message and Sign In link when account is verified via resend', async () => {
    (useParams as jest.Mock).mockReturnValue({
      email: encodeURIComponent('test@example.com'),
    });
    (resendVerification as jest.Mock).mockResolvedValueOnce({ status: 400 });
    const { container } = render(<VerifyEmail />);
    await waitFor(() =>
      expect(container.querySelector('.chakra-spinner')).not.toBeInTheDocument()
    );
    expect(
      screen.getByText(/account verified successfully/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  });

  it('should display confirmation message and Resend Email link when account is not verified', async () => {
    (useParams as jest.Mock).mockReturnValue({
      email: encodeURIComponent('test@example.com'),
    });
    (resendVerification as jest.Mock).mockResolvedValueOnce({ status: 200 });
    const { container } = render(<VerifyEmail />);
    await waitFor(() =>
      expect(container.querySelector('.chakra-spinner')).not.toBeInTheDocument()
    );
    expect(
      screen.getByText((content) =>
        content.includes('We have sent a confirmation email to your address')
      )
    ).toBeInTheDocument();
    const allResendElements = screen.getAllByText(/resend email/i);
    const resendLink = allResendElements.find(
      (el) => el.tagName.toLowerCase() === 'a'
    );
    expect(resendLink).toBeDefined();
    (resendVerification as jest.Mock).mockResolvedValueOnce({ status: 400 });
    if (resendLink) {
      fireEvent.click(resendLink);
    }
    await waitFor(() => {
      expect(resendVerification).toHaveBeenCalledWith('test@example.com');
    });
  });

  it('should call console.error when resendVerification throws an error', async () => {
    const errorObj = { response: { data: { message: 'Test error' } } };
    (useParams as jest.Mock).mockReturnValue({
      email: encodeURIComponent('test@example.com'),
    });
    (resendVerification as jest.Mock).mockRejectedValueOnce(errorObj);
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const { container } = render(<VerifyEmail />);
    await waitFor(() =>
      expect(container.querySelector('.chakra-spinner')).not.toBeInTheDocument()
    );
    const allResendElements = screen.getAllByText(/resend email/i);
    const resendLink = allResendElements.find(
      (el) => el.tagName.toLowerCase() === 'a'
    );
    if (resendLink) {
      fireEvent.click(resendLink);
    }
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(errorObj);
    });
    consoleErrorSpy.mockRestore();
  });

  it('should set download to false if email address is missing', async () => {
    (useParams as jest.Mock).mockReturnValue({ email: undefined });
    render(<VerifyEmail />);

    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).toBeNull();
    });

    expect(
      screen.getByText(/we have sent a confirmation email to your address/i)
    ).toBeInTheDocument();
  });
});
