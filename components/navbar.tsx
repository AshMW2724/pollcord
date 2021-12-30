import type DiscordUser from '@/types/user';
import { Box, Button, Container, Flex, Heading, Icon, Text } from '@chakra-ui/react';
import Brand from '@/components/brand';
import { CgLogOut } from 'react-icons/cg';
import NextLink from 'next/link';

export default function Navbar(props: { user: DiscordUser | null }) {
  const { user } = props;
  return (
    <>
      <Box bg="white" borderBottom="1px solid" borderColor="gray.200" py={3} px={4}>
        <Container maxW="6xl">
          <Flex align="center" justify="space-between">
            <NextLink href="/">
              <Heading fontSize="2xl" cursor="pointer">
                <Brand />
              </Heading>
            </NextLink>
            {user ? (
              <Flex align="center">
                <Text fontWeight="bold">{user.username}</Text>
                <Button size="sm" fontSize="md" px={2} as="a" href="/api/logout" ms={3}>
                  <Icon as={CgLogOut} />
                </Button>
              </Flex>
            ) : null}
          </Flex>
        </Container>
      </Box>
    </>
  );
}
