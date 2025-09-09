// src/types/auth.type.ts
export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
  deviceId: string;
  ipAddress: string;
  userAgent: string;
}

export interface LoginResponse {
  username: string;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  fullName: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterResponse {
  status: number;
  message: string;
}

export interface User {
  id: string;
  username: string;
  role: string;
}

export interface ProfileResponse {
  user: User;
}
