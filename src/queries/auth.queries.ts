// src/queries/auth.queries.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  login,
  register,
  forgotPassword,
  refreshToken,
  getLogout,
  getGoogleLogin,
  postResetPassword,
  postVerifyReset,
} from "@/services/auth.service";
import {
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
} from "@/types/auth.type";

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (data: LoginRequest) => login(data),
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
};

export const useRefreshTokenMutation = () => {
  return useMutation({
    mutationFn: () => refreshToken(),
  });
};

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: (data: RegisterRequest) => register(data),
    onError: (error) => {
      console.error("Register failed:", error);
    },
  });
};

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: getLogout,
  });
};

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) => forgotPassword(data),
  });
};

export const useGoogleLoginMutation = () => {
  return useMutation({
    mutationFn: () => getGoogleLogin(),
  });
};

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => postResetPassword(data),
  });
};

export const useVerifyResetMutation = () => {
  return useMutation({
    mutationFn: (token: string) => postVerifyReset(token),
  });
};
