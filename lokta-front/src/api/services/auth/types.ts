import { BaseUser } from "../user/types";

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export type LoginResponse = {
  user: BaseUser & { role: string };
  access_token: string;
  token_type: string;
};

export type RegisterResponse = {
  user: BaseUser;
  message: string;
};

export type ForgetPasswordRequest = {
  email: string;
};

export type ResetPasswordRequest = {
  email: string;
  otp: string;
};

export type ResetPasswordResponse = {
  message: string;
};

export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
};

export type ChangePasswordResponse = {
  message: string;
};


