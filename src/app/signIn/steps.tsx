import { useState } from 'react';
import { Flex } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { MdEmail, MdLock } from 'react-icons/md';
import { FaEye } from 'react-icons/fa';
import TextInput from '@/components/input/input';
import Typography from '@/components/typography/typography';
import Button from '@/components/button/button';
import { StyledCheckbox, StyledLink } from './style';

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

export const SignInSteps = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataSignIn>();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const onSubmit = (data: FormDataSignIn) => {
    console.log('Data sent:', data);
  };

  return (
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
  );
};
