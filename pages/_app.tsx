import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import theme from '@/utils/theme';
import Head from 'next/head';

export default function DustDash({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Head>
        <title>Pollcord</title>
      </Head>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
