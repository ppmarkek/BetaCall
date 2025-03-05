import { ReactElement, FC } from 'react';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { render, RenderOptions } from '@testing-library/react';

const Wrapper: FC<{ children: React.ReactNode }> = ({ children }) => (
  <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
);

const customRender = (ui: ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: Wrapper, ...options });

export * from '@testing-library/react';
export { customRender as render };
