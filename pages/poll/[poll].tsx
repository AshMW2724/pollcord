import Navbar from '@/components/navbar';
import { GetServerSideProps } from 'next';
import type DiscordUser from '@/types/user';
import { parseUser } from '@/utils/parse-user';
import {
  Container,
  Heading,
  Box,
  Grid,
  Flex,
  Text,
  Button,
  AvatarGroup,
  Avatar,
  useToast,
  Spinner,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import type Poll from '@/types/poll';
import axios from 'axios';
import uniqolor from 'uniqolor';
import chroma from 'chroma-js';
import Popout from 'react-popout';

interface Props {
  user: DiscordUser | null;
  pollId: string;
}

export default function Dashboard(props: Props) {
  const { user, pollId } = props;
  const [poll, setPoll] = useState<Poll | null>(null);
  const [voted, setVoted] = useState<boolean>(false);
  const [mutate, setMutate] = useState<boolean>(true);
  const [reloading, setReloading] = useState<boolean>(false);
  const [showPopout, setShowPopout] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef(null);
  const toast = useToast();
  useEffect(() => {
    axios
      .get('/api/poll/' + pollId)
      .then((e) => setPoll(e.data.polls))
      .catch((e) => {
        console.log(e);
      });
  }, [pollId, mutate]);
  useEffect(() => {
    if (!poll) return;
    if (!poll.open) return setVoted(true);
    if (!user) return;
    if (poll.inputs.find((m: { id: string }) => m.id === user.id)) setVoted(true);
  }, [poll, user]);

  if (!poll) return '...';
  return (
    <>
      <Navbar user={user} />
      <Box bg="white" borderBottom="1px solid" borderColor="gray.200">
        <Container maxW="6xl" py={10}>
          <Flex align="center" justify="space-between">
            <Heading size="2xl" fontFamily="'Russo One', sans-serif">
              {poll.name}{' '}
              {!poll.open ? (
                <Text color="red.500" fontSize="xl" as="span">
                  (Closed)
                </Text>
              ) : null}
            </Heading>
            {user && user.id === poll.owner && poll.open ? (
              <Button colorScheme="red" px={8} onClick={() => setIsOpen(true)}>
                Close Poll
              </Button>
            ) : null}
          </Flex>
        </Container>
      </Box>

      <Container maxW="6xl" pb={10}>
        <Box border="1px solid" borderTop="none" borderColor="gray.200" bg="white" roundedBottom="md" p={8} mb={10}>
          <Heading textAlign="center">{poll.prompt}</Heading>
        </Box>
        <Grid templateColumns={['repeat(1, 1fr)', 'repeat(1, 1fr)', 'repeat(2, 1fr)']} gap={4}>
          {poll.options.map((option: string, i: number) => (
            <Box key={i} bg="white" rounded="lg" pb={voted ? 12 : 0}>
              <Box
                py={20}
                px={5}
                h="full"
                d="flex"
                alignItems="center"
                justifyContent="center"
                bg={uniqolor(option + pollId + poll.prompt).color}
                color="white"
                rounded="lg"
                transition="0.2s"
                // shadow="sm"
                cursor="pointer"
                _hover={{
                  shadow: 'xl',
                  bg: chroma(uniqolor(option + pollId + poll.prompt).color)
                    .darken(0.4)
                    .css(),
                }}
                onClick={() => {
                  if (!user) return setShowPopout(true);
                  if (voted)
                    return toast({
                      title: 'Poll Error',
                      description: "You've already added your input!",
                      status: 'error',
                      duration: 1000,
                      isClosable: true,
                    });
                  axios
                    .post(`/api/poll/${pollId}/input`, { input: i })
                    .then(() => {
                      toast({
                        title: 'Success',
                        description: "We've added your input into the poll!",
                        status: 'success',
                        duration: 9000,
                        isClosable: true,
                      });
                      setMutate(!mutate);
                    })
                    .catch(() =>
                      toast({
                        title: 'Poll Error',
                        description: "We're unable to add your input into the poll :(",
                        status: 'error',
                        duration: 9000,
                        isClosable: true,
                      })
                    );
                }}
              >
                <Heading textAlign="center">
                  {option}
                  {voted ? (
                    <Text as="span" fontWeight="normal" opacity={0.5}>
                      {' '}
                      ({(poll.inputs.filter((m: { input: number }) => m.input === i).length / poll.inputs.length) * 100}
                      %)
                    </Text>
                  ) : null}
                </Heading>
              </Box>
              {voted ? (
                <Box p={2}>
                  <AvatarGroup size="sm" max={10} minH="28px">
                    {poll.inputs
                      .filter((m: { input: number }) => m.input === i)
                      .map(({ id }: { id: string }) => (
                        <Avatar name={id} src={`https://japi.rest/discord/v1/user/${id}/avatar`} key={id} />
                      ))}
                  </AvatarGroup>
                </Box>
              ) : null}
            </Box>
          ))}
        </Grid>
      </Container>
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Close Poll
            </AlertDialogHeader>

            <AlertDialogBody>Are you sure? You can{"'"}t undo this action afterwards.</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  axios
                    .post(`/api/poll/${pollId}/close`)
                    .then(() => {
                      toast({
                        title: 'Success',
                        description: "We've closed your poll!",
                        status: 'success',
                        duration: 9000,
                        isClosable: true,
                      });
                      setMutate(!mutate);
                      onClose();
                    })
                    .catch(() =>
                      toast({
                        title: 'Poll Error',
                        description: "We're unable to close your poll :(",
                        status: 'error',
                        duration: 9000,
                        isClosable: true,
                      })
                    );
                }}
                ml={3}
              >
                Close
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
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
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async function (ctx) {
  const user = parseUser(ctx);
  if (!user) return { props: { user: null, pollId: ctx.query.poll + '' } };
  return { props: { user, pollId: ctx.query.poll + '' } };
};
