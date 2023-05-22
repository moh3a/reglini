import nc from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import { writeFile } from "fs/promises";

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

handler.post(async (req, res) => {
  const products = await prisma.product.findMany();
  try {
    const data = JSON.stringify({ products });

    await writeFile("./data.json", data);
    res.status(200).json({ message: "successfully fetched all data" });
  } catch (error) {
    res.status(500).json({ error });
  }
});

export default handler;
