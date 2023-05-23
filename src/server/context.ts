import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { getSession } from "next-auth/react";

import prisma from "@config/prisma";
import { ISession } from "@reglini-types/index";
import { ZAPIEX } from "@utils/zapiex";
import { ALIEXPRESS } from "@utils/ae";

export const createContext = async ({
  req,
  res,
}: trpcNext.CreateNextContextOptions) => {
  const session = await getSession({ req });
  return {
    req,
    res,
    prisma,
    session: session as ISession | null,
    aliexpress: ALIEXPRESS,
    zapiex: ZAPIEX,
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
