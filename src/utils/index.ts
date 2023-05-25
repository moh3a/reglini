import { ACCOUNT_TYPE, AUTH_PROVIDER } from "@prisma/client";
import { ISession } from "../types";

export const USER_FROM_TRPC_CTX = (session: ISession | null) => {
  let email =
    session && session.user && session.user.email ? session.user.email : "";
  let account =
    session && session.user && session.user.type === "credentials"
      ? ACCOUNT_TYPE.CREDENTIALS
      : ACCOUNT_TYPE.OAUTH;

  let provider: "FACEBOOK" | "GOOGLE" | undefined = undefined;
  if (account === "OAUTH" && session && session.user) {
    if (session.user.provider === "facebook") provider = AUTH_PROVIDER.FACEBOOK;
    else if (session.user.provider === "google")
      provider = AUTH_PROVIDER.GOOGLE;
    else provider = undefined;
  }

  return {
    email,
    account,
    provider,
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
