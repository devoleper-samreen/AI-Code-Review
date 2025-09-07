import jwt from "jsonwebtoken";

export const verifyAuth = (req, res, next) => {
  let token = req.headers?.authorization || req.cookies?.token;

  if (!token)
    return res.status(401).json({
      message: "Token is missing",
    });

  // Remove 'Bearer ' prefix if present
  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length).trim();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};
