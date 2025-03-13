'use client';

import React, { useState, useEffect } from 'react';
import { Flex, Spinner } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { MdEmail, MdLock } from 'react-icons/md';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { FaEye } from 'react-icons/fa6';
import TextInput from '@/components/input/input';
import Typography from '@/components/typography/typography';
import Button from '@/components/button/button';
import { StyledCheckbox, StyledLink, Wrapper, BoxOr } from './style';
import { useRouter, useSearchParams } from 'next/navigation';
import { account } from '@/lib/appwrite';
import { OAuthProvider } from 'appwrite';
import { useDispatch, useSelector } from 'react-redux';
import { signInUser, signInUserAppwrite } from '@/redux/user/userSlice';
import { AppDispatch, RootState } from '@/redux/store';

interface FormDataSignIn {
  email: string;
  password: string;
  rememberMe: boolean;
}

export default function SignInPage() {
  const searchParams = useSearchParams();
  const socialMediaParam = searchParams.get('socialMedia');
  const [showPassword, setShowPassword] = useState(false);
  const [errorLogin, setErrorLogin] = useState(false);
  const [localLoading, setLocalLoading] = useState(Boolean(socialMediaParam));

  const { loading } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataSignIn>();

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleGoogleLogin = () => {
    setLocalLoading(true);
    account.createOAuth2Session(
      OAuthProvider.Google,
      'http://localhost:3000/signIn?socialMedia=true',
      'http://localhost:3000/signIn?socialMedia=false'
    );
  };

  const handleGithubLogin = () => {
    setLocalLoading(true);
    account.createOAuth2Session(
      OAuthProvider.Github,
      'http://localhost:3000/signIn?socialMedia=true',
      'http://localhost:3000/signIn?socialMedia=false'
    );
  };

  const onSubmit = async (data: FormDataSignIn) => {
    setLocalLoading(true);
    const result = await dispatch(
      signInUser({ email: data.email, password: data.password })
    );

    if (signInUser.fulfilled.match(result)) {
      await router.push('/');
      return;
    } else if (
      result.payload &&
      typeof result.payload === 'object' &&
      'verificationRequired' in result.payload &&
      result.payload.verificationRequired
    ) {
      await router.push(`/verify/${data.email}`);
      return;
    } else if (
      result.payload &&
      typeof result.payload === 'object' &&
      'message' in result.payload
    ) {
      setErrorLogin(true);
    }
    setLocalLoading(false);
  };

  useEffect(() => {
    if (!socialMediaParam) return;

    async function handleOAuth() {
      try {
        const data = await account.get();
        if (data) {
          const result = await dispatch(
            signInUserAppwrite({
              email: data.email,
              appwriteId: data.$id,
              name: data.name,
            })
          );
          if (signInUserAppwrite.fulfilled.match(result)) {
            await router.push('/');
            return;
          } else if (
            result.payload &&
            typeof result.payload === 'object' &&
            'redirectToSignUp' in result.payload &&
            result.payload.redirectToSignUp
          ) {
            if ('signUpUrl' in result.payload) {
              await router.push(result.payload.signUpUrl as string);
              return;
            }
          } else if (
            result.payload &&
            typeof result.payload === 'object' &&
            'verificationRequired' in result.payload &&
            result.payload.verificationRequired
          ) {
            await router.push(`/verify/${data.email}`);
            return;
          } else if (
            result.payload &&
            typeof result.payload === 'object' &&
            'message' in result.payload
          ) {
            setErrorLogin(true);
          }
        }
      } catch (error) {
        if (error instanceof Error && !error.message.includes('missing scope')) {
          console.error('Error fetching google account data:', error);
        }
      }
      setLocalLoading(false);
    }

    handleOAuth();
  }, [socialMediaParam, dispatch, router]);

  if (localLoading || loading) {
    return (
      <Flex
        height="calc(100svh - 81px)"
        minHeight="800px"
        alignItems="center"
        justifyContent="center"
      >
        <Spinner data-testid="spinner" size="xl" />
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
            <Button
              data-testid="button-submit"
              background="#6B59CC"
              type="submit"
            >
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
            background="#ECEEF5"
            color="#8083A3"
            iconElement={FaGoogle}
            onClick={handleGoogleLogin}
          >
            Sign In with Google
          </Button>
          <Button
            variant="IconButton"
            background="#ECEEF5"
            color="#8083A3"
            iconElement={FaGithub}
            onClick={handleGithubLogin}
          >
            Sign Up with GitHub
          </Button>
        </Flex>
      </Wrapper>
    </Flex>
  );
}
