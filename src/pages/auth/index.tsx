import {
  ArrowLeftOnRectangleIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import type { GetStaticProps } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { type ReactElement, useEffect } from "react";
import Link from "next/link";

import { Button, Logo } from "~/components/shared";

const AuthPage = () => {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") void router.replace("/");
  }, [router, status]);

  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex flex-1 items-center justify-center">
        <Logo height={200} width={200} />
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div>
          <div>
            <Link href="/auth/login">
              <Button
                variant="outline"
                icon={
                  <ArrowLeftOnRectangleIcon
                    className="mr-1 inline h-5 w-5"
                    aria-hidden="true"
                  />
                }
              >
                Login
              </Button>
            </Link>
          </div>
          <div>
            <Link href="/auth/register">
              <Button
                variant="outline"
                icon={
                  <UserPlusIcon
                    className="mr-1 inline h-5 w-5"
                    aria-hidden="true"
                  />
                }
              >
                Register
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

import pick from "lodash/pick";
import Layout from "~/components/layout/Layout";
AuthPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

AuthPage.messages = ["AuthPage", Layout.messages].flat();

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      messages: pick(
        await import(`../../../messages/${locale}.json`),
        AuthPage.messages,
      ),
    },
  };
};

export default AuthPage;
