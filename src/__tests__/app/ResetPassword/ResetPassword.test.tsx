import React from 'react';
import { fireEvent, render, screen, waitFor } from '../../../../test-utils';
import '@testing-library/jest-dom';
import ResetPasswordPage from '@/app/resetPassword/[token]/page';
import { tokenResetPassword } from '@/app/api/userData/route';
import { AxiosResponse, AxiosHeaders } from 'axios';
import * as nextNavigation from 'next/navigation';

jest.mock('@/app/api/userData/route');

jest.mock('next/navigation', () => ({
  useParams: jest.fn(() => ({ token: 'test-token' })),
}));

const emptyHeaders = new AxiosHeaders();

describe('Reset Password Page', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the reset password page', () => {
    render(<ResetPasswordPage />);
    expect(screen.getByTestId('ResetPasswordPage-testid')).toBeInTheDocument();
  });

  it('check new password visibility', () => {
    render(<ResetPasswordPage />);
    const newPasswordInput = screen.getByPlaceholderText(
      'Enter your new password'
    ) as HTMLInputElement;

    expect(newPasswordInput.type).toBe('password');

    const icons = screen.getAllByTestId('icon-textInput');
    const newPasswordToggleIcon = icons[0];
    fireEvent.click(newPasswordToggleIcon);

    expect(newPasswordInput.type).toBe('text');
  });

  it('check confirm new password visibility', () => {
    render(<ResetPasswordPage />);
    const confirmPasswordInput = screen.getByPlaceholderText(
      'Confirm your new password'
    ) as HTMLInputElement;

    expect(confirmPasswordInput.type).toBe('password');

    const icons = screen.getAllByTestId('icon-textInput');
    const confirmPasswordToggleIcon = icons[1];
    fireEvent.click(confirmPasswordToggleIcon);

    expect(confirmPasswordInput.type).toBe('text');
  });

  it('shows spinner on form submit and hides it after request resolves', async () => {
    let resolveRequest!: (value: AxiosResponse<{ message: string }>) => void;
    const requestPromise = new Promise<AxiosResponse<{ message: string }>>(
      (resolve) => {
        resolveRequest = resolve;
      }
    );

    (tokenResetPassword as jest.Mock).mockReturnValue(requestPromise);

    render(<ResetPasswordPage />);

    const newPasswordInput = screen.getByPlaceholderText(
      'Enter your new password'
    );
    fireEvent.change(newPasswordInput, {
      target: { value: '{S[6O$}V56v^' },
    });

    const newConfirmPasswordInput = screen.getByPlaceholderText(
      'Confirm your new password'
    );
    fireEvent.change(newConfirmPasswordInput, {
      target: { value: '{S[6O$}V56v^' },
    });

    const submitButton = screen.getByTestId('button-submit');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });

    resolveRequest({
      data: { message: 'Password updated successfully' },
      status: 200,
      statusText: 'OK',
      headers: emptyHeaders,
      config: { headers: emptyHeaders },
    });

    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });

    expect(
      screen.getByText('Password updated successfully')
    ).toBeInTheDocument();
  });

  it('set message when bad request', async () => {
    let resolveRequest!: (value: AxiosResponse<{ message: string }>) => void;
    const requestPromise = new Promise<AxiosResponse<{ message: string }>>(
      (resolve) => {
        resolveRequest = resolve;
      }
    );

    (tokenResetPassword as jest.Mock).mockReturnValue(requestPromise);

    render(<ResetPasswordPage />);

    const newPasswordInput = screen.getByPlaceholderText(
      'Enter your new password'
    );
    fireEvent.change(newPasswordInput, {
      target: { value: '{S[6O$}V56v^' },
    });

    const newConfirmPasswordInput = screen.getByPlaceholderText(
      'Confirm your new password'
    );
    fireEvent.change(newConfirmPasswordInput, {
      target: { value: '{S[6O$}V56v^' },
    });

    const submitButton = screen.getByTestId('button-submit');
    fireEvent.click(submitButton);

    resolveRequest({
      data: { message: 'Invalid or expired password reset token' },
      status: 400,
      statusText: 'Not Found',
      headers: emptyHeaders,
      config: { headers: emptyHeaders },
    });

    await waitFor(() => {
      expect(
        screen.getByText('Invalid or expired password reset token')
      ).toBeInTheDocument();
    });
  });

  it('calls console.error with "Token is missing" error when token is missing', async () => {
    const useParamsMock = jest
      .spyOn(nextNavigation, 'useParams')
      .mockReturnValue({ token: undefined } as { token?: string });

    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    render(<ResetPasswordPage />);

    const validPassword = '{S[6O$}V56v^';
    const newPasswordInput = screen.getByPlaceholderText(
      'Enter your new password'
    );
    fireEvent.change(newPasswordInput, { target: { value: validPassword } });

    const confirmPasswordInput = screen.getByPlaceholderText(
      'Confirm your new password'
    );
    fireEvent.change(confirmPasswordInput, {
      target: { value: validPassword },
    });

    const submitButton = screen.getByTestId('button-submit');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    const errorLogged = consoleErrorSpy.mock.calls[0][0];
    expect(errorLogged).toBeInstanceOf(Error);
    expect(errorLogged.message).toEqual('Token is missing');

    useParamsMock.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('matches the snapshot', () => {
    (nextNavigation.useParams as jest.Mock).mockReturnValue({
      token: 'test-token',
    });
    const { container } = render(<ResetPasswordPage />);
    expect(container).toMatchSnapshot();
  });
});
