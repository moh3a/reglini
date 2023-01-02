import { config } from "dotenv";
config();

import axios from "axios";
import nc from "next-connect";
import type { NextApiResponse, NextApiRequest } from "next";
import { getSession } from "next-auth/react";

import { ISession } from "@reglini-types/index";
import prisma from "@config/prisma";
import { ROLES } from "@prisma/client";

const handler = nc({ attachParams: true });
handler
  .use(async (req: NextApiRequest, res: NextApiResponse, next) => {
    const session: ISession | null = await getSession({ req });
    if (session?.user && session?.user.email) {
      const admin = await prisma.user.findFirst({
        where: { email: session?.user.email, role: ROLES.ADMIN },
      });
      if (admin) {
        next();
      } else {
        res.status(200).json({
          success: false,
          message: "Unauthorized to access this part.",
        });
      }
    } else {
      res.status(200).json({
        success: false,
        message: "Unauthorized to access this part.",
      });
    }
  })
  .get(async (req: NextApiRequest, res: NextApiResponse) => {
    const { code } = req.query;
    if (code) {
      const { data } = await axios.post(
        `https://oauth.aliexpress.com/token?client_id=${process.env.ALIEXPRESS_DS_APP_KEY}&client_secret=${process.env.ALIEXPRESS_DS_APP_SECRET}&grant_type=authorization_code&code=${code}&redirect_uri=${process.env.NEXTAUTH_URL}/api/aliexpress/auth/callback&sp=ae`
      );
      console.log(data);
      // if (data.access_token) {
      //   await axios.patch(
      //     `${process.env.VERCEL_API_URL}/v9/projects/reglini-admin/env/MEMO8DQxkE9UNALg`,
      //     { value: data.access_token },
      //     {
      //       headers: {
      //         Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
      //       },
      //     }
      //   );
      //   await axios.patch(
      //     `${process.env.VERCEL_API_URL}/v9/projects/reglini/env/4MbbAxDrJsZGV7FP`,
      //     { value: data.access_token },
      //     {
      //       headers: {
      //         Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
      //       },
      //     }
      //   );
      //   await axios.post(
      //     `${process.env.VERCEL_API_URL}/v13/deployments?forceNew=1`,
      //     { name: "reglini" },
      //     {
      //       headers: {
      //         Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
      //       },
      //     }
      //   );
      //   await axios.post(
      //     `${process.env.VERCEL_API_URL}/v13/deployments?forceNew=1`,
      //     { name: "reglini-admin" },
      //     {
      //       headers: {
      //         Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
      //       },
      //     }
      //   );

      //   res.status(200).redirect("/");
      // } else {
      //   res.status(403).json({
      //     success: false,
      //     message: "Failed to log in AE user.",
      //   });
      // }
    }
  });

export default handler;
