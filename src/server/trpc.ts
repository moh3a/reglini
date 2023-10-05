import superjson from "superjson";
import { ZodError } from "zod";
import { TRPCError, initTRPC } from "@trpc/server";
import type { Session } from "next-auth";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";

import { db } from "~/server/db";
import { getServerAuthSession } from "~/server/auth";
import { API_RESPONSE_MESSAGES } from "~/config/constants";
import { ALIEXPRESS } from "~/utils/ae";
import { ZAPIEX } from "~/utils/zapiex";

interface CreateContextOptions {
  session: Session | null;
}

const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    db,
    aliexpress: ALIEXPRESS,
    zapiex: ZAPIEX,
  };
};

/**
 * This is the actual context you will use in your router. It will be used to process every request
 * that goes through your tRPC endpoint.
 *
 * @see https://trpc.io/docs/context
 */
export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;

  // Get the session from the server using the getServerSession wrapper function
  const session = await getServerAuthSession({ req, res });

  return createInnerTRPCContext({
    session,
  });
};

const t = initTRPC.context<typeof createTRPCContext>().create({
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
