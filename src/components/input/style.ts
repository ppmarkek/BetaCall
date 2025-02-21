import { Flex, Input } from '@chakra-ui/react';
import styled from '@emotion/styled';

export const InputBox = styled(Flex)`
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
  position: relative;

  .input-icon {
    fill: #8083a3;
    transition: fill 0.3s;
  }

  &:focus-within .input-icon:not(.input-icon-error) {
    fill: #1a1c1d;
  }

  .input-icon-error {
    fill: #ff808b;
  }
`;

export const StyledInput = styled(Input, {
  shouldForwardProp: (prop) => prop !== '$icon',
})<{
  $icon?: boolean;
  color: string;
}>`
  padding: 20px 0px;
  padding-left: 0px;
  padding-right: ${({ $icon }) => ($icon ? '25px' : '0px')};
  border: unset;
  border-radius: unset;
  border-bottom: 1px solid #eceef5;
  color: ${({ color }) => color || '#1a1c1d'};
  transition: all 0.3s;

  :focus-visible {
    outline: unset;
    border-bottom: 1px solid #000;
  }
`;
