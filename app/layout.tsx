import React from 'react';
import { SessionProvider } from '../client-wrapped/next-auth';
import { CacheProvider, ChakraProvider } from '../client-wrapped/chakra';

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <head>
        <title>Next.js</title>
      </head>
      <body>
        <SessionProvider>
          <CacheProvider>
            <ChakraProvider>{children}</ChakraProvider>
          </CacheProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
