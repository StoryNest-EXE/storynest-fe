// src/types/auth.type.ts
export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
  remember?: boolean;
  deviceId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export interface LoginData {
  username: string;
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  status: number;
  message: string;
  data: LoginData;
}

export interface RefreshTokenRequest {
  accessToken: string;
}

export interface RefreshTokenResponse {
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

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
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
