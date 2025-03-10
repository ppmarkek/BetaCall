'use client';

import { Box, Flex, Icon } from '@chakra-ui/react';
import { MdDelete } from 'react-icons/md';
import { FaFolder } from 'react-icons/fa';
import { IoMdStar, IoMdAlarm } from 'react-icons/io';
import { BorderBox, LeftPanel, LeftPanelButton, Wrapper } from './style';
import Typography from '@/components/typography/typography';
import { useState } from 'react';

export default function MessagesPage() {
  const [selectMenu, setSelectMenu] = useState('All Inbox');

  const leftButtonsArray = [
    {
      title: 'All Inbox',
      label: 'All messages unified',
      icon: FaFolder,
    },
    {
      title: 'Starred',
      label: 'Selected messages',
      icon: IoMdStar,
    },
    {
      title: 'Snoozed',
      label: 'Will appear later',
      icon: IoMdAlarm,
    },
  ];

  return (
    <Wrapper>
      <LeftPanel>
        <Box>
          {leftButtonsArray.map((value, len) => (
            <Box key={value.title} onClick={() => setSelectMenu(value.title)}>
              <LeftPanelButton className={selectMenu === value.title ? 'active': ''}>
                <Icon as={value.icon} />
                <Flex flexDirection="column" alignItems="flex-start">
                  <Typography variant="H5" className="titleText">
                    {value.title}
                  </Typography>
                  <Typography color="#8083A3">{value.label}</Typography>
                </Flex>
              </LeftPanelButton>
              {len !== 2 && <BorderBox />}
            </Box>
          ))}
        </Box>

        <LeftPanelButton>
          <Icon as={MdDelete} />
          <Flex flexDirection="column" alignItems="flex-start">
            <Typography variant="H5" className="titleText">
              Deleted
            </Typography>
            <Typography color="#8083A3">Removed messages</Typography>
          </Flex>
        </LeftPanelButton>
      </LeftPanel>
    </Wrapper>
  );
}
