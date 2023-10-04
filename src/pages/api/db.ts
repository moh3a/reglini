import nc from "next-connect";
import { NextApiResponse } from "next";
import { writeFile, readFile } from "fs/promises";

import { db } from "~/server/db";
import { API_RESPONSE_MESSAGES } from "~/config/constants";

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
    const address = await db.address.findMany();
    const cart = await db.cart.findMany();
    const commune = await db.commune.findMany();
    const config = await db.config.findMany();
    const currency = await db.currency.findMany();
    const daira = await db.daira.findMany();
    const feedback = await db.feedback.findMany();
    const order = await db.order.findMany();
    const packageReceipt = await db.packageReceipt.findMany();
    const payment = await db.payment.findMany();
    const post = await db.post.findMany();
    const product = await db.product.findMany();
    const profile = await db.profile.findMany();
    const shipping = await db.shipping.findMany();
    const user = await db.user.findMany();
    const wilaya = await db.wilaya.findMany();
    const wishlist = await db.wishlist.findMany();
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
      res
        .status(200)
        .json({ success: true, message: "successfully fetched all data" });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: API_RESPONSE_MESSAGES.ERROR_OCCURED });
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
      await db.product.createMany({
        data: product,
        skipDuplicates: true,
      });

      const cart = parsed.cart.map((item: any) => {
        item.properties = JSON.stringify(item.properties);
        return item;
      });
      await db.cart.createMany({
        data: cart,
        skipDuplicates: true,
      });

      await db.address.createMany({
        data: parsed.address,
        skipDuplicates: true,
      });
      await db.commune.createMany({
        data: parsed.commune,
        skipDuplicates: true,
      });
      await db.config.createMany({
        data: parsed.config,
        skipDuplicates: true,
      });
      await db.currency.createMany({
        data: parsed.currency,
        skipDuplicates: true,
      });
      await db.daira.createMany({
        data: parsed.daira,
        skipDuplicates: true,
      });
      await db.feedback.createMany({
        data: parsed.feedback,
        skipDuplicates: true,
      });
      await db.order.createMany({
        data: parsed.order,
        skipDuplicates: true,
      });
      await db.packageReceipt.createMany({
        data: parsed.packageReceipt,
        skipDuplicates: true,
      });
      await db.payment.createMany({
        data: parsed.payment,
        skipDuplicates: true,
      });
      await db.post.createMany({
        data: parsed.post,
        skipDuplicates: true,
      });
      await db.profile.createMany({
        data: parsed.profile,
        skipDuplicates: true,
      });
      await db.shipping.createMany({
        data: parsed.shipping,
        skipDuplicates: true,
      });
      await db.user.createMany({
        data: parsed.user,
        skipDuplicates: true,
      });
      await db.wilaya.createMany({
        data: parsed.wilaya,
        skipDuplicates: true,
      });
      await db.wishlist.createMany({
        data: parsed.wishlist,
        skipDuplicates: true,
      });

      res
        .status(200)
        .json({ success: true, message: "successfully seeded all data" });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: API_RESPONSE_MESSAGES.ERROR_OCCURED });
    }
  });

export default handler;
