'use client';

import { Flex, StepsContent, StepsRoot } from '@chakra-ui/react';
import { Wrapper } from './style';
import { StepOne, StepTwo, StepThree } from './steps';
import { useState } from 'react';

type FormDataStepOne = {
  email: string;
  terms: boolean;
};

export default function SignUpPage() {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('');

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
            />
          </StepsContent>
          <StepsContent index={1}>
            <StepTwo nextStep={() => setStep(2)} email={email} />
          </StepsContent>
          <StepsContent index={2}>
            <StepThree email={email} />
          </StepsContent>
        </StepsRoot>
      </Wrapper>
    </Flex>
  );
}
