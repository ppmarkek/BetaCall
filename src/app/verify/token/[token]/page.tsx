'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useSearchParams } from 'next/navigation';
import { Flex, Image, Spinner } from '@chakra-ui/react';
import Typography from '@/components/typography/typography';
import { StyledLink } from '../../style';
import { resendVerification } from '@/app/api/auth/route';

const VerifyEmail = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const { token } = useParams();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [beenVerified, setBeenVerified] = useState(false);

  useEffect(() => {
    if (!token) return;
    axios
      .get(`https://betacall-backend.onrender.com/api/users/verify/${token}`)
      .then((res) => {
        setMessage(res.data.message);
        setLoading(false);
      })
      .catch((err) => {
        setMessage(err.response.data.message);
        setLoading(false);
      })
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <Flex
        height={'calc(100svh - 81px)'}
        minHeight={'700px'}
        alignItems={'center'}
        justifyContent={'center'}
      >
        <Spinner size="xl" />
      </Flex>
    );
  }

  const handleResendVerification = async () => {
    try {
      if (email) {
        const response = await resendVerification(email);
        if (response.status === 400) {
          setBeenVerified(true);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

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
          {beenVerified ? (
            <Typography variant="H1">Account verified successfully</Typography>
          ) : (
            <Typography variant="H1">{message}</Typography>
          )}
        </Flex>
        {message === 'Account verified successfully' ||
          (beenVerified && <StyledLink href="/signIn">Sign In</StyledLink>)}
        {message === 'The link is invalid or expired' && !beenVerified && (
          <StyledLink onClick={() => handleResendVerification()}>
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
