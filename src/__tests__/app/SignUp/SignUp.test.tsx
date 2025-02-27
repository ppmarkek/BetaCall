import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../../../test-utils';
import '@testing-library/jest-dom';
import SignUpPage from '@/app/signUp/page';
import { StepOne, StepTwo, StepThree } from '@/app/signUp/steps';
import { account } from '@/lib/appwrite';
import { userAppwriteSignIn, resendVerification } from '@/app/api/auth/route';
import { useSearchParams, useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

jest.mock('@/lib/appwrite', () => ({
  account: {
    get: jest.fn(),
    createOAuth2Session: jest.fn(),
    deleteSession: jest.fn().mockResolvedValue({}),
  },
}));

jest.mock('@/app/api/auth/route', () => ({
  userAppwriteSignIn: jest.fn(),
  userSignUp: jest.fn(),
  resendVerification: jest.fn(),
}));

describe('SignUpPage', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams(''));
  });

  it('renders StepOne when not loading', () => {
    render(<SignUpPage />);
    expect(screen.getByText(/Welcome to BetaCall/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign Up to get started\./i)).toBeInTheDocument();
  });

  it('shows spinner when loading due to socialMedia param', () => {
    (useSearchParams as jest.Mock).mockReturnValue(
      new URLSearchParams('socialMedia=true')
    );
    (account.get as jest.Mock).mockReturnValue(new Promise(() => {}));
    render(<SignUpPage />);
    const spinner = document.querySelector('.chakra-spinner');
    expect(spinner).toBeInTheDocument();
  });

  it('handles social sign in with status 200', async () => {
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    (useSearchParams as jest.Mock).mockReturnValue(
      new URLSearchParams('socialMedia=true')
    );
    const fakeAccountData = {
      email: 'social@example.com',
      $id: 'abc123',
      name: 'John Doe',
    };
    (account.get as jest.Mock).mockResolvedValue(fakeAccountData);
    (userAppwriteSignIn as jest.Mock).mockResolvedValue({
      status: 200,
      data: { accessToken: 'access', refreshToken: 'refresh' },
    });
    render(<SignUpPage />);
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/');
    });
  });
});

describe('SignUpPage - Social media sign-in error handling', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (useSearchParams as jest.Mock).mockReturnValue(
      new URLSearchParams('socialMedia=true')
    );
  });

  it('redirects to verify page when response.status is 403', async () => {
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    const fakeAccountData = {
      email: 'social@example.com',
      $id: 'abc123',
      name: 'John Doe',
    };
    (account.get as jest.Mock).mockResolvedValue(fakeAccountData);
    (userAppwriteSignIn as jest.Mock).mockResolvedValue({
      status: 403,
      data: {},
    });

    render(<SignUpPage />);
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith(`/verify/${fakeAccountData.email}`);
    });
  });

  it('advances to StepTwo when response.status is 404', async () => {
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
    const fakeAccountData = {
      email: 'social@example.com',
      $id: 'abc123',
      name: 'John Doe',
    };
    (account.get as jest.Mock).mockResolvedValue(fakeAccountData);
    (userAppwriteSignIn as jest.Mock).mockResolvedValue({
      status: 404,
      data: {},
    });

    render(<SignUpPage />);
    await waitFor(() => {
      expect(
        screen.getByDisplayValue('social@example.com')
      ).toBeInTheDocument();
      expect(screen.getByDisplayValue('John')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
    });
  });

  it('logs error and stops loading when account.get() fails with an error not including "missing scope"', async () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
    (account.get as jest.Mock).mockRejectedValue(new Error('Test error'));

    render(<SignUpPage />);
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error fetching google account data:',
        expect.any(Error)
      );
      expect(screen.queryByTestId('chakra-spinner')).not.toBeInTheDocument();
    });
    consoleErrorSpy.mockRestore();
  });

  it('stops loading when account.get() fails with a "missing scope" error', async () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
    const missingScopeError = new Error(
      'missing scope: some permission is missing'
    );
    (account.get as jest.Mock).mockRejectedValue(missingScopeError);

    render(<SignUpPage />);
    await waitFor(() => {
      expect(document.querySelector('.chakra-spinner')).not.toBeInTheDocument();
    });
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  it('calls account.deleteSession when beforeunload is triggered', () => {
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams(''));
    (account.get as jest.Mock).mockResolvedValue(null);
    (account.deleteSession as jest.Mock).mockResolvedValue({});

    render(<SignUpPage />);
    const event = new Event('beforeunload');
    window.dispatchEvent(event);
    expect(account.deleteSession).toHaveBeenCalledWith('current');
  });

  it('logs error when account.deleteSession fails', async () => {
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams(''));
    (account.get as jest.Mock).mockResolvedValue(null);
    const deletionError = new Error('Deletion error');
    (account.deleteSession as jest.Mock).mockRejectedValueOnce(deletionError);
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    render(<SignUpPage />);
    const event = new Event('beforeunload');
    window.dispatchEvent(event);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error deleting session on page unload:',
        deletionError
      );
    });
    consoleErrorSpy.mockRestore();
  });
});

describe('StepOne', () => {
  const nextStepMock = jest.fn();
  const setLoadingMock = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams(''));
  });

  it('submits form with email and terms checked', async () => {
    render(<StepOne nextStep={nextStepMock} setLoading={setLoadingMock} />);
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const checkbox = screen.getByRole('checkbox');
    const submitButton = screen.getByRole('button', { name: /^Sign Up$/i });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.blur(emailInput);
    fireEvent.click(checkbox);
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(nextStepMock).toHaveBeenCalledWith({
        email: 'test@example.com',
        terms: true,
      });
    });
  });

  it('calls createOAuth2Session on Google login click', () => {
    render(<StepOne nextStep={nextStepMock} setLoading={setLoadingMock} />);
    const googleButton = screen.getByRole('button', {
      name: /Sign Up with Google/i,
    });
    fireEvent.click(googleButton);
    expect(setLoadingMock).toHaveBeenCalledWith(true);
    expect(account.createOAuth2Session).toHaveBeenCalledWith(
      expect.any(String),
      'http://localhost:3000/signUp?socialMedia=true',
      'http://localhost:3000/signUp?socialMedia=false'
    );
  });

  it('calls createOAuth2Session on GitHub login click', () => {
    render(<StepOne nextStep={nextStepMock} setLoading={setLoadingMock} />);
    const githubButton = screen.getByRole('button', {
      name: /Sign Up with GitHub/i,
    });
    fireEvent.click(githubButton);
    expect(setLoadingMock).toHaveBeenCalledWith(true);
    expect(account.createOAuth2Session).toHaveBeenCalledWith(
      expect.any(String),
      'http://localhost:3000/signUp?socialMedia=true',
      'http://localhost:3000/signUp?socialMedia=false'
    );
  });
});

describe('StepTwo', () => {
  const setLoadingMock = jest.fn();
  const setEmailMock = jest.fn();
  const nextStepMock = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams(''));
  });

  const defaultProps = {
    email: 'step2@example.com',
    appwriteId: '123',
    firstName: 'John',
    lastName: 'Doe',
    terms: true,
    setLoading: setLoadingMock,
    setEmail: setEmailMock,
    nextStep: nextStepMock,
  };

  it('renders default values from query params and initial props', () => {
    const params = new URLSearchParams();
    params.set('email', 'query@example.com');
    params.set('firstName', 'Query');
    params.set('lastName', 'User');
    params.set('terms', 'true');
    params.set('password', btoa('Password123'));
    (useSearchParams as jest.Mock).mockReturnValue(params);
    render(<StepTwo {...defaultProps} />);
    expect(screen.getByDisplayValue('query@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Query')).toBeInTheDocument();
    expect(screen.getByDisplayValue('User')).toBeInTheDocument();
    expect(screen.getAllByDisplayValue('Password123')).toHaveLength(2);
  });

  it('toggles password visibility for password and confirm password fields', () => {
    render(<StepTwo {...defaultProps} />);

    const passwordInput = screen.getByPlaceholderText(
      'Enter your password'
    ) as HTMLInputElement;
    const confirmPasswordInput = screen.getByPlaceholderText(
      'Confirm your password'
    ) as HTMLInputElement;

    const passwordToggleIcon = screen.getByTestId('password-toggle-icon');
    const confirmPasswordToggleIcon = screen.getByTestId(
      'confirm-password-toggle-icon'
    );

    expect(passwordInput.type).toBe('password');
    expect(confirmPasswordInput.type).toBe('password');

    fireEvent.click(passwordToggleIcon);
    fireEvent.click(confirmPasswordToggleIcon);

    expect(passwordInput.type).toBe('text');
    expect(confirmPasswordInput.type).toBe('text');
  });

  describe('StepThree', () => {
    it('renders confirmation message and handles resend email click', () => {
      render(<StepThree email="confirm@example.com" />);
      expect(
        screen.getByText(/We sent an email to confirm@example.com/i)
      ).toBeInTheDocument();
      const resendLink = screen.getByText(/Resend Email/i);
      fireEvent.click(resendLink);
      expect(resendVerification).toHaveBeenCalledWith('confirm@example.com');
    });
  });
});
