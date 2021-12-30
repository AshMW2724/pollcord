import Navbar from '@/components/navbar';
import { GetServerSideProps } from 'next';
import type DiscordUser from '@/types/user';
import { parseUser } from '@/utils/parse-user';
import {
  Container,
  Heading,
  Box,
  Grid,
  Text,
  Icon,
  Flex,
  Button,
  Divider,
  Skeleton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  InputGroup,
  useToast,
  InputRightAddon,
} from '@chakra-ui/react';
import Repeat from '@/components/repeat';
import { useEffect, useState, useRef } from 'react';
import type Poll from '@/types/poll';
import { MdDelete } from 'react-icons/md';
import axios from 'axios';
import NextLink from 'next/link';

interface Props {
  user: DiscordUser | null;
}

export default function Dashboard(props: Props) {
  const { user } = props;
  const [polls, setPolls] = useState<Poll[] | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [mutate, setMutate] = useState<boolean>(true);

  useEffect(() => {
    axios
      .get('/api/poll/mine')
      .then((e) => setPolls(e.data.polls))
      .catch((e) => {
        console.log(e);
      });
  }, [mutate]);

  return (
    <>
      <Navbar user={user} />
      <Box bg="white" borderBottom="1px solid" borderColor="gray.200">
        <Container maxW="6xl" py={10}>
          <Flex align="center" justify="space-between">
            <Heading size="2xl" fontFamily="'Russo One', sans-serif">
              Dashboard
            </Heading>
            <Button colorScheme="brand" px={8} onClick={onOpen}>
              New Poll
            </Button>
          </Flex>
        </Container>
      </Box>
      <Container maxW="6xl" py={10}>
        <Grid templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)', 'repeat(3, 1fr)', 'repeat(4, 1fr)']} gap={4}>
          {polls ? (
            polls
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              .sort((a, b) => b.open - a.open)
              .map((poll: Poll, i: number) => (
                <Box bg="white" border="1px solid" borderColor="gray.200" rounded="md" shadow="sm" key={i}>
                  <Box p={6}>
                    <Heading size="md">
                      {poll.name}{' '}
                      {!poll.open ? (
                        <Text color="red.500" fontSize="sm" as="span">
                          (Closed)
                        </Text>
                      ) : null}
                    </Heading>
                  </Box>
                  <Divider />
                  <Box px={6} py={2.5} fontSize="sm">
                    {poll.options.length} Options
                  </Box>
                  <Divider />
                  <Box px={6} py={2.5} fontSize="sm">
                    {poll.inputs.length} Participants
                  </Box>
                  <NextLink href={`/poll/${poll.id}`} passHref>
                    <Button w="full" colorScheme="green" roundedTop={0} as="a">
                      View
                    </Button>
                  </NextLink>
                </Box>
              ))
          ) : (
            <Repeat amount={8}>
              <Box bg="white" border="1px solid" borderColor="gray.200" rounded="md" shadow="sm">
                <Skeleton py={20} roundedBottom={0} />
                <Button display="block" w="full" colorScheme="green" roundedTop={0} isDisabled>
                  Loading...
                </Button>
              </Box>
            </Repeat>
          )}
          {polls?.length === 0 ? <Text>No polls :(</Text> : null}
        </Grid>
      </Container>
      <Create isOpen={isOpen} onClose={onClose} setMutate={setMutate} mutate={mutate} />
    </>
  );
}

export function Create({
  isOpen,
  onClose,
  setMutate,
  mutate,
}: {
  isOpen: boolean;
  onClose: () => void;
  setMutate: (mutate: boolean) => void;
  mutate: boolean;
}) {
  const toast = useToast();
  const initialRef = useRef(null);
  const [options, setOptions] = useState<string[]>([]);
  const [nameInput, setNameInput] = useState<string>('');
  const [promptInput, setPromptInput] = useState<string>('');
  const [optionInput, setOptionInput] = useState<string>('');
  return (
    <>
      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Poll</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input ref={initialRef} placeholder="Awesome Poll" onChange={(e) => setNameInput(e.target.value)} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Prompt</FormLabel>
              <Input placeholder="Why are we still here?" onChange={(e) => setPromptInput(e.target.value)} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Add Option</FormLabel>
              <InputGroup>
                <Input placeholder="Yes" value={optionInput} onChange={(e) => setOptionInput(e.target.value)} />
                <InputRightAddon
                  as={Button}
                  onClick={() => {
                    if (optionInput.length === 0) return;
                    setOptions([...options, optionInput]);
                    setOptionInput('');
                  }}
                >
                  Add
                </InputRightAddon>
              </InputGroup>
            </FormControl>
            {options.map((option: string, i: number) => (
              <Flex key={i} justify="space-between" align="center" mt={2}>
                {option}
                <Button
                  size="sm"
                  fontSize="lg"
                  px={2}
                  onClick={() => setOptions(options.slice(0, i).concat(options.slice(i + 1, options.length)))}
                >
                  <Icon as={MdDelete} />
                </Button>
              </Flex>
            ))}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="green"
              mr={3}
              onClick={() => {
                if (!nameInput)
                  return toast({
                    description: 'Name is missing!',
                    status: 'error',
                    duration: 1000,
                    isClosable: true,
                  });
                if (!promptInput || promptInput.length < 5)
                  return toast({
                    description: 'Prompt is missing or too short!',
                    status: 'error',
                    duration: 1000,
                    isClosable: true,
                  });
                if (options.length < 2)
                  return toast({
                    description: 'Too few options!',
                    status: 'error',
                    duration: 1000,
                    isClosable: true,
                  });
                if (options.length > 10)
                  return toast({
                    description: 'Too many options!',
                    status: 'error',
                    duration: 1000,
                    isClosable: true,
                  });
                axios
                  .post('/api/poll/create', { name: nameInput, prompt: promptInput, options })
                  .then(() => {
                    toast({
                      title: 'Success',
                      description: "We've created your new poll!",
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
                      description: "We're unable to create your poll :(",
                      status: 'error',
                      duration: 9000,
                      isClosable: true,
                    })
                  );
              }}
            >
              Create
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async function (ctx) {
  const user = parseUser(ctx);
  if (!user) return { props: { user: null } };
  return { props: { user, loggedIn: true } };
};
