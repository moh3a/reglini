import "../styles/globals.css";
import { NextPage } from "next";
import Head from "next/head";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { NextIntlProvider, IntlErrorCode } from "next-intl";

import type { AppType } from "next/dist/shared/lib/utils";
import { trpc } from "@utils/trpc";
import { APP_NAME } from "@config/general";

const MyApp: AppType<{
  session: Session | null;
}> = ({ Component, pageProps: { session, ...pageProps } }) => {
  const getLayout = (Component as any).getLayout || ((page: NextPage) => page);

  return (
    <>
      <Head>
        <title>{APP_NAME}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="theme-color" content="#1b1f23" />
        <meta
          name="facebook-domain-verification"
          content="tqch8yg7c5a548rbwp8vepozlepnap"
        />
      </Head>
      <NextIntlProvider
        messages={(pageProps as any).messages}
        getMessageFallback={getMessageFallback}
      >
        <ThemeProvider attribute="class">
          <SessionProvider session={session}>
            {getLayout(<Component {...pageProps} />)}
          </SessionProvider>
        </ThemeProvider>
      </NextIntlProvider>
      <noscript>Enable javascript to run this web app.</noscript>
    </>
  );
};

export default trpc.withTRPC(MyApp);

function getMessageFallback({ namespace, key, error }: any) {
  const path = [namespace, key].filter((part) => part != null).join(".");
  if (error.code === IntlErrorCode.MISSING_MESSAGE) {
    return `${path} is not yet translated`;
  } else {
    return `Dear developer, please fix this message: ${path}`;
  }
}
