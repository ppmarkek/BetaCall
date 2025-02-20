import { Button, Flex } from '@chakra-ui/react';
import styled from '@emotion/styled';

export const FilledButton = styled(Button)<{
  bgColor?: string;
  textColor?: string;
  buttonWidth?: string;
}>`
  font-size: 16px;
  font-weight: 700;
  line-height: 20px;
  font-family: 'Lato', sans-serif;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px 30px;
  border-radius: 10px;
  width: ${({ buttonWidth }) => buttonWidth || 'auto'};
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
  buttonWidth?: string;
}>`
  font-size: 16px;
  font-weight: 700;
  line-height: 20px;
  font-family: 'Lato', sans-serif;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px 30px;
  border-radius: 10px;
  width: ${({ buttonWidth }) => buttonWidth || 'auto'};
  border: 1px solid ${({ bgColor }) => bgColor || '#6B59CC'};
  background: unset;
  color: ${({ textColor }) => textColor || '#fff'};
  transition: all 0.3s;
  cursor: pointer;
  :hover {
    background: ${({ textColor }) => textColor || '#fff'};
    color: ${({ bgColor }) => bgColor || '#6B59CC'};
    border: 1px solid #8083a3;
  }
`;

export const LeftIconButton = styled(Button)`
  font-size: 16px;
  font-weight: 700;
  line-height: 20px;
  font-family: 'Lato', sans-serif;
  display: flex;
  justify-content: flex-start;
  padding: 0 15px;
  border-radius: 10px;
  border-top-left-radius: unset;
  border-bottom-left-radius: unset;
  width: calc(100% - 50px);
  height: 50px;
  border: 1px solid #eceef5;
  border-left: unset;
  background: unset;
  color: #8083a3;
  transition: all 0.3s;
  cursor: pointer;
  :hover {
    background: #8083a3;
    color: #eceef5;
    border-color: #8083a3;
  }
`;

export const IconBox = styled(Flex)`
  border: 1px solid #eceef5;
  height: 50px;
  width: 50px;
  border-radius: 10px;
  border-top-right-radius: unset;
  border-bottom-right-radius: unset;
  display: flex;
  align-items: center;
  justify-content: center;
`;
