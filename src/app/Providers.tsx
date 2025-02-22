'use client';

import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
    </GoogleOAuthProvider>
  );
}
