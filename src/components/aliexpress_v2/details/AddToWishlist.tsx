import { Dispatch, SetStateAction } from "react";
import { useSession } from "next-auth/react";
import { HeartIcon } from "@heroicons/react/24/solid";

import Button from "@components/shared/Button";
import { trpc } from "@utils/trpc";
import { DS_ProductAPI_Product_Details } from "@reglini-types/ae";

interface AddToWishlistProps {
  product: DS_ProductAPI_Product_Details;
  setMessage: Dispatch<
    SetStateAction<
      | {
          type?: "success" | "warning" | "error" | undefined;
          text?: string | undefined;
        }
      | undefined
    >
  >;
}

const AddToWishlist = ({ product, setMessage }: AddToWishlistProps) => {
  const { status } = useSession();
  const wishlistMutation = trpc.wishlist.add.useMutation();

  const wishlistHandler = async () => {
    if (status === "unauthenticated") {
      setTimeout(() => {
        setMessage({ type: undefined, text: undefined });
      }, 3000);
      setMessage({
        type: "error",
        text: "You should be logged in to do this action.",
      });
    }
    if (status === "authenticated") {
      await wishlistMutation.mutateAsync(
        {
          id: product.product_id.toString(),
          name: product.subject,
          price: parseFloat(product.item_offer_site_sale_price),
          imageUrl: product.image_u_r_ls.split(";")[0],
        },
        {
          onSettled(data, error, variables, context) {
            if (error) setMessage({ type: "error", text: error.message });
            if (data) {
              if (!data.success)
                setMessage({ type: "error", text: data.error });
              else setMessage({ type: "success", text: data.message });
            }
          },
        }
      );
    }
  };

  return (
    <Button
      icon={<HeartIcon className="h-5 w-5 inline mr-1" aria-hidden="true" />}
      onClick={() => wishlistHandler()}
      variant="outline"
      type="button"
    >
      Wishlist
    </Button>
  );
};

export default AddToWishlist;
