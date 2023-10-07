import type { GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import type { DefaultJWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import { compareSync, genSaltSync, hashSync } from "bcrypt";
import slugify from "slugify";
import { ACCOUNT_TYPE, type Profile, type User } from "@prisma/client";

import { env } from "~/env.mjs";
import { db } from "~/server/db";
import { generate_token, check_email } from "~/utils/verify_signup";
import SendEmail from "~/utils/send_email";

interface ExtendedUser {
  type?: "oauth" | "credentials" | null;
  provider?: "google" | "facebook" | null;
  access_token?: string | null;
}

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & ExtendedUser;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT extends DefaultJWT, ExtendedUser {
    image?: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "login-credentials",
      name: "Login",
      credentials: {
        email: {
          label: "email",
          type: "text",
          placeholder: "user@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (credentials) {
          const user = await db.user.findFirst({
            where: {
              account: ACCOUNT_TYPE.CREDENTIALS,
              email: credentials.email,
            },
            include: {
              profile: true,
            },
          });
          if (user && user.password) {
            const isMatch = compareSync(credentials.password, user.password);
            if (!isMatch) {
              throw `/auth/login?error=invalid_credentials`;
            }
            return user;
          } else {
            throw `/auth/login?error=user_not_found`;
          }
        }
        throw `/auth/login?error=provide_email_and_password`;
      },
    }),
    CredentialsProvider({
      id: "register-credentials",
      name: "Register",
      credentials: {
        name: { label: "name", type: "text" },
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (credentials) {
          const checkemail = await check_email(credentials.email);
          if (checkemail) {
            throw `/auth/register/email_exists`;
          }
          if (!credentials.name) {
            credentials.name = credentials.email.split("@")[0]!;
          }
          let username = slugify(credentials.name);
          const checkusername = await db.user.findFirst({
            where: { account: ACCOUNT_TYPE.CREDENTIALS, name: username },
          });
          if (checkusername) {
            username += Math.floor(Math.random() * 10000).toString();
          }
          const picture = `https://avatars.dicebear.com/api/bottts/${username}.svg`;
          const salt = genSaltSync();
          const password = hashSync(credentials.password, salt);

          const token = generate_token();
          const user = await db.user.create({
            data: {
              account: ACCOUNT_TYPE.CREDENTIALS,
              verified: false,
              verifyCredentialsToken: token.verifyCredentialsToken,
              name: username,
              email: credentials.email,
              password,
              profile: {
                create: {
                  picture,
                },
              },
            },
            include: {
              profile: true,
            },
          });

          const url = `${env.NEXTAUTH_URL}/account/verify/${token.verifyToken}`;
          const message = `
      <h1>Hello ${user.name},</h1>
      <p>In order to verify your account, you can simply follow <a href=${url} target='_blank' clicktracking='off'>this link</a>.</p>
    `;

          try {
            SendEmail({
              from: env.SENDGRID_FROM,
              to: user.email,
              subject: "Account Verification",
              text: message,
            });
          } catch (error) {
            await db.user.update({
              where: { id: user.id },
              data: {
                verified: false,
                verifyCredentialsToken: undefined,
              },
            });
          }

          if (user) {
            return user;
          } else {
            return null;
          }
        }
        throw `/auth/register?error=provide_credentials`;
      },
    }),
    FacebookProvider({
      clientId: env.FACEBOOK_CLIENT_ID,
      clientSecret: env.FACEBOOK_SECRET,
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.type === "oauth" && user?.email) {
        const checkemail = await check_email(user?.email);
        if (!checkemail) {
          await db.user.create({
            data: {
              account: ACCOUNT_TYPE.OAUTH,
              name: user.name,
              email: user.email,
              profile: {
                create: {
                  picture: user.image,
                },
              },
            },
          });
        }
      }
      return true;
    },
    jwt({ token, account, user }) {
      if (account && user) {
        const { type } = account;
        if (type === "credentials") {
          token = {
            ...token,
            type,
            image: (user as User & { profile?: Profile }).profile?.picture,
          };
        } else if (type === "oauth") {
          token = {
            ...token,
            type,
            provider: account.provider as
              | "google"
              | "facebook"
              | null
              | undefined,
            access_token: account.access_token,
            image: user.image,
          };
        }
      }
      return token;
    },
    session({ session, token }) {
      session.user = token;
      return session;
    },
    redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
    signOut: "/",
  },
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: env.JWT_SECRET,
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
