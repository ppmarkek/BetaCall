import { Flex } from '@chakra-ui/react';
import styled from '@emotion/styled';
import Link from 'next/link';

export const Wrapper = styled(Flex)`
  width: 420px;
  flex-direction: column;
  text-align: center;
  align-items: center;
  gap: 50px;
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
