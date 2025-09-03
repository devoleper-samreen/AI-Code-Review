import crypto from "crypto";

export const verifySignature = (req, secret) => {
  const signature = req.headers["x-hub-signature-256"];
  if (!signature) return false;

  const body = JSON.stringify(req.body);
  const hmac = crypto.createHmac("sha256", secret).update(body).digest("hex");

  const expected = `sha256=${hmac}`;
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
};
