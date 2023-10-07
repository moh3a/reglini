import nc from "next-connect";
import multer from "multer";
import type { NextApiRequest, NextApiResponse } from "next";
import { API_RESPONSE_MESSAGES } from "~/config/constants";
import type { MulterFile } from "~/types";

export type ExtendedNextApiRequest = NextApiRequest & { file?: MulterFile };

const upload = multer({
  storage: multer.diskStorage({
    destination: "./public/uploads",
    filename: (req, file, cb) => cb(null, file.originalname),
  }),
});

const handler = nc({
  onError(error, req: ExtendedNextApiRequest, res: NextApiResponse) {
    res.status(501).json({
      success: false,
      message: API_RESPONSE_MESSAGES.ERROR_OCCURED,
    });
  },
  onNoMatch(req, res) {
    res.status(405).json({
      success: false,
      message: API_RESPONSE_MESSAGES.NOT_FOUND,
    });
  },
});

handler.use(upload.single("file"));

handler.post((req, res) => {
  if (req.file) {
    res.status(200).json({
      success: true,
      message: "Fichier téléchargé avec succées.",
      // url: req.file.destination + "/" + req.file.filename,
      url: "/uploads/" + req.file.filename,
    });
  } else {
    res.status(200).json({
      success: false,
      message: API_RESPONSE_MESSAGES.ERROR_OCCURED,
    });
  }
});

export default handler;

export const config = {
  api: {
    bodyParser: false,
  },
};
