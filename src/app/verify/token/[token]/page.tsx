'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useSearchParams } from 'next/navigation';
import { Flex, Image } from '@chakra-ui/react';
import Typography from '@/components/typography/typography';
import { StyledLink } from '../../style';
import { resendVerification } from '@/app/api/auth/route';

const VerifyEmail = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const { token } = useParams();
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) return;
    axios
      .get(`https://betacall-backend.onrender.com/api/users/verify/${token}`)
      .then((res) => setMessage(res.data.message))
      .catch((err) => setMessage(err.response.data.message));
  }, [token]);

  return (
    <Flex
      height="calc(100svh - 81px)"
      minHeight="700px"
      justifyContent="center"
      alignItems="center"
    >
      <Flex flexDirection="column" gap="50px" alignItems="center">
        <Image src="/assets/recover.png" alt="Confirmation" />
        <Flex flexDirection="column" textAlign="center" gap="5px">
          <Typography variant="H1">{message}</Typography>
        </Flex>
        {message === 'Account verified successfully' && (
          <StyledLink href="/signIn">Sign In</StyledLink>
        )}
        {message === 'The link is invalid or expired' && (
          <StyledLink onClick={() => email && resendVerification(email)}>
            Resend Email
          </StyledLink>
        )}
        {message === 'The account has already been verified' && (
          <StyledLink href="/signIn">Sign In</StyledLink>
        )}
      </Flex>
    </Flex>
  );
};

export default VerifyEmail;
