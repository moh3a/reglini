import { z } from "zod";
import { router, procedure } from "../trpc";

export const addressRouter = router({
  wilayas: procedure.query(async ({ ctx }) => {
    const wilayas = await ctx.prisma.wilaya.findMany();
    return {
      wilayas,
    };
  }),
  dairas: procedure
    .input(z.object({ wilaya: z.string() }))
    .query(async ({ ctx, input }) => {
      const dairas = await ctx.prisma.daira.findMany({
        where: {
          wilaya: {
            name: input.wilaya,
          },
        },
      });
      return {
        dairas,
      };
    }),
  communes: procedure
    .input(z.object({ daira: z.string() }))
    .query(async ({ ctx, input }) => {
      const communes = await ctx.prisma.commune.findMany({
        where: {
          daira: {
            name: input.daira,
          },
        },
      });
      return {
        communes,
      };
    }),
  posts: procedure
    .input(
      z.object({
        wilaya: z.string(),
        commune: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const posts = await ctx.prisma.post.findMany({
        where: {
          commune: {
            name: input.commune,
          },
          wilaya: {
            name: input.wilaya,
          },
        },
      });
      if (posts.length === 1) {
        return {
          post: posts[0],
        };
      } else {
        return {
          posts,
        };
      }
    }),
});
