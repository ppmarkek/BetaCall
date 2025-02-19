import { Button } from '@chakra-ui/react';
import styled from '@emotion/styled';

export const FilledButton = styled(Button)<{
  bgColor?: string;
  textColor?: string;
}>`
  padding: 12px 30px;
  border-radius: 10px;
  border: 1px solid ${({ bgColor }) => bgColor || '#6B59CC'};
  background: ${({ bgColor }) => bgColor || '#6B59CC'};
  color: ${({ textColor }) => textColor || '#fff'};
  transition: all 0.3s;
  cursor: pointer;
  :hover {
    background: unset;
    color: ${({ bgColor }) => bgColor || '#6B59CC'};
  }
`;

export const OutlineButton = styled(Button)<{
  bgColor?: string;
  textColor?: string;
}>`
  padding: 12px 30px;
  border-radius: 10px;
  border: 1px solid ${({ bgColor }) => bgColor || '#6B59CC'};
  background: unset;
  color: ${({ textColor }) => textColor || '#fff'};
  transition: all 0.3s;
  cursor: pointer;
  :hover {
    background: ${({ textColor }) => textColor || '#fff'};
    color: ${({ bgColor }) => bgColor || '#6B59CC'};
  }
`;
