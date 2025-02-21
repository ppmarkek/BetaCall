import { Flex } from '@chakra-ui/react';
import styled from '@emotion/styled';
import Link from 'next/link';

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
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  ::before,
  ::after {
    content: '';
    flex-grow: 1;
    height: 1px;
    background-color: #eeeeee;
  }

  ::before {
    margin-right: 12px;
    max-width: 100px;
  }

  ::after {
    margin-left: 12px;
    max-width: 100px;
  }
`;

export const StyledLink = styled(Link)`
  font-family: 'Lato', sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 19px;
  text-decoration: none;
  color: #6b59cc;
  cursor: pointer;
`;
