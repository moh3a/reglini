import {
  ArrowLeftOnRectangleIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import { GetStaticProps } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Link from "next/link";

import Button from "@components/shared/Button";
import Logo from "@components/shared/Logo";

const AuthPage = () => {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") router.replace("/");
  }, [router, status]);

  return (
    <div className="w-full flex justify-center items-center">
      <div className="flex-1 flex justify-center items-center">
        <Logo height={200} width={200} />
      </div>
      <div className="flex-1 flex justify-center items-center">
        <div>
          <div>
            <Link href="/auth/login">
              <Button
                variant="outline"
                icon={
                  <ArrowLeftOnRectangleIcon
                    className="inline w-5 h-5 mr-1"
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
                    className="inline w-5 h-5 mr-1"
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

import { pick } from "lodash";
const namespaces = ["AuthPage", "Common"];
export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      messages: pick(
        (await import(`../../../messages/${locale}.json`)).default,
        namespaces
      ),
    },
  };
};

import Layout from "@components/layout/Layout";
AuthPage.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default AuthPage;
