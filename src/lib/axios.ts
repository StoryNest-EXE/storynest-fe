// src/lib/axios.ts
import axios from "axios";
import Cookies from "js-cookie";
import { getAccessTokenFromLocalStorage } from "@/lib/localStorage";

const https = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Lấy từ .env
  withCredentials: true, // để gửi cookie kèm theo request nếu BE cần
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor để thêm Bearer token từ cookies
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

// Interceptor xử lý lỗi (ví dụ: 401 -> xóa token)
https.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("token");
      console.error("Unauthorized, token removed");
      // TODO: Redirect to login nếu cần (sẽ xử lý sau ở middleware)
    }
    return Promise.reject(error);
  }
);

export default https;
