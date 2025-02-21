import { useEffect } from 'react';
import { Flex, Grid, Image } from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';
import { MdEmail, MdLock } from 'react-icons/md';
import {
  FaGoogle,
  FaFacebookF,
  FaUserAlt,
  FaCheckCircle,
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

import TextInput from '@/components/input/input';
import Typography from '@/components/typography/typography';
import Button from '@/components/button/button';
import { BoxOr, StyledCheckbox, StyledLink } from './style';
import { useSocialAuth } from '@/hooks/useSocialAuth';

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
}

interface StepTwoProps {
  email: string;
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

export const StepOne = ({ nextStep }: StepOneProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataStepOne>();

  const { handleSocialLogin } = useSocialAuth();
  const onSubmit = (data: FormDataStepOne) => nextStep(data);

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
          onClick={() => handleSocialLogin('google')}
        >
          Sign Up with Google
        </Button>
        <Button
          variant="IconButton"
          backgound="#ECEEF5"
          color="#8083A3"
          iconElement={FaFacebookF}
          onClick={() => handleSocialLogin('facebook')}
        >
          Sign Up with Facebook
        </Button>
        <Button
          variant="IconButton"
          backgound="#ECEEF5"
          color="#8083A3"
          iconElement={FaXTwitter}
          onClick={() => handleSocialLogin('twitter')}
        >
          Sign Up with X
        </Button>
      </Flex>
    </Flex>
  );
};

export const StepTwo = ({ email, nextStep }: StepTwoProps) => {
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
    reset({ email });
  }, [email, reset]);

  const onSubmit = (data: FormDataStepTwo) => {
    console.log('Form Data:', data);
    nextStep();
  };

  const password = watch('password');

  return (
    <Flex flexDirection="column" gap="50px">
      <Flex flexDirection="column" gap="10px">
        <Typography variant="H1">Tell us more about yourself</Typography>
        <Typography variant="Regular" color="#8083A3">
          Enter your details to proceed further
        </Typography>
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
                title="Email"
                iconElement={MdEmail}
                placeholder="Enter your email"
                error={!!errors.email}
                errorText={errors.email?.message}
              />
            )}
          />

          <Grid templateColumns="repeat(2, 1fr)" gap="30px">
            <TextInput
              title="First name"
              iconElement={FaUserAlt}
              placeholder="Enter your first name"
              error={!!errors.firstName}
              errorText={errors.firstName?.message}
              {...register('firstName', {
                required: 'First name is required',
              })}
            />

            <TextInput
              title="Last name"
              iconElement={FaUserAlt}
              placeholder="Enter your last name"
              error={!!errors.lastName}
              errorText={errors.lastName?.message}
              {...register('lastName', {
                required: 'Last name is required',
              })}
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
      <StyledLink>Resend Email</StyledLink>
    </Flex>
  );
};
