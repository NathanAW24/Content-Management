// @ts-nocheck
import 'antd/dist/antd.css';

import { UserProvider } from '@auth0/nextjs-auth0';
import '../styles/globals.css';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Head>
        <title>Adswift Dashboard</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default MyApp;
