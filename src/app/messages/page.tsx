'use client';

import { Box, Flex, Icon } from '@chakra-ui/react';
import { MdDelete } from 'react-icons/md';
import { FaFolder } from 'react-icons/fa';
import { IoMdStar, IoMdAlarm } from 'react-icons/io';
import { BorderBox, LeftPanel, LeftPanelButton, Wrapper } from './style';
import Typography from '@/components/typography/typography';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function MessagesPage() {
  const searchParams = useSearchParams();
  const menu = searchParams.get('menu');
  const [selectMenu, setSelectMenu] = useState(menu || 'All Inbox');

  useEffect(() => {
    if (menu && menu !== selectMenu) {
      setSelectMenu(menu);
    }
  }, [menu, selectMenu]);

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

  const updateSearchParam = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('menu', value);
    window.history.replaceState(null, '', `/messages?${params.toString()}`);
  };

  return (
    <Wrapper>
      <LeftPanel>
        <Box>
          {leftButtonsArray.map((item, len) => (
            <Box
              key={item.title}
              onClick={() => {
                setSelectMenu(item.title);
                updateSearchParam(item.title);
              }}
            >
              <LeftPanelButton
                className={selectMenu === item.title ? 'active' : ''}
              >
                <Icon as={item.icon} />
                <Flex flexDirection="column" alignItems="flex-start">
                  <Typography variant="H5" className="titleText">
                    {item.title}
                  </Typography>
                  <Typography color="#8083A3">{item.label}</Typography>
                </Flex>
              </LeftPanelButton>
              {len !== leftButtonsArray.length - 1 && <BorderBox />}
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
