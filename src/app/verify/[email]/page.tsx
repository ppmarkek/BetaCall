'use client';

import { useParams } from 'next/navigation';
import { Flex, Image } from '@chakra-ui/react';
import Typography from '@/components/typography/typography';
import { StyledLink } from '../style';
import { resendVerification } from '@/app/api/auth/route';
import { useEffect } from 'react';

const VerifyEmail = () => {
  const { email } = useParams();

  const decodedEmail =
    typeof email === 'string' ? decodeURIComponent(email) : '';

  useEffect(() => {
    if (decodedEmail) {
      resendVerification(decodedEmail);
    }
  }, [decodedEmail]);

  return (
    <Flex
      height="calc(100svh - 81px)"
      minHeight="700px"
      justifyContent="center"
      alignItems="center"
    >
      <Flex flexDirection="column" gap="50px" alignItems="center">
        <Image src="/assets/recover.png" alt="Confirmation" />
        <Flex flexDirection="column" textAlign="center" width="450px" gap="5px">
          <Typography variant="H1">
            We have sent a confirmation email to your address.
          </Typography>
          <Typography variant="Regular" color="#8083A3">
            <br /> Please check your email.
            <br /> If the email does not arrive, click “Resend email.”
          </Typography>
        </Flex>
        <StyledLink
          onClick={() => decodedEmail && resendVerification(decodedEmail)}
        >
          Resend Email
        </StyledLink>
      </Flex>
    </Flex>
  );
};

export default VerifyEmail;
