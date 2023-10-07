import nc from "next-connect";
import type { NextApiResponse } from "next";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { z } from "zod";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

import { API_RESPONSE_MESSAGES } from "~/config/constants";
import type { ExtendedNextApiRequest } from "~/pages/api/uploads";

const storage = new CloudinaryStorage({
  cloudinary,
  params: () => ({
    folder: "tmp",
  }),
});
const upload = multer({ storage: storage });

const imageUploadBodySchema = z.object({
  public_id: z.string().optional(),
  folder: z.string().optional(),
});

const handler = nc({
  onError(_, req: ExtendedNextApiRequest, res: NextApiResponse) {
    res.status(501).json({
      success: false,
      message: API_RESPONSE_MESSAGES.ERROR_OCCURED,
    });
  },
  onNoMatch(_, res) {
    res.status(405).json({
      success: false,
      message: API_RESPONSE_MESSAGES.NOT_FOUND,
    });
  },
});

handler.use(upload.single("file"));

handler.post(async (req, res) => {
  if (req.file) {
    const { public_id, folder } = imageUploadBodySchema.parse(req.body);

    const image = await cloudinary.uploader.upload(req.file.path, {
      public_id,
      folder,
    });

    if (image?.secure_url) {
      res.status(200).json({
        success: true,
        message: "Image téléchargé avec succées.",
        url: image.secure_url,
      });
    } else
      res.status(200).json({
        success: false,
        message: API_RESPONSE_MESSAGES.ERROR_OCCURED,
      });
  } else
    res.status(200).json({
      success: false,
      message: API_RESPONSE_MESSAGES.ERROR_OCCURED,
    });
});

export default handler;

export const config = {
  api: {
    bodyParser: false,
  },
};
