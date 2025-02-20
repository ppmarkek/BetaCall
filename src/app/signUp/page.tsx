'use client';

import { useForm } from 'react-hook-form';
import Typography from '@/components/typography/typography';
import { Flex } from '@chakra-ui/react';
import { BoxOr, StyledCheckbox, Wrapper } from './style';
import TextInput from '@/components/input/input';
import { MdEmail } from 'react-icons/md';
import { FaGoogle } from 'react-icons/fa';
import { FaFacebookF } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import Button from '@/components/button/button';

type FormData = {
  email: string;
  terms: boolean;
};

export default function SignUpPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log('Form Data:', data);
  };

  return (
    <Flex
      height={'calc(100svh - 81px)'}
      minHeight={'700px'}
      alignItems={'center'}
      justifyContent={'center'}
    >
      <Wrapper>
        <Flex flexDirection="column" gap={'10px'}>
          <Typography variant={'H1'}>
            Welcome to BetaCall
            <br /> Sign Up to get started.
          </Typography>
          <Typography variant={'Regular'} color={'#8083A3'}>
            Enter your details to proceed further
          </Typography>
        </Flex>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex flexDirection={'column'} gap={'35px'}>
            <TextInput
              title={'Email'}
              iconElement={MdEmail}
              placeholder={'Enter your email'}
              error={!!errors.email}
              {...register('email', {
                required: true,
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Invalid email address',
                },
              })}
            />

            <Flex alignItems={'center'} gap={'10px'}>
              <StyledCheckbox
                type={'checkbox'}
                {...register('terms', { required: true })}
              />
              <Typography
                weight={'Bold'}
                color={errors.terms ? '#ff808b' : '#1A1C1D'}
              >
                I agree with terms & conditions
              </Typography>
            </Flex>

            <Button backgound={'#6B59CC'} type={'submit'}>
              Sign Up
            </Button>
          </Flex>
        </form>

        <Flex justifyContent={'center'}>
          <BoxOr>
            <Typography color={'#8083A3'}>Or</Typography>
          </BoxOr>
        </Flex>

        <Flex flexDirection={'column'} width={'100%'} gap={'10px'}>
          <Button
            variant={'IconButton'}
            backgound={'#ECEEF5'}
            color={'#8083A3'}
            iconElement={FaGoogle}
          >
            Sign Up with Google
          </Button>
          <Button
            variant={'IconButton'}
            backgound={'#ECEEF5'}
            color={'#8083A3'}
            iconElement={FaFacebookF}
          >
            Sign Up with Facebook
          </Button>
          <Button
            variant={'IconButton'}
            backgound={'#ECEEF5'}
            color={'#8083A3'}
            iconElement={FaXTwitter}
          >
            Sign Up with X
          </Button>
        </Flex>
      </Wrapper>
    </Flex>
  );
}
