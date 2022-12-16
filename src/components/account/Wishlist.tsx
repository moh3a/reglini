/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Link from "next/link";
import { TrashIcon } from "@heroicons/react/24/outline";

import { PADDING, ROUNDED, SHADOW } from "@config/design";
import AliExpressLogo from "@components/shared/AliExpressLogo";
import Button from "@components/shared/Button";
import Loading from "@components/shared/Loading";
import Title from "@components/shared/Title";
import Banner from "@components/shared/Banner";
import { trpc } from "@utils/trpc";

const Wishlist = () => {
  const [message, setMessage] = useState<{
    type?: "success" | "error";
    text?: string;
  }>({ type: undefined, text: undefined });
  const wishlist = trpc.wishlist.get.useQuery();
  const deleteMutation = trpc.wishlist.delete.useMutation();
  const utils = trpc.useContext();

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
            utils.wishlist.invalidate();
          }
          setTimeout(() => {
            setMessage({ type: undefined, text: undefined });
          }, 5000);
        },
      }
    );
  };

  return (
    <div className="mb-10">
      <Title title="Wishlist" />
      {wishlist.isLoading && (
        <div className="w-full flex justify-center items-center">
          <Loading size="medium" />
        </div>
      )}
      {wishlist.data?.wishlist && wishlist.data?.wishlist.length === 0 && (
        <p className="font-bold font-mono text-sm text-center">Such empty!</p>
      )}
      {message.type && <Banner type={message?.type} message={message?.text} />}
      <div className="my-8 grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {wishlist.data?.wishlist &&
          wishlist.data?.wishlist.map((item) => (
            <div
              key={item.id}
              className={`max-w-xs mx-auto overflow-hidden bg-black/5 dark:bg-black/50 ${ROUNDED} ${SHADOW} ${PADDING} `}
            >
              <div>
                <h1>
                  <AliExpressLogo width={100} />
                </h1>
                <p className={`text-sm`}>{item.name}</p>
                <p className={`text-xs font-extrabold text-aliexpress`}>
                  {item.price} DZD
                </p>
              </div>
              <img
                className={`object-cover w-full h-48 my-1 ${ROUNDED} `}
                src={item.imageUrl}
                alt={item.name}
              />
              <div className="text-xs flex items-center justify-between">
                <p className="font-bold">
                  {item.date.toISOString().substring(0, 10)}{" "}
                  {item.date.toISOString().substring(11, 16)}
                </p>
                <div className="space-x-1">
                  <Button
                    variant="solid"
                    onClick={() => deleteHandler(item.id)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                  <Link href={`/aliexpress/product/${item.id}`}>
                    <Button variant="outline">View Details</Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Wishlist;
