import nc from "next-connect";
import multer from "multer";
import { NextApiRequest, NextApiResponse } from "next";
import { API_RESPONSE_MESSAGES } from "@config/general";

const upload = multer({
  storage: multer.diskStorage({
    destination: "./public/uploads",
    filename: (req, file, cb) => cb(null, file.originalname),
  }),
});

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

handler.post((req: any, res) => {
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
