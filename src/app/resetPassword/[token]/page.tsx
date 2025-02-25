'use client';

import { Flex, Spinner, Image } from '@chakra-ui/react';
import { StyledLink, Wrapper } from './style';
import Typography from '@/components/typography/typography';
import TextInput from '@/components/input/input';
import Button from '@/components/button/button';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { MdLock } from 'react-icons/md';
import { FaCheckCircle } from 'react-icons/fa';
import { FaEye } from 'react-icons/fa6';
import { validatePassword } from '@/validation/validation';
import { useParams } from 'next/navigation';
import { tokenResetPassword } from '@/app/api/userData/route';

interface FormDataResetPassword {
  newPassword: string;
  repeatNewPassword: string;
}

export default function ResetPasswordPage() {
  const { token } = useParams() as { token: string };
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successfull, setSuccessfull] = useState(false);

  const togglePasswordVisibility = () => setShowNewPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmNewPassword((prev) => !prev);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormDataResetPassword>();

  const newPasswordValue = watch('newPassword');

  const onSubmit = async (data: FormDataResetPassword) => {
    setLoading(true);
    try {
      if (token) {
        const response = await tokenResetPassword(data.newPassword, token);
        if (response.status === 400) {
          setErrorMessage(response.data.message);
        } else if (response.status === 200) {
          setSuccessfull(true);
        }
      } else {
        throw new Error('Token is missing');
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

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
        {successfull ? (
          <>
            <Image
              width="320px"
              height="260px"
              src="/assets/finishSignUp.png"
              alt="Confirmation"
            />
            <Flex flexDirection="column" gap="5px">
              <Typography variant="H1">
                Password updated successfully
              </Typography>
              <Typography variant="Regular" color="#8083A3">
                Your password has been successfully changed. You can now log in
                with your new credentials.
              </Typography>
            </Flex>
            <StyledLink href="/signIn">Sign In</StyledLink>
          </>
        ) : (
          <>
            <Flex flexDirection="column" gap="10px">
              <Typography variant="H1">Reset Your Password</Typography>
              <Typography variant="Regular" color="#8083A3">
                Enter your new password below
              </Typography>
              {errorMessage && (
                <Typography color="#ff808b">{errorMessage}</Typography>
              )}
            </Flex>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Flex flexDirection="column" gap="35px">
                <TextInput
                  title="New Password"
                  iconElement={showNewPassword ? FaEye : MdLock}
                  placeholder="Enter your new password"
                  type={showNewPassword ? 'text' : 'password'}
                  error={!!errors.newPassword}
                  errorText={errors.newPassword?.message}
                  onIconClick={togglePasswordVisibility}
                  {...register('newPassword', {
                    required: 'New password is required',
                    validate: validatePassword,
                  })}
                />

                <TextInput
                  title="Confirm New Password"
                  iconElement={showConfirmNewPassword ? FaEye : FaCheckCircle}
                  placeholder="Confirm your new password"
                  type={showConfirmNewPassword ? 'text' : 'password'}
                  error={!!errors.repeatNewPassword}
                  errorText={errors.repeatNewPassword?.message}
                  onIconClick={toggleConfirmPasswordVisibility}
                  {...register('repeatNewPassword', {
                    required: 'Please confirm your new password',
                    validate: (value) =>
                      value === newPasswordValue || 'Passwords do not match',
                  })}
                />

                <Button background="#6B59CC" type="submit">
                  Save
                </Button>
              </Flex>
            </form>
          </>
        )}
      </Wrapper>
    </Flex>
  );
}
