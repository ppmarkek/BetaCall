'use client';
import { Avatar, Box, Flex, Icon, Image, Text } from '@chakra-ui/react';
import { JSX, memo, useEffect, useRef, useState } from 'react';
import Button from '../button/button';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  BorderBox,
  IconBox,
  LeftNavigatior,
  MenuIcon,
  Navigatior,
  SearchBarContainer,
  StyledIconBigBox,
  StyledIconBox,
} from './style';
import { IoMdHome, IoMdCall, IoMdSettings, IoMdSearch } from 'react-icons/io';
import { BsChatSquareTextFill } from 'react-icons/bs';
import { MdOutlineDevices, MdOutlineScreenShare } from 'react-icons/md';
import { FaUsers, FaRegCalendarAlt } from 'react-icons/fa';
import Typography from '../typography/typography';

const ICONS = [
  { link: '/', title: 'Dashboard', icon: <IoMdHome /> },
  { link: '/messages', title: 'Messenger', icon: <BsChatSquareTextFill /> },
  { link: '/calls', title: 'Calls', icon: <IoMdCall /> },
  { link: '/conference', title: 'Conference', icon: <MdOutlineDevices /> },
  { link: '/contacts', title: 'Contacts', icon: <FaUsers /> },
  {
    link: '/screenshare',
    title: 'Screenshare',
    icon: <MdOutlineScreenShare />,
  },
  { link: '/scheduale', title: 'Scheduale', icon: <FaRegCalendarAlt /> },
  { link: '/settings', title: 'Settings', icon: <IoMdSettings /> },
];

function formatPathname(path: string): string {
  const formatted = path
    .replace(/^\//, '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
  return formatted || 'Dashboard';
}

function checkAuthentication(): boolean {
  if (typeof document !== 'undefined') {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('accessToken='))
      ?.split('=')[1];
    return !!token;
  }
  return false;
}

function useClickOutside<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  handler: () => void
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, handler]);
}

function Brand() {
  return (
    <Flex alignItems="center" gap="15px">
      <Image
        src="/favicon.svg"
        alt="Betacall Icon"
        height="45px"
        width="45px"
      />
      <Text fontSize="28px">
        beta<b>call</b>
      </Text>
    </Flex>
  );
}

type NavigationItem = {
  link: string;
  title: string;
  icon: JSX.Element;
};

interface NavigationLinkProps {
  item: NavigationItem;
  currentPath: string;
  isBigMenu: boolean;
}

function NavigationLink({ item, currentPath, isBigMenu }: NavigationLinkProps) {
  const isActive = currentPath === item.link;
  return (
    <Link href={item.link}>
      <StyledIconBigBox className={isActive && isBigMenu ? 'activeBigBox' : ''}>
        <StyledIconBox className={isActive ? 'activeIcon' : 'iconBox'}>
          <Icon
            fill={isActive ? '#6B59CC' : '#8083A3'}
            width="20px"
            height="20px"
          >
            {item.icon}
          </Icon>
        </StyledIconBox>
        <Typography variant="H5" color={isActive ? '#1A1C1D' : '#8083A3'}>
          {item.title}
        </Typography>
      </StyledIconBigBox>
    </Link>
  );
}

interface UnauthenticatedHeaderProps {
  currentPath: string;
}

function UnauthenticatedHeader({ currentPath }: UnauthenticatedHeaderProps) {
  const isSignIn = currentPath === '/signIn';
  return (
    <Box borderBottom="1px solid #EEEEEE">
      <Flex
        padding="0px 270px"
        height="80px"
        alignItems="center"
        justifyContent="space-between"
      >
        <Brand />
        <Box>
          <Link href={isSignIn ? '/signUp' : '/signIn'}>
            <Button
              height="40px"
              variant="Outline"
              background="#ECEEF5"
              color="#8083A3"
            >
              {isSignIn ? 'Sign Up' : 'Sign In'}
            </Button>
          </Link>
        </Box>
      </Flex>
    </Box>
  );
}

interface AuthenticatedHeaderProps {
  currentPath: string;
  isBigMenu: boolean;
  toggleBigMenu: () => void;
  formattedPath: string;
}

function AuthenticatedHeader({
  currentPath,
  isBigMenu,
  toggleBigMenu,
  formattedPath,
}: AuthenticatedHeaderProps) {
  const [searchActive, setSearchActive] = useState(false);
  const searchRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useClickOutside<HTMLDivElement>(searchRef, () => setSearchActive(false));

  useEffect(() => {
    if (searchActive) {
      inputRef.current?.focus();
    }
  }, [searchActive]);

  return (
    <Flex transition="all 0.3s" marginLeft={isBigMenu ? '270px' : '85px'}>
      <Navigatior>
        <Flex gap="15px" alignItems="center">
          <MenuIcon onClick={toggleBigMenu}>
            <BorderBox bigMenu={isBigMenu} />
          </MenuIcon>
          <Typography variant="H3">{formattedPath}</Typography>
        </Flex>
        <Flex gap="20px" alignItems="center">
          <Box position="relative" width="570px" height="40px">
            <SearchBarContainer
              $active={searchActive}
              ref={searchRef}
              onClick={() => setSearchActive(true)}
            >
              <input ref={inputRef} placeholder="Search..." />
              <Icon
                className="icon-container"
                fill={searchActive ? '#6B59CC' : '#8083A3'}
                fontSize="20px"
                as={IoMdSearch}
              />
            </SearchBarContainer>
          </Box>
          <Avatar.Root cursor="pointer" shape="rounded" size="md">
            <Avatar.Fallback name="Diana Adebayo" />
            <Avatar.Image src="/previewAvatar.png" />
          </Avatar.Root>
        </Flex>
      </Navigatior>
      <LeftNavigatior bigWidth={isBigMenu}>
        <IconBox>
          <Brand />
        </IconBox>
        <Flex flexDirection="column">
          {ICONS.map((item) => (
            <NavigationLink
              key={item.link}
              item={item}
              currentPath={currentPath}
              isBigMenu={isBigMenu}
            />
          ))}
        </Flex>
      </LeftNavigatior>
    </Flex>
  );
}

interface HeaderProps {
  children: React.ReactNode;
}

function Header({ children }: HeaderProps) {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isBigMenu, setIsBigMenu] = useState(false);
  useEffect(() => {
    setIsAuthenticated(checkAuthentication());
  }, []);
  if (isAuthenticated === null) return null;
  const formattedPath = formatPathname(pathname);
  return (
    <>
      <header data-testid="header-testid">
        {!isAuthenticated ? (
          <UnauthenticatedHeader currentPath={pathname} />
        ) : (
          <AuthenticatedHeader
            currentPath={pathname}
            isBigMenu={isBigMenu}
            toggleBigMenu={() => setIsBigMenu((prev) => !prev)}
            formattedPath={formattedPath}
          />
        )}
      </header>
      <Box
        transition="all 0.3s"
        marginLeft={isBigMenu ? '270px' : '85px'}
        padding="60px 50px"
      >
        {children}
      </Box>
    </>
  );
}

export default memo(Header);
