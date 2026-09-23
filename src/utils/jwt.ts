import jwt from "jsonwebtoken";

interface IJwtPayload {
  id: string;
  email: string;
  role: string;
}

export const createToken = (payload: IJwtPayload): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.sign(payload, secret, {
    expiresIn: "7d",
  });
};

export const verifyToken = (token: string): IJwtPayload => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.verify(token, secret) as IJwtPayload;
};