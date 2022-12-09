import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { getSession } from "next-auth/react";

import prisma from "@config/prisma";
import { ISession } from "../types";
// import { Aliexpress } from "@config/ae";
import { ZAPIEX } from "@config/zapiex";

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
    // aliexpress: Aliexpress,
    zapiex: ZAPIEX,
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
