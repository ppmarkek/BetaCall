import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../../../test-utils';
import '@testing-library/jest-dom';
import { StepOne, StepTwo, StepThree } from '@/app/signUp/steps';
import { account } from '@/lib/appwrite';
import { userSignUp, resendVerification } from '@/app/api/auth/route';
import { useSearchParams } from 'next/navigation';

beforeAll(() => {
  window.history.replaceState = jest.fn();
});

interface StepsRootProps {
  children: React.ReactNode;
  onStepChange: (arg: { step: number }) => void;
  step: number;
  [key: string]: unknown;
}

interface StepsContentProps {
  children: React.ReactNode;
  index: number;
  [key: string]: unknown;
}

interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
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
  userSignUp: jest.fn().mockResolvedValue({ status: 201 }),
  resendVerification: jest.fn(),
}));

jest.mock('@chakra-ui/react', () => {
  const actualChakra = jest.requireActual('@chakra-ui/react');
  return {
    ...actualChakra,
    StepsRoot: ({ children, onStepChange, step, ...props }: StepsRootProps) => (
      <div data-testid="steps-root" {...props}>
        {children}
        <button
          data-testid="trigger-step-change"
          onClick={() => onStepChange({ step: step + 1 })}
        >
          Trigger Step Change
        </button>
      </div>
    ),
    StepsContent: ({ children, index, ...props }: StepsContentProps) => (
      <div data-testid={`steps-content-${index}`} {...props}>
        {children}
      </div>
    ),
    Flex: ({ children, ...props }: FlexProps) => (
      <div {...props}>{children}</div>
    ),
    Spinner: () => (
      <div data-testid="spinner" className="chakra-spinner">
        Spinner
      </div>
    ),
  };
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

  beforeEach(() => {
    jest.resetAllMocks();
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams(''));
  });

  it('renders query params over initial props', () => {
    const params = new URLSearchParams();
    params.set('email', 'query@example.com');
    params.set('firstName', 'QueryFirst');
    params.set('lastName', 'QueryLast');
    params.set('terms', 'true');
    params.set('password', btoa('Password123'));
    (useSearchParams as jest.Mock).mockReturnValue(params);
    render(<StepTwo {...defaultProps} />);
    expect(screen.getByDisplayValue('query@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('QueryFirst')).toBeInTheDocument();
    expect(screen.getByDisplayValue('QueryLast')).toBeInTheDocument();
    expect(screen.getAllByDisplayValue('Password123')).toHaveLength(2);
  });

  it('uses initial props when no query params', () => {
    render(<StepTwo {...defaultProps} />);
    expect(screen.getByPlaceholderText('Enter your email')).toHaveValue(
      'step2@example.com'
    );
    expect(screen.getByPlaceholderText('Enter your first name')).toHaveValue(
      'John'
    );
    expect(screen.getByPlaceholderText('Enter your last name')).toHaveValue(
      'Doe'
    );
  });

  it('toggles password visibility', () => {
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

  it('calls nextStep and setEmail on successful submission', async () => {
    (userSignUp as jest.Mock).mockResolvedValueOnce({ status: 201 });
    render(<StepTwo {...defaultProps} />);
    fireEvent.change(screen.getByPlaceholderText('Enter your first name'), {
      target: { value: 'John' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your last name'), {
      target: { value: 'Doe' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'Password123!' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), {
      target: { value: 'Password123!' },
    });

    fireEvent.click(screen.getByTestId('submit-data-testid'));

    await waitFor(() => {
      expect(nextStepMock).toHaveBeenCalled();
      expect(setEmailMock).toHaveBeenCalledWith('step2@example.com');
    });
  });

  it('shows error when email already exists', async () => {
    (userSignUp as jest.Mock).mockResolvedValueOnce({ status: 400 });
    render(<StepTwo {...defaultProps} />);
    fireEvent.change(screen.getByPlaceholderText('Enter your first name'), {
      target: { value: 'John' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your last name'), {
      target: { value: 'Doe' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'Password123!' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), {
      target: { value: 'Password123!' },
    });

    fireEvent.click(screen.getByTestId('submit-data-testid'));

    await waitFor(() => {
      expect(
        screen.getByText(/A user with this email already exists/i)
      ).toBeInTheDocument();
    });
    expect(setLoadingMock).toHaveBeenCalledWith(false);
  });

  it('stops loading and logs error on exception', async () => {
    const testError = new Error('Test error');
    (userSignUp as jest.Mock).mockRejectedValueOnce(testError);
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    render(<StepTwo {...defaultProps} />);
    fireEvent.change(screen.getByPlaceholderText('Enter your first name'), {
      target: { value: 'John' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your last name'), {
      target: { value: 'Doe' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'Password123!' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), {
      target: { value: 'Password123!' },
    });

    fireEvent.click(screen.getByTestId('submit-data-testid'));

    await waitFor(() => {
      expect(setLoadingMock).toHaveBeenCalledWith(false);
      expect(consoleErrorSpy).toHaveBeenCalledWith(testError);
    });
    consoleErrorSpy.mockRestore();
  });

  it('passes empty string for appwriteId if falsy', async () => {
    const props = { ...defaultProps, appwriteId: undefined };
    (userSignUp as jest.Mock).mockResolvedValueOnce({ status: 201 });
    render(<StepTwo {...props} />);
    fireEvent.change(screen.getByPlaceholderText('Enter your first name'), {
      target: { value: 'John' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your last name'), {
      target: { value: 'Doe' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'Password123!' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), {
      target: { value: 'Password123!' },
    });

    fireEvent.click(screen.getByTestId('submit-data-testid'));

    await waitFor(() => {
      expect(userSignUp).toHaveBeenCalled();
    });

    const callArgs = (userSignUp as jest.Mock).mock.calls[0][0];
    expect(callArgs.appwriteId).toBe('');
  });
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
