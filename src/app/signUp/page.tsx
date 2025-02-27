'use client';

import { Flex, StepsContent, StepsRoot, Spinner } from '@chakra-ui/react';
import { Wrapper } from './style';
import { StepOne, StepTwo, StepThree } from './steps';
import { useEffect, useState } from 'react';
import { account } from '@/lib/appwrite';
import { userAppwriteSignIn } from '../api/auth/route';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

type FormDataStepOne = {
  email: string;
  terms: boolean;
};

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const search = searchParams.get('socialMedia');
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('');
  const [appwriteId, setAppwriteId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(Boolean(search));
  const router = useRouter();

  useEffect(() => {
    if (!search) return;

    let navigated = false;
    account
      .get()
      .then(async (data) => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('socialMedia');
        const newUrl = `?${params.toString()}`;
        window.history.replaceState(null, '', newUrl);
        if (data) {
          const response = await userAppwriteSignIn({
            email: data.email,
            appwriteId: data.$id,
          });
          if (response.status === 200) {
            document.cookie = `accessToken=${response.data.accessToken}; path=/; Secure; SameSite=Strict;`;
            document.cookie = `refreshToken=${response.data.refreshToken}; path=/; Secure; SameSite=Strict;`;
            router.push('/');
            navigated = true;
          } else if (response.status === 403) {
            router.push(`/verify/${data.email}`);
            navigated = true;
          } else if (response.status === 404) {
            setEmail(data.email);
            setAppwriteId(data.$id);
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
          console.error('Error fetching google account data:', error);
        }
      })
      .finally(() => {
        if (!navigated) {
          setLoading(false);
        }
      });
  }, [email, router, search, searchParams]);

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
                setTerms(data.terms);
                setStep(1);
              }}
              setLoading={setLoading}
            />
          </StepsContent>

          <StepsContent index={1}>
            <StepTwo
              setLoading={setLoading}
              nextStep={() => setStep(2)}
              setEmail={(email) => setEmail(email)}
              email={email}
              appwriteId={appwriteId}
              firstName={firstName}
              lastName={lastName}
              terms={terms}
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
