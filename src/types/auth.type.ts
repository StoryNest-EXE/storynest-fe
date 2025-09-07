// src/types/auth.type.ts
export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface LoginResponse {
    token: string;
    user: {
      id: string;
      username: string;
      role: string; // Ví dụ: 'user' | 'admin'
    };
  }
  
  export interface User {
    id: string;
    username: string;
    role: string;
  }
  
  export interface ProfileResponse {
    user: User;
  }