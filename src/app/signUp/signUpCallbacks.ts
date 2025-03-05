export const getSignUpCallbacks = (
  setStep: (step: number) => void,
  setEmail: (email: string) => void
) => {
  const handleStepTwoNext = () => {
    setStep(2);
  };

  const handleSetEmail = (email: string) => {
    setEmail(email);
  };

  return { handleStepTwoNext, handleSetEmail };
};
