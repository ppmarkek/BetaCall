'use client';

import { useParams } from 'next/navigation';
import { Flex, Image, Spinner } from '@chakra-ui/react';
import Typography from '@/components/typography/typography';
import { StyledLink } from '../style';
import { resendVerification } from '@/app/api/auth/route';
import { useEffect, useState } from 'react';

export async function handleResendVerification(
  emailToVerify: string | string[],
  setBeenVerified: (verified: boolean) => void,
  setLoading: (loading: boolean) => void
): Promise<void> {
  try {
    if (emailToVerify) {
      const response = await resendVerification(
        Array.isArray(emailToVerify) ? emailToVerify[0] : emailToVerify
      );
      if (response && response.status === 400) {
        setBeenVerified(true);
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
}

export default function VerifyEmail() {
  const { email } = useParams();
  const [loading, setLoading] = useState(true);
  const [beenVerified, setBeenVerified] = useState(false);

  const decodedEmail =
    typeof email === 'string' ? decodeURIComponent(email) : '';

  useEffect(() => {
    if (decodedEmail) {
      handleResendVerification(decodedEmail, setBeenVerified, setLoading);
    } else {
      setLoading(false);
    }
  }, [decodedEmail]);

  if (loading) {
    return (
      <Flex
        height={'calc(100svh - 81px)'}
        minHeight={'700px'}
        alignItems={'center'}
        justifyContent={'center'}
      >
        <Spinner data-testid="spinner" size="xl" />
      </Flex>
    );
  }

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
          {beenVerified ? (
            <Typography variant="H1">Account verified successfully</Typography>
          ) : (
            <>
              <Typography variant="H1">
                We have sent a confirmation email to your address.
              </Typography>
              <Typography variant="Regular" color="#8083A3">
                <br /> Please check your email.
                <br /> If the email does not arrive, click “Resend email.”
              </Typography>
            </>
          )}
        </Flex>
        {beenVerified ? (
          <StyledLink href="/signIn">Sign In</StyledLink>
        ) : (
          <StyledLink
            onClick={() =>
              handleResendVerification(
                decodedEmail,
                setBeenVerified,
                setLoading
              )
            }
          >
            Resend Email
          </StyledLink>
        )}
      </Flex>
    </Flex>
  );
}
