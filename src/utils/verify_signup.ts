import prisma from "@config/prisma";
import { createHash, randomBytes } from "crypto";

export const generate_token = () => {
  const verifyToken = randomBytes(20).toString("hex");
  const verifyCredentialsToken = createHash("sha256")
    .update(verifyToken)
    .digest("hex");
  return { verifyToken, verifyCredentialsToken };
};

export const check_email = async (email: string) => {
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });
  if (user) {
    return true;
  } else {
    return false;
  }
};
