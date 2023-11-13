import "../styles/globals.css";
import { useEffect } from "react";
import type { AppType } from "next/dist/shared/lib/utils";
import { useRouter } from "next/router";
import Head from "next/head";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import {
  NextIntlProvider,
  IntlErrorCode,
  type IntlError,
  type AbstractIntlMessages,
} from "next-intl";
import nProgress from "nprogress";

import { api } from "~/utils/api";
import { APP_NAME } from "~/config/constants";
import Layout from "~/components/layout/Layout";

const MyApp: AppType<{
  session: Session | null;
  messages: AbstractIntlMessages | undefined;
}> = ({ Component, pageProps: { session, messages, ...pageProps } }) => {
  const router = useRouter();
  useEffect(() => {
    nProgress.configure({
      showSpinner: false,
      easing: "ease",
      speed: 250,
    });

    const handleStart = () => {
      nProgress.start();
    };

    const handleStop = () => {
      setTimeout(() => {
        nProgress.done();
      }, 100);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Head>
        <title>{APP_NAME}</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
        />
        <meta
          name="facebook-domain-verification"
          content="tqch8yg7c5a548rbwp8vepozlepnap"
        />
      </Head>
      <NextIntlProvider
        messages={messages}
        onError={() => undefined}
        getMessageFallback={getMessageFallback}
      >
        <ThemeProvider attribute="class">
          <SessionProvider session={session}>
            <Layout {...pageProps}>
              <Component {...pageProps} />
            </Layout>
          </SessionProvider>
        </ThemeProvider>
      </NextIntlProvider>
      <noscript>Enable javascript to run this web app.</noscript>
    </>
  );
};

export default api.withTRPC(MyApp);

function getMessageFallback({
  namespace,
  key,
  error,
}: {
  error: IntlError;
  key: string;
  namespace?: string | undefined;
}) {
  const path = [namespace, key].filter((part) => part != null).join(".");
  if (error.code === IntlErrorCode.MISSING_MESSAGE) {
    return `${path} is not yet translated`;
  } else {
    return `Dear developer, please fix this message: ${path}`;
  }
}
