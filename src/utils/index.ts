import { ACCOUNT_TYPE, AUTH_PROVIDER } from "@prisma/client";
import { ISession } from "../types";

export const USER_FROM_TRPC_CTX = (session: ISession | null) => {
  return {
    email: session?.user?.email!,
    account:
      session?.user?.type === "credentials"
        ? ACCOUNT_TYPE.CREDENTIALS
        : ACCOUNT_TYPE.OAUTH,
    provider:
      session?.user?.provider === "facebook"
        ? AUTH_PROVIDER.FACEBOOK
        : session?.user?.provider === "google"
        ? AUTH_PROVIDER.GOOGLE
        : undefined,
  };
};

export const GetPrice = (
  currency: number,
  commission: number,
  amount: number
) => {
  if (currency && commission) {
    return (
      Math.ceil((amount * currency + amount * currency * commission) / 10) * 10
    );
  } else {
    return 0;
  }
};
