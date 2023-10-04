import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    DIRECT_URL: z.string().url(),
    JWT_SECRET: z.string().optional(),

    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string().min(1)
        : z.string().min(1).optional(),
    NEXTAUTH_URL: z.preprocess(
      // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
      // Since NextAuth.js automatically uses the VERCEL_URL if present.
      (str) => process.env.VERCEL_URL ?? str,
      // VERCEL_URL doesn't include `https` so it cant be validated as a URL
      process.env.VERCEL ? z.string().min(1) : z.string().url()
    ),

    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_SECRET: z.string().min(1),

    FACEBOOK_CLIENT_ID: z.string().min(1),
    FACEBOOK_SECRET: z.string().min(1),

    ALIEXPRESS_USERNAME: z.string(),
    ALIEXPRESS_PASSWORD: z.string(),
    CLOUDINARY_URL: z.string(),
    ZAPIEX_KEY: z.string(),
    SENDGRID_API_KEY: z.string(),
    SENDGRID_SMTP_SERVICE: z.string(),
    SENDGRID_SMTP_USERNAME: z.string(),
    SENDGRID_SMTP_PASSWORD: z.string(),
    SENDGRID_FROM: z.string(),

    ALIEXPRESS_AFFILIATE_APP_KEY: z.string().min(1),
    ALIEXPRESS_AFFILIATE_APP_SECRET: z.string().min(1),
    ALIEXPRESS_AFFILIATE_ACCESS_TOKEN: z.string().min(1),

    ALIEXPRESS_DS_APP_KEY: z.string().min(1),
    ALIEXPRESS_DS_APP_SECRET: z.string().min(1),
    ALIEXPRESS_DS_ACCESS_TOKEN: z.string().min(1),
  },

  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
