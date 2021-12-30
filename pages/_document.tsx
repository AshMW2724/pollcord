import { ColorModeScript } from '@chakra-ui/react';
import NextDocument, { Html, Head, Main, NextScript } from 'next/document';
import theme from '@/utils/theme';
export default class Document extends NextDocument {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta property="og:title" content="Pollcord" />
          <meta name="twitter:title" content="Pollcord" />
          <meta name="theme-color" content="#6B7BE7" />
          <meta name="og:image" content="/meta.png" />
          <meta name="twitter:image" content="/meta.png" />
          <meta property="og:description" content="Create polls integrated with Discord" />
          <meta name="description" content="Create polls integrated with Discord" />
          <meta property="twitter:description" content="Create polls integrated with Discord" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
          <link href="https://fonts.googleapis.com/css2?family=Russo+One&display=swap" rel="stylesheet" />
        </Head>
        <body>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
