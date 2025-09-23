// src/lib/useRefreshToken.ts
"use client";

import { useCallback } from "react";
import {
  getAccessTokenFromLocalStorage,
  removeTokenFormLocalStorage,
  setAccessTokenToLocalStorage,
} from "./localStorage";
import https from "@/lib/axios";

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
    } catch (err: any) {
      // Chỉ redirect nếu thực sự không thể refresh được
      if (err.response?.status === 401 || err.response?.status === 403) {
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
