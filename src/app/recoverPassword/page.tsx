'use client';

import Button from '@/components/button/button';
import TextInput from '@/components/input/input';
import Typography from '@/components/typography/typography';
import { Flex, Image, Spinner } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { MdEmail } from 'react-icons/md';
import { useState } from 'react';
import { requestResetPassword } from '../api/userData/route';

interface FormDataRecoverPassword {
  email: string;
}

export default function RecoverPasswordPage() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataRecoverPassword>();

  const onSubmit = async (data: FormDataRecoverPassword) => {
    setLoading(true);
    try {
      const response = await requestResetPassword(data.email);
      if (response.status === 200) {
        setMessage('The letter has been resent');
      } else if (response.status === 404) {
        setMessage('User with this email not found');
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
        <Spinner size="xl" data-testid="spinner" />
      </Flex>
    );
  }

  return (
    <Flex
      height="calc(100svh - 81px)"
      minHeight="800px"
      alignItems="center"
      justifyContent="center"
      gap="50px"
      flexDirection={'column'}
      data-testid={'recoverPasswordPage-testid'}
    >
      <Image src="/assets/recover.png" alt="recover image" />
      <Flex flexDirection={'column'} textAlign={'center'} gap={'10px'}>
        <Typography variant="H1">
          Lost your password? <br />
          Enter your details to recover.
        </Typography>
        <Typography variant="Regular" color="#8083A3">
          Enter your details to proceed further
        </Typography>
        {message && (
          <Typography
            color={
              message === 'The letter has been resent' ? '#28C345' : '#ff808b'
            }
          >
            {message}
          </Typography>
        )}
      </Flex>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex flexDirection={'column'} gap={'35px'} width={'420px'}>
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
          <Button type="submit" variant="Filled">
            Recover
          </Button>
        </Flex>
      </form>
    </Flex>
  );
}
