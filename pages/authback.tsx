import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import Script from 'next/script';
import Brand from '@/components/brand';

export default function AuthBack() {
  const { error, success } = useRouter().query;
  if (success) {
    return (
      <>
        <Script id="success">{`window.close()`}</Script>
        <Button colorScheme="green" onClick={() => window.close()} m={1}>
          Close Window
        </Button>
      </>
    );
  }
  if (error)
    return (
      <Flex direction="column" minH="100vh">
        <Box bg="white" p={4} borderBottom="1px solid" borderColor="gray.300">
          <Heading size="md">
            <Brand />
          </Heading>
        </Box>
        <Flex bg="gray.100" flex={1} p={4} align="center" justify="center" direction="column">
          <Heading color="red.600">An Error Occurred</Heading>
          <Text align="center" fontWeight="500">
            An error occurred during the authentication process. Please try again or contact an administrator
          </Text>
        </Flex>
        <Flex bg="white" p={4} justify="space-between" align="center" borderTop="1px solid" borderColor="gray.300">
          <Button mx={4} variant="link" onClick={() => window.close()}>
            Cancel
          </Button>
          <Button as="a" colorScheme="brand" href="/api/oauth">
            Try Again
          </Button>
        </Flex>
      </Flex>
    );
  return (
    <Flex align="center" justify="center" direction="column" minH="100vh">
      <Heading mb={10} color="white">
        Loading...
      </Heading>
    </Flex>
  );
}
