import { Box, Button, Flex, Grid } from '@chakra-ui/react';
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

export const AllContacts = styled(Flex)`
  flex-direction: column;
  width: 80%;
  padding: 15px 20px;
`;

export const Contact = styled(Grid)`
  grid-template-columns: 20% 20% 20% 20% 20%;
  align-items: center;
  width: 100%;
  height: 70px;
  padding: 15px;
  border-radius: 12px;
  transition: all 0.3s;
  cursor: pointer;

  :hover {
    box-shadow: rgba(153, 155, 168, 0.3) 0px 2px 8px 0px;
  }
`;


export const ContactGroup = styled(Flex)`
  padding: 10px 15px;
  background: rgba(107, 89, 204, 0.1);
  border-radius: 8px;
  width: fit-content;
`;

export const StyledIcon = styled(Box)`
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