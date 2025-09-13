"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { decodeToken } from "@/lib/jwt";
import {
  getAccessTokenFromLocalStorage,
  setAccessTokenToLocalStorage,
  removeTokenFormLocalStorage,
} from "@/lib/localStorage";
import { TokenPayload } from "@/types/jwt.type";
import { useRefreshToken } from "@/lib/useRefreshToken";

type AuthContextType = {
  token: TokenPayload | undefined;
  login: (accessToken: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  token: undefined,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<TokenPayload | undefined>(undefined);
  const refresh = useRefreshToken();

  // Khi reload page -> check localStorage + refresh nếu cần
  useEffect(() => {
    const initAuth = async () => {
      const accessToken = getAccessTokenFromLocalStorage();
      if (accessToken) {
        const payload = decodeToken(accessToken);
        setToken(payload);

        // Check nếu sắp hết hạn thì refresh
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp - now < 60) {
          const newAccessToken = await refresh();
          if (newAccessToken) {
            const newPayload = decodeToken(newAccessToken);
            setToken(newPayload);
          }
        }
      }
    };
    initAuth();
  }, [refresh]);

  const login = useCallback((accessToken: string) => {
    setAccessTokenToLocalStorage(accessToken);
    const payload = decodeToken(accessToken);
    setToken(payload);
  }, []);

  const logout = useCallback(() => {
    removeTokenFormLocalStorage();
    setToken(undefined);
  }, []);

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
