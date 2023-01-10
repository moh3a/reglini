import nc from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";

import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "tmp",
  },
});
const upload = multer({ storage: storage });

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

handler.use(upload.single("file"));

handler.post(async (req: any, res) => {
  const { folder, public_id } = req.body;
  if (req.file) {
    const image = await cloudinary.uploader.upload(req.file.path, {
      public_id,
      folder,
    });
    if (image && image.secure_url) {
      res.status(200).json({
        success: true,
        message: "Image téléchargé avec succées.",
        url: image.secure_url,
      });
    } else
      res.status(200).json({
        success: false,
        message: "Une erreur s'est produite.",
      });
  } else
    res.status(200).json({
      success: false,
      message: "Une erreur s'est produite.",
    });
});

export default handler;

export const config = {
  api: {
    bodyParser: false,
  },
};
