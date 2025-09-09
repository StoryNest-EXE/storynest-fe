// src/services/auth.service.ts
import https from "@/lib/axios";
import {
  LoginRequest,
  LoginResponse,
  ProfileResponse,
} from "@/types/auth.type";

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await https.post("/api/Auth/login", data);
  return response.data;
};

export const getProfile = async (): Promise<ProfileResponse> => {
  const response = await https.get("/auth/profile");
  return response.data;
};

// Logout (nếu BE có endpoint, nếu không thì chỉ cần xóa token ở client)
export const logout = async (): Promise<void> => {
  await https.post("/auth/logout");
};
