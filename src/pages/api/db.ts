import nc from "next-connect";
import { NextApiResponse } from "next";
import { writeFile, readFile } from "fs/promises";

import prisma from "@config/prisma";

const handler = nc({
  onError(error, _, res: NextApiResponse) {
    res.status(501).json({
      success: false,
      message: "unknown_server_error",
      error,
    });
  },
  onNoMatch(_, res) {
    res.status(405).json({
      success: false,
      message: "method_not_allowed",
    });
  },
});

handler
  .get(async (_, res) => {
    const address = await prisma.address.findMany();
    const cart = await prisma.cart.findMany();
    const commune = await prisma.commune.findMany();
    const config = await prisma.config.findMany();
    const currency = await prisma.currency.findMany();
    const daira = await prisma.daira.findMany();
    const feedback = await prisma.feedback.findMany();
    const order = await prisma.order.findMany();
    const packageReceipt = await prisma.packageReceipt.findMany();
    const payment = await prisma.payment.findMany();
    const post = await prisma.post.findMany();
    const product = await prisma.product.findMany();
    const profile = await prisma.profile.findMany();
    const shipping = await prisma.shipping.findMany();
    const user = await prisma.user.findMany();
    const wilaya = await prisma.wilaya.findMany();
    const wishlist = await prisma.wishlist.findMany();
    try {
      const data = JSON.stringify({
        address,
        cart,
        commune,
        config,
        currency,
        daira,
        feedback,
        order,
        packageReceipt,
        payment,
        post,
        product,
        profile,
        shipping,
        user,
        wilaya,
        wishlist,
      });

      await writeFile("./data.json", data);
      res.status(200).json({ message: "successfully fetched all data" });
    } catch (error) {
      res.status(500).json({ error });
    }
  })
  .post(async (_, res) => {
    try {
      const data = await readFile("./data.json", {
        encoding: "utf8",
      });

      const parsed = JSON.parse(data);

      // both `cart` and `product` contain the `properties` field which is of type json
      // here we stringify before seeding
      const product = parsed.product.map((item: any) => {
        item.properties = JSON.stringify(item.properties);
        return item;
      });
      await prisma.product.createMany({
        data: product,
        skipDuplicates: true,
      });

      const cart = parsed.cart.map((item: any) => {
        item.properties = JSON.stringify(item.properties);
        return item;
      });
      await prisma.cart.createMany({
        data: cart,
        skipDuplicates: true,
      });

      await prisma.address.createMany({
        data: parsed.address,
        skipDuplicates: true,
      });
      await prisma.commune.createMany({
        data: parsed.commune,
        skipDuplicates: true,
      });
      await prisma.config.createMany({
        data: parsed.config,
        skipDuplicates: true,
      });
      await prisma.currency.createMany({
        data: parsed.currency,
        skipDuplicates: true,
      });
      await prisma.daira.createMany({
        data: parsed.daira,
        skipDuplicates: true,
      });
      await prisma.feedback.createMany({
        data: parsed.feedback,
        skipDuplicates: true,
      });
      await prisma.order.createMany({
        data: parsed.order,
        skipDuplicates: true,
      });
      await prisma.packageReceipt.createMany({
        data: parsed.packageReceipt,
        skipDuplicates: true,
      });
      await prisma.payment.createMany({
        data: parsed.payment,
        skipDuplicates: true,
      });
      await prisma.post.createMany({
        data: parsed.post,
        skipDuplicates: true,
      });
      await prisma.profile.createMany({
        data: parsed.profile,
        skipDuplicates: true,
      });
      await prisma.shipping.createMany({
        data: parsed.shipping,
        skipDuplicates: true,
      });
      await prisma.user.createMany({
        data: parsed.user,
        skipDuplicates: true,
      });
      await prisma.wilaya.createMany({
        data: parsed.wilaya,
        skipDuplicates: true,
      });
      await prisma.wishlist.createMany({
        data: parsed.wishlist,
        skipDuplicates: true,
      });

      res.status(200).json({ message: "successfully seeded all data" });
    } catch (error) {
      res.status(500).json({ error });
    }
  });

export default handler;
