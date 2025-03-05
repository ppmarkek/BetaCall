import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from '../../../../test-utils';
import '@testing-library/jest-dom';
import SignUpPage from '@/app/signUp/page';
import { account } from '@/lib/appwrite';
import { userAppwriteSignIn } from '@/app/api/auth/route';
import { useSearchParams, useRouter } from 'next/navigation';
import { getSignUpCallbacks } from '@/app/signUp/signUpCallbacks';

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
  useSearchParams: jest.fn(() => new URLSearchParams('')),
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
    expect(document.querySelector('.chakra-spinner')).toBeInTheDocument();
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

describe('SignUpPage - handleStepTwoNext & handleSetEmail', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams(''));
  });

  it('advances to StepThree and retains the provided email after StepTwo submission', async () => {
    render(<SignUpPage />);

    const stepOneContainer = screen.getByTestId('steps-content-0');
    const emailInput =
      within(stepOneContainer).getByPlaceholderText('Enter your email');
    const checkbox = within(stepOneContainer).getByRole('checkbox');
    const signUpButton = within(stepOneContainer).getByRole('button', {
      name: /^Sign Up$/i,
    });

    fireEvent.change(emailInput, { target: { value: 'testuser@example.com' } });
    fireEvent.blur(emailInput);
    fireEvent.click(checkbox);
    fireEvent.click(signUpButton);

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText('Enter your password')
      ).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText('Enter your first name'), {
      target: { value: 'Alice' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your last name'), {
      target: { value: 'Wonderland' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'Password123!' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), {
      target: { value: 'Password123!' },
    });

    fireEvent.click(screen.getByTestId('submit-data-testid'));

    await waitFor(() => {
      expect(screen.getByText(/Thank you/i)).toBeInTheDocument();
      expect(
        screen.getByText(/We sent an email to testuser@example.com/i)
      ).toBeInTheDocument();
    });
  });
});

describe('getSignUpCallbacks', () => {
  it('handleStepTwoNext should call setStep with 2', () => {
    const setStepMock = jest.fn();
    const setEmailMock = jest.fn();
    const { handleStepTwoNext } = getSignUpCallbacks(setStepMock, setEmailMock);

    handleStepTwoNext();

    expect(setStepMock).toHaveBeenCalledWith(2);
  });

  it('handleSetEmail should call setEmail with provided email', () => {
    const setStepMock = jest.fn();
    const setEmailMock = jest.fn();
    const { handleSetEmail } = getSignUpCallbacks(setStepMock, setEmailMock);
    const testEmail = 'test@example.com';

    handleSetEmail(testEmail);

    expect(setEmailMock).toHaveBeenCalledWith(testEmail);
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
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
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

describe('SignUpPage - Navigation & Callbacks', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams(''));
  });

  const getVisibleEmailInput = (): HTMLInputElement | undefined => {
    const inputs = screen.getAllByPlaceholderText(
      'Enter your email'
    ) as HTMLInputElement[];
    return inputs.find(
      (input) => window.getComputedStyle(input).display !== 'none'
    );
  };

  it('progresses from StepOne to StepTwo on valid submission', async () => {
    render(<SignUpPage />);
    expect(screen.getByText(/Welcome to BetaCall/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign Up to get started\./i)).toBeInTheDocument();

    const emailInput = getVisibleEmailInput();
    const checkbox = screen.getAllByRole('checkbox')[0];
    const signUpButton = screen.getByRole('button', { name: /^Sign Up$/i });

    fireEvent.change(emailInput!, {
      target: { value: 'testuser@example.com' },
    });
    fireEvent.blur(emailInput!);
    fireEvent.click(checkbox);
    fireEvent.click(signUpButton);

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText('Enter your password')
      ).toBeInTheDocument();
    });
  });

  it('progresses from StepTwo to StepThree on valid submission', async () => {
    render(<SignUpPage />);

    const emailInput = getVisibleEmailInput();
    const checkbox = screen.getAllByRole('checkbox')[0];
    const signUpButton = screen.getByRole('button', { name: /^Sign Up$/i });

    fireEvent.change(emailInput!, {
      target: { value: 'testuser@example.com' },
    });
    fireEvent.blur(emailInput!);
    fireEvent.click(checkbox);
    fireEvent.click(signUpButton);

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText('Enter your password')
      ).toBeInTheDocument();
    });

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
      expect(screen.getByText(/Thank you/i)).toBeInTheDocument();
      expect(
        screen.getByText(/We sent an email to testuser@example.com/i)
      ).toBeInTheDocument();
    });
  });

  it('updates step via StepsRoot callback', async () => {
    render(<SignUpPage />);
    expect(screen.getByText(/Welcome to BetaCall/i)).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('trigger-step-change'));

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText('Enter your password')
      ).toBeInTheDocument();
    });
  });

  it('calls nextStep={() => setStep(2)} and setEmail={(email) => setEmail(email)} on successful StepTwo form submission', async () => {
    render(<SignUpPage />);

    const emailInput = getVisibleEmailInput();
    const checkbox = screen.getAllByRole('checkbox')[0];
    const signUpButton = screen.getByRole('button', { name: /^Sign Up$/i });

    fireEvent.change(emailInput!, {
      target: { value: 'testuser@example.com' },
    });
    fireEvent.blur(emailInput!);
    fireEvent.click(checkbox);
    fireEvent.click(signUpButton);

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText('Enter your password')
      ).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText('Enter your first name'), {
      target: { value: 'Jane' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your last name'), {
      target: { value: 'Smith' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'Password123!' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), {
      target: { value: 'Password123!' },
    });

    fireEvent.click(screen.getByTestId('submit-data-testid'));

    await waitFor(() => {
      expect(screen.getByText(/Thank you/i)).toBeInTheDocument();
      expect(
        screen.getByText(/We sent an email to testuser@example.com/i)
      ).toBeInTheDocument();
    });
  });
});
