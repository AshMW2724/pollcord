import { GetServerSideProps } from 'next';
import type DiscordUser from '@/types/user';
import { parseUser } from '@/utils/parse-user';
import NextLink from 'next/link';
import { Spinner, Flex, Button, Link } from '@chakra-ui/react';
import { useState } from 'react';
import Popout from 'react-popout';

interface Props {
  user: DiscordUser | null;
}

export default function Index(props: Props) {
  const { user } = props;
  const [showPopout, setShowPopout] = useState(false);
  const [reloading, setReloading] = useState(false);

  return (
    <h1>
      {user ? (
        <>
          Hey, {user.username}#{user.discriminator}
          {user.id}{' '}
          <NextLink href="/api/logout" passHref>
            <Link>Logout</Link>
          </NextLink>
        </>
      ) : (
        <>
          <Button
            onClick={() => {
              setShowPopout(true);
            }}
          >
            Login
          </Button>
          {showPopout && (
            <>
              <Popout
                url="/api/oauth"
                title="Window title"
                onClosing={() => {
                  setReloading(true);
                  window.location.reload();
                }}
                options={{ height: 700, width: 450 }}
              />
              <Flex
                bg="blackAlpha.600"
                position="fixed"
                w="100vw"
                h="100vh"
                top={0}
                align="center"
                justify="center"
                color="white"
                fontSize="xl"
              >
                {!reloading ? 'Please continue in the popout window.' : <Spinner thickness="4px" size="xl" />}
              </Flex>
            </>
          )}
        </>
      )}
    </h1>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async function (ctx) {
  const user = parseUser(ctx);
  if (!user) return { props: { user: null } };
  return { props: { user, loggedIn: true } };
};
