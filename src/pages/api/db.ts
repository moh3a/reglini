import nc from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import { writeFile, readFile } from "fs/promises";

import prisma from "@config/prisma";

const handler = nc({
  onError(error, req: NextApiRequest, res: NextApiResponse) {
    res.status(501).json({
      success: false,
      message: "unknown_server_error",
      error,
    });
  },
  onNoMatch(req, res) {
    res.status(405).json({
      success: false,
      message: "method_not_allowed",
    });
  },
});

handler
  .get(async (_, res) => {
    const products = await prisma.product.findMany();
    try {
      const data = JSON.stringify({ products });

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
      const products = parsed.products.map((product: any) => {
        product.properties = JSON.stringify(product.properties);
        return product;
      });

      await prisma.product.createMany({
        data: products,
        skipDuplicates: true,
      });

      res.status(200).json({ message: "successfully seeded all data" });
    } catch (error) {
      res.status(500).json({ error });
    }
  });

export default handler;
