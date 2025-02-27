import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../../../test-utils';
import '@testing-library/jest-dom';
import RecoverPasswordPage from '@/app/recoverPassword/page';
import { requestResetPassword } from '@/app/api/userData/route';
import { AxiosResponse, AxiosHeaders } from 'axios';

jest.mock('@/app/api/userData/route');

const emptyHeaders = new AxiosHeaders();

describe('Recover Password Page - Loading State', () => {
  it('shows spinner on form submit and hides it after request resolves', async () => {
    let resolveRequest!: (value: AxiosResponse<{ message: string }>) => void;
    const requestPromise = new Promise<AxiosResponse<{ message: string }>>(
      (resolve) => {
        resolveRequest = resolve;
      }
    );

    (requestResetPassword as jest.Mock).mockReturnValue(requestPromise);

    render(<RecoverPasswordPage />);

    const emailInput = screen.getByPlaceholderText('Enter your email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const submitButton = screen.getByRole('button', { name: /recover/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });

    resolveRequest({
      data: { message: 'The letter has been resent' },
      status: 200,
      statusText: 'OK',
      headers: emptyHeaders,
      config: { headers: emptyHeaders },
    });

    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });

    expect(screen.getByText('The letter has been resent')).toBeInTheDocument();
  });

  it('set message when bad request', async () => {
    let resolveRequest!: (value: AxiosResponse<{ message: string }>) => void;
    const requestPromise = new Promise<AxiosResponse<{ message: string }>>(
      (resolve) => {
        resolveRequest = resolve;
      }
    );

    (requestResetPassword as jest.Mock).mockReturnValue(requestPromise);

    render(<RecoverPasswordPage />);

    const emailInput = screen.getByPlaceholderText('Enter your email');
    fireEvent.change(emailInput, { target: { value: 'testFail@example.com' } });

    const submitButton = screen.getByRole('button', { name: /recover/i });
    fireEvent.click(submitButton);

    resolveRequest({
      data: { message: 'User with this email not found' },
      status: 404,
      statusText: 'Not Found',
      headers: emptyHeaders,
      config: { headers: emptyHeaders },
    });

    await waitFor(() => {
      expect(
        screen.getByText('User with this email not found')
      ).toBeInTheDocument();
    });
  });

  it('logs error when request fails', async () => {
    const error = new Error('Test error');
    (requestResetPassword as jest.Mock).mockRejectedValueOnce(error);
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    render(<RecoverPasswordPage />);
    const emailInput = screen.getByPlaceholderText('Enter your email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    const submitButton = screen.getByRole('button', { name: /recover/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(error);
    });

    consoleErrorSpy.mockRestore();
  });
});
