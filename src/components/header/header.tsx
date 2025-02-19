'use client';

import { Box, Flex, Grid, GridItem, Image, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import Button from '../button/button';
// import Link from 'next/link';
// import Typography from '../typography/typography';

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('token='))
      ?.split('=')[1];

    setIsAuthenticated(!!token);
  }, []);

  return (
    <>
      {!isAuthenticated ? (
        <Box borderBottom={'1px solid #EEEEEE'}>
          <Flex
            padding={'0px 270px'}
            h={'80px'}
            alignItems={'center'}
            justifyContent={'space-between'}
          >
            <Flex alignItems={'center'} gap={'15px'}>
              <Image
                height={'45px'}
                width={'45px'}
                src="favicon.svg"
                alt="Icon"
              />
              <Text fontSize={'28px'}>
                beta
                <b>call</b>
              </Text>
            </Flex>
            <Box>
              <Button variant="Outline" backgound={'#ECEEF5'} color={'#8083A3'}>
                Sign In
              </Button>
            </Box>
          </Flex>
        </Box>
      ) : (
        <header>
          <Grid>
            <GridItem></GridItem>
            <GridItem></GridItem>
          </Grid>
        </header>
      )}
    </>
  );
}
