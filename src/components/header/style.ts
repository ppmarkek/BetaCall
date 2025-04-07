import { Box, Flex, PopoverContent } from '@chakra-ui/react';
import styled from '@emotion/styled';

export const LeftNavigatior = styled(Flex)<{ bigWidth?: boolean }>`
  position: absolute;
  height: 100svh;
  width: ${({ bigWidth }) => (bigWidth ? '270px' : '85px')};
  left: 0;
  flex-direction: column;
  justify-content: center;
  border-right: 1px solid #eceef5;
  min-height: 800px;
  overflow: hidden;
  transition: all 0.3s;
  .activeIcon {
    border-color: #eceef5;
  }
  .activeBigBox {
    background: #f8f9fc;
  }
`;

export const Navigatior = styled(Flex)`
  width: 100%;
  height: 85px;
  border-bottom: 1px solid #eceef5;
  justify-content: space-between;
  align-items: center;
  padding: 0px 30px;
`;

export const IconBox = styled(Flex)`
  position: absolute;
  gap: 22px;
  top: 20px;
  left: 22px;
`;

export const StyledIconBox = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin: 0px 22px;
  border: 1px solid #fff;
  border-radius: 8px;
  background: #fff;
  transition: all 0.3s;
`;

export const StyledIconBigBox = styled(Flex)`
  align-items: center;
  height: 70px;
  width: 270px;
  overflow: hidden;
  transition: all 0.3s ease;
  p {
    transition: all 0.3s ease;
  }
  :hover p {
    color: #1a1c1d;
  }
  :hover .iconBox {
    border-color: #eceef5;
  }
`;

export const MenuIcon = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 40px;
  height: 40px;
  border: 1px solid #eceef5;
  border-radius: 8px;
  transition: all 0.3s;
  cursor: pointer;
  :hover {
    background: #eceef5;
  }
`;

export const StyledIconHeader = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 40px;
  height: 40px;
  border: 1px solid #eceef5;
  border-radius: 8px;
  transition: all 0.3s;
  cursor: pointer;
  svg {
    fill: #8083a3;
    transition: all 0.3s;
  }

  :hover {
    background: #eceef5;
    svg {
      fill: #6b59cc;
    }
  }
`;

export const BorderBox = styled(Box)<{ bigMenu?: boolean }>`
  width: 15px;
  height: 2px;
  background: ${({ bigMenu }) => (bigMenu ? '#6B59CC' : '#8083a3')};
  ::after {
    content: ' ';
    position: absolute;
    top: 13px;
    width: 15px;
    height: 2px;
    transform: ${({ bigMenu }) => (bigMenu ? 'translateX(2px)' : 'none')};
    background: ${({ bigMenu }) => (bigMenu ? '#6B59CC' : '#8083a3')};
  }
  ::before {
    content: ' ';
    position: absolute;
    bottom: 13px;
    width: 15px;
    height: 2px;
    background: ${({ bigMenu }) => (bigMenu ? '#6B59CC' : '#8083a3')};
    transform: ${({ bigMenu }) => (bigMenu ? 'translateX(-2px)' : 'none')};
  }
`;

export const SearchIcon = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 40px;
  height: 40px;
  border: 1px solid #eceef5;
  border-radius: 8px;
  transition: all 0.3s;
  cursor: pointer;
  :hover {
    background: #eceef5;
  }
`;

export const SearchBarContainer = styled(Flex)<{ $active: boolean }>`
  position: absolute;
  right: 0;
  border: 1px solid #eceef5;
  background: ${({ $active }) => ($active ? '#ECEEF5' : '#fff')};
  border-radius: 9px;
  padding-left: ${({ $active }) => ($active ? '20px' : '0')};
  transition:
    width 0.3s ease,
    padding-left 0.3s ease,
    background-color 0.3s ease;
  width: ${({ $active }) => ($active ? '570px' : '40px')};
  height: 40px;
  cursor: pointer;

  .icon-container {
    position: absolute;
    width: 20px;
    height: 20px;
    right: 9px;
    top: 50%;
    transform: translateY(-50%);
  }

  input {
    width: calc(100% - 40px);
    display: ${({ $active }) => ($active ? 'block' : 'none')};
    border: none;
    outline: none;
    background: transparent;
    font-size: 14px;
    color: #1a1c1d;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    ::placeholder {
      color: #1a1c1d;
    }
  }
`;

export const StyledPopoverContent = styled(PopoverContent)`
  position: absolute;
  padding: 10px;
  right: 0;
  top: 50px;
  width: auto;
`;

export const MessagesHeader = styled(Flex)`
  padding-left: 30px;
  justify-content: space-between;
  width: calc(80% - 80px);
`;

export const BorderPadding = styled(Box)`
  margin: 0px 20px;
  border-right: 1px solid #eceef5;
  height: 25px;
`;
