// src/queries/auth.queries.ts
import { useMutation, useQuery } from '@tanstack/react-query';
import { login, getProfile, logout } from '@/services/auth.service';
import { LoginRequest, LoginResponse, ProfileResponse } from '@/types/auth.type';
import Cookies from 'js-cookie';

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (data: LoginRequest) => login(data),
    onSuccess: (data) => {
      // TODO: Lưu token vào cookies (sẽ xử lý sau ở AuthContext)
      console.log('Login success:', data);
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });
};

export const useProfileQuery = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    enabled: !!Cookies.get('token'), // Chỉ chạy nếu có token
  });
};

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // TODO: Xóa token và redirect (sẽ xử lý sau)
      console.log('Logout success');
    },
  });
};