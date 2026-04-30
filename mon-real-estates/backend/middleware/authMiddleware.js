import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import { verifyAccessToken } from "../utils/generateToken.js";

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    return res.status(401).json({ message: "Access token required." });
  }

  try {
    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.id).select("-password -refreshTokens");
    
    if (!user) {
      return res.status(401).json({ message: "Invalid access token." });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: "Access token expired.",
        code: "TOKEN_EXPIRED"
      });
    }
    return res.status(401).json({ message: "Invalid access token." });
  }
};

export const authorizeRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Forbidden: insufficient permissions." });
  }

  return next();
};
