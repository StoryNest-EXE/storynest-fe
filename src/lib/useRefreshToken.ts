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
      const res = await https.post("/api/Auth/refresh", { accessToken });
      const newAccessToken = res.data.data.accessToken;
      console.log("[useRefreshToken] refresh response:", res?.data);

      setAccessTokenToLocalStorage(newAccessToken);
      return newAccessToken;
    } catch (err) {
      console.error("Refresh failed123123123", err);
      removeTokenFormLocalStorage();
      window.location.href = "/login";
      return null;
    }
  }, []);

  return refresh;
}
