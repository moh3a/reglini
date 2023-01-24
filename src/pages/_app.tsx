import "../styles/globals.css";
import { NextPage } from "next";
import Head from "next/head";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { NextIntlProvider, IntlErrorCode } from "next-intl";
import { PageTransition } from "next-page-transitions";

import type { AppType } from "next/dist/shared/lib/utils";
import { trpc } from "@utils/trpc";
import { APP_NAME } from "@config/general";
import Loading from "@components/shared/Loading";
import Logo from "@components/shared/Logo";

const TIMEOUT = 200;

const MyApp: AppType<{
  session: Session | null;
}> = ({ Component, pageProps: { session, ...pageProps } }) => {
  const getLayout = (Component as any).getLayout || ((page: NextPage) => page);

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
        messages={(pageProps as any).messages}
        getMessageFallback={getMessageFallback}
      >
        <PageTransition
          timeout={TIMEOUT}
          classNames="page-transition"
          loadingComponent={
            <div className="fixed inset-0 w-screen h-screen flex justify-center items-center bg-opacity-50 backdrop-blur-md">
              <div className="flex">
                <Logo />
                <Loading size="large" />
              </div>
            </div>
          }
          loadingDelay={500}
          loadingTimeout={{
            enter: TIMEOUT,
            exit: 0,
          }}
          loadingClassNames="loading-indicator"
        >
          <ThemeProvider attribute="class">
            <SessionProvider session={session}>
              {getLayout(<Component {...pageProps} />)}
            </SessionProvider>
          </ThemeProvider>
        </PageTransition>
      </NextIntlProvider>
      <noscript>Enable javascript to run this web app.</noscript>
      <style jsx global>{`
        .page-transition-enter {
          opacity: 0;
          transform: translate3d(0, 20px, 0);
        }
        .page-transition-enter-active {
          opacity: 1;
          transform: translate3d(0, 0, 0);
          transition: opacity ${TIMEOUT}ms, transform ${TIMEOUT}ms;
        }
        .page-transition-exit {
          opacity: 1;
        }
        .page-transition-exit-active {
          opacity: 0;
          transition: opacity ${TIMEOUT}ms;
        }
        .loading-indicator-appear,
        .loading-indicator-enter {
          opacity: 0;
        }
        .loading-indicator-appear-active,
        .loading-indicator-enter-active {
          opacity: 1;
          transition: opacity ${TIMEOUT}ms;
        }
      `}</style>
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
