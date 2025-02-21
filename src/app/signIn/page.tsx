'use client';

import { useState } from 'react';
import { Flex } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { MdEmail, MdLock } from 'react-icons/md';
import { FaEye } from 'react-icons/fa';
import { FaGoogle, FaFacebookF, FaXTwitter } from 'react-icons/fa6';
import TextInput from '@/components/input/input';
import Typography from '@/components/typography/typography';
import Button from '@/components/button/button';
import { Wrapper, BoxOr, StyledCheckbox, StyledLink } from './style';
import { userSignIn } from '../api/auth/route';

interface FormDataSignIn {
  email: string;
  password: string;
  rememberMe: boolean;
}

const validatePassword = (value: string): true | string => {
  if (!/(?=.*[A-Z])/.test(value)) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!/(?=.*[!@#$%^&*])/.test(value)) {
    return 'Password must contain at least one special character';
  }
  return true;
};

export default function SignInPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataSignIn>();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const onSubmit = async (data: FormDataSignIn) => {
    return await userSignIn(data);
  };

  return (
    <Flex
      height={'calc(100svh - 81px)'}
      minHeight={'700px'}
      alignItems={'center'}
      justifyContent={'center'}
    >
      <Wrapper>
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

            <TextInput
              title="Password"
              iconElement={showPassword ? FaEye : MdLock}
              placeholder="Enter your password"
              type={showPassword ? 'text' : 'password'}
              error={!!errors.password}
              errorText={errors.password?.message}
              onIconClick={togglePasswordVisibility}
              {...register('password', {
                required: 'Password is required',
                validate: validatePassword,
              })}
            />

            <Flex justifyContent="space-between" alignItems="center">
              <Flex alignItems="center" gap="10px">
                <StyledCheckbox type="checkbox" {...register('rememberMe')} />
                <Typography>Remember me</Typography>
              </Flex>
              <StyledLink>Recover password</StyledLink>
            </Flex>

            <Button backgound="#6B59CC" type="submit">
              Sign In
            </Button>
          </Flex>
        </form>

        <BoxOr>
          <Typography color="#8083A3">Or</Typography>
        </BoxOr>

        <Flex flexDirection="column" width="100%" gap="10px">
          <Button
            variant="IconButton"
            backgound="#ECEEF5"
            color="#8083A3"
            iconElement={FaGoogle}
          >
            Sign In with Google
          </Button>
          <Button
            variant="IconButton"
            backgound="#ECEEF5"
            color="#8083A3"
            iconElement={FaFacebookF}
          >
            Sign In with Facebook
          </Button>
          <Button
            variant="IconButton"
            backgound="#ECEEF5"
            color="#8083A3"
            iconElement={FaXTwitter}
          >
            Sign In with X
          </Button>
        </Flex>
      </Wrapper>
    </Flex>
  );
}
