// src/queries/auth.queries.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  login,
  getProfile,
  logout,
  register,
  forgotPassword,
  refreshToken,
  getLogout,
} from "@/services/auth.service";
import {
  ForgotPasswordRequest,
  LoginRequest,
  LoginResponse,
  ProfileResponse,
  RefreshTokenRequest,
  RegisterRequest,
} from "@/types/auth.type";
import Cookies from "js-cookie";

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (data: LoginRequest) => login(data),
    onSuccess: (data) => {
      // TODO: Lưu token vào cookies (sẽ xử lý sau ở AuthContext)
      console.log("Login success:", data);
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
};

export const useRefreshTokenMutation = () => {
  return useMutation({
    mutationFn: (data: RefreshTokenRequest) => refreshToken(data),
    onSuccess: (data) => {
      console.log("Refresh token success:", data);
    },
  });
};

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: (data: RegisterRequest) => register(data),
    onSuccess: (data) => {
      console.log("Register success:", data);
    },
    onError: (error) => {
      console.error("Register failed:", error);
    },
  });
};

export const useLogoutQuery = () => {
  return useQuery({
    queryKey: ["logout"],
    queryFn: getLogout,
  });
};

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) => forgotPassword(data),
    onSuccess: (data) => {
      console.log("Forgot password success:", data);
    },
  });
};

export const useProfileQuery = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    enabled: !!Cookies.get("token"), // Chỉ chạy nếu có token
  });
};
