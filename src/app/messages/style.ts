import { Box, Button, Flex } from '@chakra-ui/react';
import styled from '@emotion/styled';

export const Wrapper = styled(Flex)`
  height: calc(100svh - 85px);
  min-height: 700px;
`;

export const LeftPanel = styled(Flex)`
  flex-direction: column;
  justify-content: space-between;
  padding: 20px 15px;
  width: 20%;
  border-right: 1px solid #eceef5;

  .active {
    background: #f8f9fc;

    svg {
      fill: #6b59cc;
    }

    .titleText {
      color: #6b59cc;
    }
  }
`;

export const BorderBox = styled(Box)`
  margin: 15px;
  border-bottom: 1px solid #eceef5;
`;

export const LeftPanelButton = styled(Button)`
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;
  width: 100%;
  height: 70px;
  background: #fff;
  border-radius: 6px;
  transition: all 0.3s;

  svg {
    fill: #8083a3;
    transition: fill 0.3s;
  }

  .titleText {
    color: #1a1c1d;
    transition: color 0.3s;
  }

  :hover {
    background: #f8f9fc;

    svg {
      fill: #6b59cc;
    }

    .titleText {
      color: #6b59cc;
    }
  }
`;
