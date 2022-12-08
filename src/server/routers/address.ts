import { z } from "zod";

import { router, procedure } from "../trpc";

export const addressRouter = router({
  wilaya: procedure
    .input(z.object({ wilaya: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const wilayas = await ctx.prisma.wilaya.findMany({
        where: {
          name: {
            contains: input.wilaya,
            mode: "insensitive",
          },
        },
      });
      return {
        wilayas,
      };
    }),
  daira: procedure
    .input(z.object({ wilaya: z.string(), daira: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const dairas = await ctx.prisma.daira.findMany({
        where: {
          wilaya: {
            name: input.wilaya,
          },
          name: {
            contains: input.daira,
            mode: "insensitive",
          },
        },
      });
      return {
        dairas,
      };
    }),
  commune: procedure
    .input(z.object({ daira: z.string(), commune: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const communes = await ctx.prisma.commune.findMany({
        where: {
          daira: {
            name: input.daira,
          },
          name: {
            contains: input.commune,
            mode: "insensitive",
          },
        },
      });
      return {
        communes,
      };
    }),
  post: procedure
    .input(
      z.object({
        wilaya: z.string(),
        daira: z.string(),
        commune: z.string(),
        post: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const posts = await ctx.prisma.post.findMany({
        where: {
          post: {
            contains: input.post,
            mode: "insensitive",
          },
        },
      });
      return {
        posts,
      };
    }),
});
