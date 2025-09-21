import axios from "axios";
import {
  getAccessTokenFromLocalStorage,
  removeTokenFormLocalStorage,
  setAccessTokenToLocalStorage,
} from "./localStorage";

const https = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const isClient = typeof window !== "undefined";
// Request interceptor
https.interceptors.request.use((config) => {
  if (isClient) {
    const token = getAccessTokenFromLocalStorage();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor (xử lý refresh token)
https.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (isClient && error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;

      try {
        const oldAccessToken = getAccessTokenFromLocalStorage();
        if (!oldAccessToken) throw new Error("No access token");

        // Gọi API refresh token
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/Auth/refresh`,
          {},
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${oldAccessToken}`,
            },
          }
        );

        const newAccessToken = res.data.accessToken;

        // Lưu token mới
        setAccessTokenToLocalStorage(newAccessToken);

        // Gắn token mới vào header của request cũ
        error.config.headers.Authorization = `Bearer ${newAccessToken}`;

        return https(error.config); // retry request cũ
      } catch (err) {
        removeTokenFormLocalStorage();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default https;
