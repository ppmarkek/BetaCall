'use client';

import { Flex } from '@chakra-ui/react';
import { Wrapper, BoxOr } from './style';
import { SignInSteps } from './steps';
import Typography from '@/components/typography/typography';
import Button from '@/components/button/button';
import { FaGoogle, FaFacebookF, FaXTwitter } from 'react-icons/fa6';

export default function SignInPage() {
  return (
    <Flex
      height={'calc(100svh - 81px)'}
      minHeight={'700px'}
      alignItems={'center'}
      justifyContent={'center'}
    >
      <Wrapper>
        <SignInSteps />
        <BoxOr>
          <Typography color="#8083A3">Or</Typography>
        </BoxOr>

        <Flex flexDirection="column" width="100%" gap="10px">
          <Button
            variant="IconButton"
            backgound="#ECEEF5"
            color="#8083A3"
            iconElement={FaGoogle}
          >
            Sign In with Google
          </Button>
          <Button
            variant="IconButton"
            backgound="#ECEEF5"
            color="#8083A3"
            iconElement={FaFacebookF}
          >
            Sign In with Facebook
          </Button>
          <Button
            variant="IconButton"
            backgound="#ECEEF5"
            color="#8083A3"
            iconElement={FaXTwitter}
          >
            Sign In with X
          </Button>
        </Flex>
      </Wrapper>
    </Flex>
  );
}
