import { useEffect, useState } from 'react';
import { Flex, Grid, Image } from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';
import { MdEmail, MdLock } from 'react-icons/md';
import { FaGoogle, FaUserAlt, FaCheckCircle, FaGithub } from 'react-icons/fa';
import TextInput from '@/components/input/input';
import Typography from '@/components/typography/typography';
import Button from '@/components/button/button';
import { BoxOr, StyledCheckbox, StyledLink } from './style';
import { resendVerification, userSignUp } from '../api/auth/route';
import { OAuthProvider } from 'appwrite';
import { account } from '@/lib/appwrite';

interface FormDataStepOne {
  email: string;
  terms: boolean;
}

interface FormDataStepTwo {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

interface StepOneProps {
  nextStep: (data: FormDataStepOne) => void;
  setLoading: (value: boolean) => void;
}

interface StepTwoProps {
  email?: string;
  appwriteId?: string;
  firstName?: string;
  lastName?: string;
  terms?: boolean;
  setLoading: (value: boolean) => void;
  nextStep: () => void;
}

interface StepThreeProps {
  email: string;
}

const validatePassword = (value: string): true | string => {
  if (value.length < 6) {
    return 'Password must be at least 6 characters';
  }
  if (!/(?=.*[A-Z])/.test(value)) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!/(?=.*[!@#$%^&*])/.test(value)) {
    return 'Password must contain at least one special character';
  }
  return true;
};

export const StepOne = ({ nextStep, setLoading }: StepOneProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataStepOne>();
  const onSubmit = (data: FormDataStepOne) => nextStep(data);

  const handleGoogleLogin = () => {
    setLoading(true);
    account.createOAuth2Session(
      OAuthProvider.Google,
      'http://localhost:3000/signUp?socialMedia=true',
      'http://localhost:3000/signUp?socialMedia=false'
    );
  };

  const handleGithubLogin = () => {
    setLoading(true);
    account.createOAuth2Session(
      OAuthProvider.Github,
      'http://localhost:3000/signUp?socialMedia=true',
      'http://localhost:3000/signUp?socialMedia=false'
    );
  };

  return (
    <Flex flexDirection="column" gap="50px">
      <Flex flexDirection="column" gap="10px">
        <Typography variant="H1">
          Welcome to BetaCall
          <br /> Sign Up to get started.
        </Typography>
        <Typography variant="Regular" color="#8083A3">
          Enter your details to proceed further
        </Typography>
      </Flex>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex flexDirection="column" gap="35px">
          <TextInput
            type="email"
            title="Email"
            iconElement={MdEmail}
            placeholder="Enter your email"
            error={!!errors.email}
            errorText={errors.email?.message}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Invalid email address',
              },
            })}
          />

          <Flex alignItems="center" gap="10px">
            <StyledCheckbox
              type="checkbox"
              {...register('terms', {
                required: 'You must agree to the terms and conditions',
              })}
            />
            <Typography
              weight="Bold"
              color={errors.terms ? '#ff808b' : '#1A1C1D'}
            >
              I agree with terms &amp; conditions
            </Typography>
          </Flex>

          <Button backgound="#6B59CC" type="submit">
            Sign Up
          </Button>
        </Flex>
      </form>

      <Flex justifyContent="center">
        <BoxOr>
          <Typography color="#8083A3">Or</Typography>
        </BoxOr>
      </Flex>

      <Flex flexDirection="column" width="100%" gap="10px">
        <Button
          variant="IconButton"
          backgound="#ECEEF5"
          color="#8083A3"
          iconElement={FaGoogle}
          onClick={handleGoogleLogin}
        >
          Sign Up with Google
        </Button>
        <Button
          variant="IconButton"
          backgound="#ECEEF5"
          color="#8083A3"
          iconElement={FaGithub}
          onClick={handleGithubLogin}
        >
          Sign Up with GitHub
        </Button>
      </Flex>
    </Flex>
  );
};

export const StepTwo = ({
  email,
  appwriteId,
  firstName,
  lastName,
  terms,
  nextStep,
  setLoading,
}: StepTwoProps) => {
  const [emailExist, setEmailExist] = useState(false);
  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormDataStepTwo>({
    mode: 'onBlur',
    defaultValues: { email },
  });

  useEffect(() => {
    reset({ email, firstName, lastName, terms });
  }, [email, firstName, lastName, terms, reset]);

  const onSubmit = async (data: FormDataStepTwo) => {
    try {
      setLoading(true);
      const response = await userSignUp({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password,
        appwriteId: appwriteId,
        terms: data.terms,
      });
      if (response.status >= 400) setEmailExist(true);
      if (response.status === 201) {
        setLoading(false);
        nextStep();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const password = watch('password');

  return (
    <Flex flexDirection="column" gap="50px">
      <Flex flexDirection="column" gap="10px">
        <Typography variant="H1">Tell us more about yourself</Typography>
        <Typography variant="Regular" color="#8083A3">
          Enter your details to proceed further
        </Typography>
        {emailExist && (
          <Typography color={'#ff808b'}>
            A user with the same email already exists
          </Typography>
        )}
      </Flex>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex flexDirection="column" gap="35px">
          <Controller
            control={control}
            name="email"
            defaultValue={email}
            render={({ field }) => (
              <TextInput
                {...field}
                type="email"
                title="Email"
                iconElement={MdEmail}
                placeholder="Enter your email"
                error={!!errors.email}
                errorText={errors.email?.message}
              />
            )}
          />

          <Grid templateColumns="repeat(2, 1fr)" gap="30px">
            <Controller
              control={control}
              name="firstName"
              defaultValue={firstName}
              render={({ field }) => (
                <TextInput
                  {...field}
                  title="First name"
                  iconElement={FaUserAlt}
                  placeholder="Enter your first name"
                  error={!!errors.firstName}
                  errorText={errors.firstName?.message}
                  {...register('firstName', {
                    required: 'First name is required',
                  })}
                />
              )}
            />

            <Controller
              control={control}
              name="lastName"
              defaultValue={lastName}
              render={({ field }) => (
                <TextInput
                  {...field}
                  title="Last name"
                  iconElement={FaUserAlt}
                  placeholder="Enter your last name"
                  error={!!errors.lastName}
                  errorText={errors.lastName?.message}
                  {...register('lastName', {
                    required: 'Last name is required',
                  })}
                />
              )}
            />
          </Grid>

          <TextInput
            title="Password"
            iconElement={MdLock}
            placeholder="Enter your password"
            type="password"
            error={!!errors.password}
            errorText={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              validate: validatePassword,
            })}
          />

          <TextInput
            title="Confirm password"
            iconElement={FaCheckCircle}
            placeholder="Confirm your password"
            type="password"
            error={!!errors.confirmPassword}
            errorText={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) =>
                value === password || 'Passwords do not match',
            })}
          />

          <Flex alignItems="center" gap="10px">
            <StyledCheckbox
              type="checkbox"
              {...register('terms', {
                required: 'You must agree to the terms and conditions',
              })}
            />
            <Typography
              weight="Bold"
              color={errors.terms ? '#ff808b' : '#1A1C1D'}
            >
              I agree with terms &amp; conditions
            </Typography>
          </Flex>

          <Button backgound="#6B59CC" type="submit">
            Continue
          </Button>
        </Flex>
      </form>
    </Flex>
  );
};

export const StepThree = ({ email }: StepThreeProps) => {
  return (
    <Flex flexDirection="column" gap="50px" alignItems="center">
      <Image
        width="320px"
        height="260px"
        src="/assets/finishSignUp.png"
        alt="Confirmation"
      />
      <Flex flexDirection="column" gap="5px">
        <Typography variant="H1">Thank you</Typography>
        <Typography variant="Regular" color="#8083A3">
          We sent an email to {email}
          <br />
          Click the confirmation link in the email to verify your account
        </Typography>
      </Flex>
      <StyledLink onClick={() => resendVerification(email)}>
        Resend Email
      </StyledLink>
    </Flex>
  );
};
