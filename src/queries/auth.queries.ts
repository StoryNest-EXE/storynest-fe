// src/queries/auth.queries.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  login,
  getProfile,
  logout,
  register,
  forgotPassword,
} from "@/services/auth.service";
import {
  ForgotPasswordRequest,
  LoginRequest,
  LoginResponse,
  ProfileResponse,
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

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // TODO: Xóa token và redirect (sẽ xử lý sau)
      console.log("Logout success");
    },
  });
};
