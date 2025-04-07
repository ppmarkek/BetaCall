'use client';

import { store } from '@/redux/store';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ReactNode } from 'react';
import { Provider } from 'react-redux';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <Provider store={store}>
        <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
      </Provider>
    </GoogleOAuthProvider>
  );
}
