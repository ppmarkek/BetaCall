'use client';

import { FaUserCircle } from 'react-icons/fa';
import {
  AllContacts,
  BorderBox,
  Contact,
  ContactGroup,
  LeftPanel,
  LeftPanelButton,
  StyledIcon,
  Wrapper,
} from './style';
import { Box, Flex, Icon, Avatar } from '@chakra-ui/react';
import Typography from '@/components/typography/typography';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { BsChatSquareTextFill } from 'react-icons/bs';
import { IoIosMore, IoMdCall } from 'react-icons/io';

export default function ConstactsPage() {
  const searchParams = useSearchParams();
  const menu = searchParams.get('menu');
  const [selectMenu, setSelectMenu] = useState(menu || 'All Contacts');
  const { contacts } = useSelector((state: RootState) => state.user);

  const leftButtonsArray = [
    {
      title: 'All Contacts',
      label: 'All messages unified',
      icon: FaUserCircle,
    },
  ];

  const updateSearchParam = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('menu', value);
    window.history.replaceState(null, '', `/contacts?${params.toString()}`);
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
      </LeftPanel>
      <AllContacts>
        {contacts.map((contact) => (
          <Contact key={contact.id}>
            <Flex gap={'15px'} alignItems={'center'}>
              <Avatar.Root shape="rounded" size="md">
                <Avatar.Fallback
                  name={`${contact.firstName} ${contact.lastName}`}
                />
                <Avatar.Image src={'/previewAvatar.png'} />
              </Avatar.Root>

              <Typography variant="H5" weight="Bold">
                {`${contact.firstName} ${contact.lastName}`}
              </Typography>
            </Flex>

            <Flex justifyContent={'center'}>
              <Typography variant="H5" color="#8083A3">
                {contact.jobName || 'No job name'}
              </Typography>
            </Flex>

            <Flex justifyContent={'center'}>
              <Typography variant="H5" color="#8083A3">
                {contact.contactEmail}
              </Typography>
            </Flex>

            <Flex justifyContent={'center'}>
              <ContactGroup>
                <Typography variant="Regular" weight="Bold" color="#6B59CC">
                  {contact.contactsGroup}
                </Typography>
              </ContactGroup>
            </Flex>

            <Flex justifyContent={'flex-end'} gap={'5px'}>
              <StyledIcon>
                <Icon size={'md'} as={BsChatSquareTextFill} />
              </StyledIcon>
              <StyledIcon>
                <Icon size={'md'} as={IoMdCall} />
              </StyledIcon>
              <StyledIcon>
                <Icon size={'md'} as={IoIosMore} />
              </StyledIcon>
            </Flex>
          </Contact>
        ))}
      </AllContacts>
    </Wrapper>
  );
}
