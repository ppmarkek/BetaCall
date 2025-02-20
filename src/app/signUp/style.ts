import { Flex } from '@chakra-ui/react';
import styled from '@emotion/styled';

export const Wrapper = styled(Flex)`
  width: 420px;
  flex-direction: column;
  text-align: center;
  gap: 50px;
`;

export const StyledCheckbox = styled.input`
  -webkit-appearance: none;
  background: #f0f0f3;
  appearance: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  cursor: pointer;
  position: relative;
  outline: none;

  &:checked {
    background: #6b59cc;
  }

  &:checked::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #fff;
  }
`;

export const BoxOr = styled(Flex)`
  width: 190px;
  align-items: center;
  justify-content: center;
  position: relative;

  ::before {
    content: '';
    width: 70px;
    position: absolute;
    top: 50%;
    left: 0;
    border-bottom: 1px solid #eeeeee;
  }

  ::after {
    content: '';
    width: 70px;
    position: absolute;
    top: 50%;
    right: 0;
    border-bottom: 1px solid #eeeeee;
  }
`;
