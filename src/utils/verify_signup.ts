import { createHash, randomBytes } from "crypto";

const generate_token = () => {
  const verifyToken = randomBytes(20).toString("hex");
  const verifyCredentialsToken = createHash("sha256")
    .update(verifyToken)
    .digest("hex");
  return { verifyToken, verifyCredentialsToken };
};

export default generate_token;
