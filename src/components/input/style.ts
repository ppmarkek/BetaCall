import { Flex, Input } from '@chakra-ui/react';
import { IconType } from 'react-icons';
import styled from '@emotion/styled';

export const InputBox = styled(Flex)`
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
  position: relative;
`;

export const StyledInput = styled(Input)<{
  icon?: IconType;
  color: string;
}>`
  padding: 20px 0px;
  padding-left: 0px;
  padding-right: ${({ icon }) => (icon ? '25px' : '0px')};
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
