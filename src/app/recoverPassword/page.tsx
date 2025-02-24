'use client';

import Button from '@/components/button/button';
import TextInput from '@/components/input/input';
import Typography from '@/components/typography/typography';
import { Flex, Image } from '@chakra-ui/react';
import { MdEmail } from 'react-icons/md';

export default function RecoverPasswordPage() {
  return (
    <Flex
      height="calc(100svh - 81px)"
      minHeight="800px"
      alignItems="center"
      justifyContent="center"
      gap="50px"
      flexDirection={'column'}
    >
      <Image src="/assets/recover.png" alt="recover image" />
      <Flex flexDirection={'column'} textAlign={'center'} gap={'10px'}>
        <Typography variant="H1">
          Lost your password? <br />
          Enter your details to recover.
        </Typography>
        <Typography variant="Regular" color="#8083A3">
          Enter your details to proceed further
        </Typography>
      </Flex>
      <Flex flexDirection={'column'} gap={'35px'} width={'420px'}>
        <TextInput
          title="Email"
          placeholder="Enter your email"
          iconElement={MdEmail}
        />
        <Button variant="Filled">Recover</Button>
      </Flex>
    </Flex>
  );
}
