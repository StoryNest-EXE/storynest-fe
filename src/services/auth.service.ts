// src/services/auth.service.ts
import https from "@/lib/axios";
import {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  ProfileResponse,
  RefreshTokenResponse,
  RegisterRequest,
  RegisterResponse,
  ResetPasswordRequest,
} from "@/types/auth.type";

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await https.post("/api/Auth/login", data);
  return response.data;
};

export const refreshToken = async (): Promise<RefreshTokenResponse> => {
  const response = await https.post("/api/Auth/refresh", {});
  return response.data;
};

export const register = async (
  data: RegisterRequest
): Promise<RegisterResponse> => {
  const response = await https.post("/api/Auth/register", data);
  return response.data;
};

export const forgotPassword = async (
  data: ForgotPasswordRequest
): Promise<ForgotPasswordResponse> => {
  const response = await https.post("/api/Auth/forgot-password", data);
  return response.data;
};

export const getLogout = async (): Promise<LogoutResponse> => {
  const response = await https.get("api/Auth/logout");
  return response.data;
};

export const getGoogleLogin = async () => {
  const response = await https.get("/api/Auth/google-login");
  return response.data;
};

export const postResetPassword = async (data: ResetPasswordRequest) => {
  const response = await https.post("api/Auth/reset-password", data);
  return response.data;
};

export const postVerifyReset = async (token: string) => {
  const response = await https.post(`/api/Auth/verify-reset?token=${token}`);
  return response.data;
};
