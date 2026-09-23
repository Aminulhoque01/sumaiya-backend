import bcrypt from "bcryptjs";

import {
  ILoginPayload,
  IRegisterPayload,
} from "./auth.interface";

import { AuthModel } from "./auth.model";

import { createToken } from "../../utils/jwt";

const registerAdmin = async (payload: IRegisterPayload) => {
  const { name, email, password } = payload;

  const normalizedEmail = email.toLowerCase().trim();

  const existingUser = await AuthModel.findOne({
    email: normalizedEmail,
  });

  if (existingUser) {
    throw new Error("Admin with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await AuthModel.create({
    name,
    email: normalizedEmail,
    password: hashedPassword,
    role: "admin",
  });

  const token = createToken({
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  return {
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

const loginAdmin = async (payload: ILoginPayload) => {
  const { email, password } = payload;

  const normalizedEmail = email.toLowerCase().trim();

  const user = await AuthModel.findOne({
    email: normalizedEmail,
  }).select("+password");

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordMatched = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordMatched) {
    throw new Error("Invalid email or password");
  }

  const token = createToken({
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  return {
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

const getMe = async (userId: string) => {
  const user = await AuthModel.findById(userId);

  if (!user) {
    throw new Error("Admin not found");
  }

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

export const authService = {
  registerAdmin,
  loginAdmin,
  getMe,
};