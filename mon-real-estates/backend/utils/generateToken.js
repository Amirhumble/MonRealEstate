import jwt from "jsonwebtoken";
import crypto from "crypto";

// Generate Access Token (short-lived)
export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m", // 15 minutes
    }
  );
};

// Generate Refresh Token (long-lived, random string)
export const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString('hex');
};

// Generate both tokens
export const generateTokens = (user) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken();
  
  return {
    accessToken,
    refreshToken,
  };
};

// Verify Access Token
export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Legacy function for backward compatibility
const signToken = (user) => {
  return generateAccessToken(user);
};

export default signToken;