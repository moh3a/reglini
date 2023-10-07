/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

import {
  BG_TRANSPARENT_BACKDROP,
  PADDING,
  ROUNDED,
  SHADOW,
} from "~/config/design";
import { APP_NAME } from "~/config/constants";
import {
  AliExpressLogo,
  Button,
  Loading,
  Title,
  Banner,
} from "~/components/shared";
import { api } from "~/utils/api";
import type { IMessage } from "~/types/index";

const Wishlist = () => {
  const { data: session } = useSession();
  const t = useTranslations("AccountPage");

  const [message, setMessage] = useState<IMessage>();
  const wishlist = api.wishlist.get.useQuery();
  const deleteMutation = api.wishlist.delete.useMutation();
  const utils = api.useContext();

  const deleteHandler = async (id: string) => {
    await deleteMutation.mutateAsync(
      { id },
      {
        onSettled(data, error) {
          if (error) setMessage({ type: "error", text: error.message });
          if (data) {
            if (data.success)
              setMessage({ type: "success", text: data.message });
            else setMessage({ type: "error", text: data.error });
            void utils.wishlist.invalidate();
          }
          setTimeout(() => {
            setMessage({ type: undefined, text: undefined });
          }, 5000);
        },
      },
    );
  };

  return (
    <>
      <Head>
        <title>
          {`${session?.user?.name && `${session.user.name}'s`} ${t(
            "wishlist",
          )} | ${APP_NAME}`}
        </title>
      </Head>
      <div className="mb-10">
        <Title center={true} title={t("wishlist")} />
        {wishlist.isLoading && (
          <div className="flex w-full items-center justify-center">
            <Loading size="medium" />
          </div>
        )}
        {wishlist.data?.wishlist && wishlist.data?.wishlist.length === 0 && (
          <p className="text-center font-mono text-sm font-bold">
            {t("empty")}
          </p>
        )}
        {message?.type && (
          <Banner type={message?.type} message={message?.text} />
        )}
        <div className="my-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {wishlist.data?.wishlist?.map((item) => (
            <div
              key={item.id}
              className={`mx-auto max-w-xs overflow-hidden ${BG_TRANSPARENT_BACKDROP} ${ROUNDED} ${SHADOW} ${PADDING} flex flex-col justify-between `}
            >
              <div>
                <h1>
                  <AliExpressLogo width={100} />
                </h1>
                <p className={`text-sm`}>{item.name}</p>
                <p className={`text-xs font-extrabold text-aliexpress`}>
                  {t("price", { price: item.price })}
                </p>
                <img
                  className={`my-1 h-48 w-full object-cover ${ROUNDED} `}
                  src={item.imageUrl}
                  alt={item.name}
                />
              </div>
              <div className="flex items-center justify-between text-xs">
                <p className="font-bold">
                  {item.date.toISOString().substring(0, 10)}
                </p>
                <div className="flex space-x-1">
                  <div>
                    <Button
                      variant="solid"
                      onClick={() => void deleteHandler(item.id)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <Link href={`/aliexpress/product/${item.id}`}>
                      <Button variant="outline">
                        <span className="sr-only">view item&apos; details</span>
                        {t("viewDetails")}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Wishlist;
