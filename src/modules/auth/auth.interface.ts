import { Document } from "mongoose";

export interface IAuth extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin";

  createdAt: Date;
  updatedAt: Date;
}

export interface IRegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IAuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: "admin";
  };
  token: string;
}