import { getSession } from "next-auth/react";
import superjson from "superjson";
import { ZodError } from "zod";
import type * as trpc from "@trpc/server";
import type * as trpcNext from "@trpc/server/adapters/next";

import { db } from "~/server/db";
import { API_RESPONSE_MESSAGES } from "~/config/constants";
import type { ISession } from "~/types/index";
import { TRPCError, initTRPC } from "@trpc/server";
import { ALIEXPRESS } from "~/utils/ae";
import { ZAPIEX } from "~/utils/zapiex";

export const createContext = async ({
  req,
  res,
}: trpcNext.CreateNextContextOptions) => {
  const session = await getSession({ req });
  return {
    req,
    res,
    db,
    session: session as ISession | null,
    aliexpress: ALIEXPRESS,
    zapiex: ZAPIEX,
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

const enforceUserIsAuthed = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: API_RESPONSE_MESSAGES.LOGGED_IN,
    });
  }

  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

export const router = t.router;
export const procedure = t.procedure;
export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
