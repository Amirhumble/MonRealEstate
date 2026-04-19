import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    return res.status(401).json({ message: "Missing authorization token." });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Invalid token." });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token verification failed." });
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
