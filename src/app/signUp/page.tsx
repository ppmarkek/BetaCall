'use client';

import { Flex, StepsContent, StepsRoot, Spinner } from '@chakra-ui/react';
import { Wrapper } from './style';
import { StepOne, StepTwo, StepThree } from './steps';
import { useEffect, useState } from 'react';
import { account } from '@/lib/appwrite';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSignUpCallbacks } from './signUpCallbacks';
import { useDispatch, useSelector } from 'react-redux';
import { signUpUserAppwrite } from '@/redux/user/userSlice';
import { AppDispatch, RootState } from '@/redux/store';

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
  const [localLoading, setLocalLoading] = useState(Boolean(search));

  const { loading } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleStepOneNext = (data: FormDataStepOne) => {
    setEmail(data.email);
    setTerms(data.terms);
    setStep(1);
  };

  const { handleStepTwoNext, handleSetEmail } = getSignUpCallbacks(
    setStep,
    setEmail
  );

  useEffect(() => {
    if (!search) return;

    account
      .get()
      .then(async (data) => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('socialMedia');
        const newUrl = `?${params.toString()}`;
        window.history.replaceState(null, '', newUrl);
        if (data) {
          const result = await dispatch(
            signUpUserAppwrite({
              email: data.email,
              appwriteId: data.$id,
              name: data.name,
            })
          );

          if (signUpUserAppwrite.fulfilled.match(result)) {
            router.push('/');
          } else if (
            result.payload &&
            typeof result.payload === 'object' &&
            'verificationRequired' in result.payload &&
            result.payload.verificationRequired
          ) {
            router.push(`/verify/${data.email}`);
          } else if (
            result.payload &&
            typeof result.payload === 'object' &&
            'isNotRegistr' in result.payload &&
            result.payload.isNotRegistr
          ) {
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
          setLocalLoading(false);
        } else {
          console.error('Error fetching google account data:', error);
        }
      })
      .finally(() => {
        setLocalLoading(false);
      });
  }, [search, searchParams, router, dispatch]);

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

  if (loading || localLoading) {
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
        <StepsRoot
          data-testid="steps-root"
          step={step}
          onStepChange={(e) => setStep(e.step)}
          count={3}
        >
          <StepsContent index={0} data-testid="steps-content-0">
            <StepOne
              nextStep={handleStepOneNext}
              setLoading={setLocalLoading}
            />
          </StepsContent>

          <StepsContent index={1} data-testid="steps-content-1">
            <StepTwo
              setLoading={setLocalLoading}
              nextStep={handleStepTwoNext}
              setEmail={handleSetEmail}
              email={email}
              appwriteId={appwriteId}
              firstName={firstName}
              lastName={lastName}
              terms={terms}
            />
          </StepsContent>
          <StepsContent index={2} data-testid="steps-content-2">
            <StepThree email={email} />
          </StepsContent>
        </StepsRoot>
      </Wrapper>
    </Flex>
  );
}
