'use client';

import React, { useState, useEffect } from 'react';
import { Flex, Spinner } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { MdEmail, MdLock } from 'react-icons/md';
import { FaEye, FaGoogle, FaFacebookF, FaXTwitter } from 'react-icons/fa6';
import TextInput from '@/components/input/input';
import Typography from '@/components/typography/typography';
import Button from '@/components/button/button';
import { userSignIn, userGoogleSignIn } from '../api/auth/route';
import { StyledCheckbox, StyledLink, Wrapper, BoxOr } from './style';
import { useRouter } from 'next/navigation';
import { account } from '@/lib/appwrite';
import { OAuthProvider } from 'appwrite';

interface FormDataSignIn {
  email: string;
  password: string;
  rememberMe: boolean;
}

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [errorLogin, setErrorLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataSignIn>();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async (data: FormDataSignIn) => {
    try {
      const response = await userSignIn(data);
      if (response.status >= 400) {
        setErrorLogin(true);
      }
      if (response.status === 200) {
        document.cookie = `accessToken=${response.data.accessToken}; path=/; Secure; SameSite=Strict;`;
        document.cookie = `refreshToken=${response.data.refreshToken}; path=/; Secure; SameSite=Strict;`;
        router.push('/');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    account.createOAuth2Session(
      OAuthProvider.Google,
      'http://localhost:3000/signIn',
      'http://localhost:3000/signIn'
    );
  };

  useEffect(() => {
    account
      .get()
      .then(async (data) => {
        setLoading(true);
        if (data) {
          const response = await userGoogleSignIn({
            email: data.email,
            googleId: data.$id,
          });
          if (response.status === 200) {
            document.cookie = `accessToken=${response.data.accessToken}; path=/; Secure; SameSite=Strict;`;
            document.cookie = `refreshToken=${response.data.refreshToken}; path=/; Secure; SameSite=Strict;`;
            router.push('/');
          } else if (response.status === 404) {
            const [firstName, lastName] = data.name.split(' ');
            router.push(
              `/signUp?step=2&email=${encodeURIComponent(data.email)}&googleId=${encodeURIComponent(
                data.$id
              )}&firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}`
            );
          }
        }
      })
      .catch((error) => {
        if (!error.message.includes('missing scope')) {
          console.error('Error fetching google account data:', error);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  if (loading) {
    return (
      <Flex
        height="calc(100svh - 81px)"
        minHeight="800px"
        alignItems="center"
        justifyContent="center"
      >
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Flex
      height="calc(100svh - 81px)"
      minHeight="800px"
      alignItems="center"
      justifyContent="center"
    >
      <Wrapper>
        <Flex flexDirection="column" gap="10px">
          <Typography variant="H1">Tell us more about yourself</Typography>
          <Typography variant="Regular" color="#8083A3">
            Enter your details to proceed further
          </Typography>
          {errorLogin && (
            <Typography color="#ff808b">Incorrect email or password</Typography>
          )}
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
              })}
            />
            <Flex justifyContent="space-between" alignItems="center">
              <Flex alignItems="center" gap="10px">
                <StyledCheckbox type="checkbox" {...register('rememberMe')} />
                <Typography>Remember me</Typography>
              </Flex>
              <StyledLink href="/recoverPassword">Recover password</StyledLink>
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
            onClick={handleGoogleLogin}
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
