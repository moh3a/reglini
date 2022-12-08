import "../styles/globals.css";
import { NextPage } from "next";
import Head from "next/head";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";

import type { AppType } from "next/dist/shared/lib/utils";
import { trpc } from "@utils/trpc";
import { APP_DESCRIPTION, APP_NAME } from "@config/general";

const MyApp: AppType<{
  session: Session | null;
  messages: any;
}> = ({ Component, pageProps: { session, messages, ...pageProps } }) => {
  const getLayout = (Component as any).getLayout || ((page: NextPage) => page);

  return (
    <>
      <Head>
        <title>{APP_NAME}</title>
        <meta name="description" content={APP_DESCRIPTION} />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="theme-color" content="#1b1f23" />
      </Head>
      <ThemeProvider attribute="class">
        <SessionProvider session={session}>
          {getLayout(<Component {...pageProps} />)}
        </SessionProvider>
      </ThemeProvider>
      <noscript>Enable javascript to run this web app.</noscript>
    </>
  );
};

export default trpc.withTRPC(MyApp);
