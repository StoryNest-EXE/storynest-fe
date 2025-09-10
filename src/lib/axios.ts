// src/lib/axios.ts
import axios from "axios";
import Cookies from "js-cookie";
import {
  getAccessTokenFromLocalStorage,
  setAccessTokenToLocalStorage,
} from "@/lib/localStorage";
import { refreshToken } from "@/services/auth.service";
import Router from "next/router";

const https = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Lấy từ .env
  withCredentials: true, // để gửi cookie kèm theo request nếu BE cần
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor để Thêm accessToken vào header
https.interceptors.request.use(
  (config) => {
    const token = getAccessTokenFromLocalStorage();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Xử lý 401
https.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const oldAccessToken = getAccessTokenFromLocalStorage();
        if (!oldAccessToken) throw new Error("No access token");

        // Gọi API refresh
        const newToken = await refreshToken({ accessToken: oldAccessToken });

        // Lưu lại token mới
        setAccessTokenToLocalStorage(newToken.accessToken);

        // Gắn lại header Authorization cho request cũ
        error.config.headers.Authorization = `Bearer ${newToken.accessToken}`;

        Router.push("/reset-password");

        // Retry request cũ
        return https(error.config);
      } catch (err) {
        console.error("Refresh failed → Redirect to login");
        // TODO: redirect login
      }
    }
    return Promise.reject(error);
  }
);

export default https;
