import { API_URL } from "@/api/constants";
import { resolveError } from "../helpers/error-resolver";
import {
  ChangePasswordRequest,
  ForgetPasswordRequest,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ResetPasswordRequest,
} from "./types";
import axios from "axios";
import { useAuthStore } from "@/zustand-stores/auth.store";
import { headerGenerator } from "../helpers/header-generator";

export class AuthService {
  loginApi = async (loginReq: LoginRequest) => {
    try {
      const { data } = await axios.post<LoginResponse>(
        `${API_URL}/api/login`,
        loginReq,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return data;
    } catch (error) {
      throw new Error(resolveError(error));
    }
  };

  signupApi = async (registerReq: RegisterRequest) => {
    try {
      const { data } = await axios.post<RegisterResponse>(
        `${API_URL}/api/register`,
        registerReq,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return data;
    } catch (error) {
      throw new Error(resolveError(error));
    }
  };

  forgetPasswordApi = async (forgetPasswordReq: ForgetPasswordRequest) => {
    try {
      const { data } = await axios.post<{ message: string }>(
        `${API_URL}/api/forget-password`,
        forgetPasswordReq,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return data;
    } catch (error) {
      throw new Error(resolveError(error));
    }
  };

  verifyOtpApi = async (resetPasswordReq: ResetPasswordRequest) => {
    try {
      const { data } = await axios.post<{ message: string }>(
        `${API_URL}/api/reset-password`,
        resetPasswordReq,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return data;
    } catch (error) {
      throw new Error(resolveError(error));
    }
  };

  changePasswordApi = async (changePasswordReq: ChangePasswordRequest) => {
    try {
      const token = useAuthStore.getState().accessToken;
      const { data } = await axios.put<{ message: string }>(
        `${API_URL}/api/user/change-password`,
        changePasswordReq,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data;
    } catch (error) {
      throw new Error(resolveError(error));
    }
  };

  resendOtpApi = async () => {
    try {
      const token = useAuthStore.getState().accessToken;
      const { data } = await axios.post<{ message: string }>(
        `${API_URL}/api/resend_verification`,
        {
          headers: headerGenerator([
            {
              Authorization: `Bearer ${token}`,
            },
          ]),
        }
      );
      return data;
    } catch (error) {
      throw new Error(resolveError(error));
    }
  };
}

export const {
  loginApi,
  signupApi,
  forgetPasswordApi,
  verifyOtpApi,
  changePasswordApi,
  resendOtpApi,
} = new AuthService();
