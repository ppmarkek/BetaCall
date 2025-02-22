'use client';

import { Flex, StepsContent, StepsRoot, Spinner } from '@chakra-ui/react';
import { Wrapper } from './style';
import { StepOne, StepTwo, StepThree } from './steps';
import { useEffect, useState } from 'react';
import { account } from '@/lib/appwrite';
import { userGoogleSignIn } from '../api/auth/route';
import { useRouter } from 'next/navigation';

type FormDataStepOne = {
  email: string;
  terms: boolean;
};

export default function SignUpPage() {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('');
  const [googleId, setGoogleId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
            setEmail(data.email);
            setGoogleId(data.$id);
            setFirstName(data.name.split(' ')[0]);
            setLastName(data.name.split(' ')[1]);
            setStep(1);
          }
        }
      })
      .catch((error) => {
        if (error.message.includes('missing scope')) {
          setLoading(false);
          return;
        } else {
          setLoading(false);
          console.error('Error fetching google account data:', error);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      account
        .deleteSession('current')
        .catch((error) =>
          console.error('Error deleting session on page unload:', error)
        );
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

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

  return (
    <Flex
      height={'calc(100svh - 81px)'}
      minHeight={'700px'}
      alignItems={'center'}
      justifyContent={'center'}
    >
      <Wrapper>
        <StepsRoot step={step} onStepChange={(e) => setStep(e.step)} count={3}>
          <StepsContent index={0}>
            <StepOne
              nextStep={(data: FormDataStepOne) => {
                setEmail(data.email);
                setStep(1);
              }}
              setLoading={setLoading}
            />
          </StepsContent>

          <StepsContent index={1}>
            <StepTwo
              nextStep={() => setStep(2)}
              email={email}
              googleId={googleId}
              firstName={firstName}
              lastName={lastName}
            />
          </StepsContent>
          <StepsContent index={2}>
            <StepThree email={email} />
          </StepsContent>
        </StepsRoot>
      </Wrapper>
    </Flex>
  );
}
