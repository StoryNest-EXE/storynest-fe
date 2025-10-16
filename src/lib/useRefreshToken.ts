// src/lib/useRefreshToken.ts
"use client";

import { useCallback } from "react";
import {
  getAccessTokenFromLocalStorage,
  removeTokenFormLocalStorage,
  setAccessTokenToLocalStorage,
} from "./localStorage";
import https from "@/lib/axios";
import { AxiosError } from "axios";

export function useRefreshToken() {
  const refresh = useCallback(async () => {
    const accessToken = getAccessTokenFromLocalStorage();
    if (!accessToken) return null;
    try {
      const res = await https.post("/api/Auth/refresh");
      console.log("new AT", res);
      const newAccessToken = res.data.data.accessToken;
      setAccessTokenToLocalStorage(newAccessToken);
      return newAccessToken;
    } catch (err: unknown) {
      const axiosError = err as AxiosError;

      // Chỉ redirect nếu thực sự không thể refresh được
      if (
        axiosError.response?.status === 401 ||
        axiosError.response?.status === 403
      ) {
        removeTokenFormLocalStorage();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
      return null;
    }
  }, []);

  return refresh;
}
