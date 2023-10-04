import { db } from "~/server/db";
import { createHash, randomBytes } from "crypto";

export const generate_token = () => {
  const verifyToken = randomBytes(20).toString("hex");
  const verifyCredentialsToken = createHash("sha256")
    .update(verifyToken)
    .digest("hex");
  return { verifyToken, verifyCredentialsToken };
};

export const check_email = async (email: string) => {
  const user = await db.user.findFirst({
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
