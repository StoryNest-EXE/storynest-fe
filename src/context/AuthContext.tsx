"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
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
  accessToken?: string;
  token?: TokenPayload;
  login: (accessToken: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  accessToken: undefined,
  token: undefined,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);
  const [token, setToken] = useState<TokenPayload | undefined>(undefined);
  const refresh = useRefreshToken();
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearRefreshTimer = () => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = null;
    }
  };

  const scheduleRefresh = useCallback(
    (payload: TokenPayload) => {
      clearRefreshTimer();

      if (!payload.exp) return;

      const now = Math.floor(Date.now() / 1000);
      const expiresIn = payload.exp - now;

      if (expiresIn <= 0) {
        // accessToken hết hạn nhưng thử refresh trước khi logout
        (async () => {
          try {
            const newAccessToken = await refresh();
            if (newAccessToken) {
              setAccessTokenToLocalStorage(newAccessToken);
              const newPayload = decodeToken(newAccessToken);
              setAccessToken(newAccessToken);
              setToken(newPayload);
              scheduleRefresh(newPayload);
            } else {
              logout();
            }
          } catch {
            logout();
          }
        })();
        return;
      }

      // Refresh trước khi hết hạn 2 phút
      const refreshInMs = Math.max((expiresIn - 120) * 1000, 0);

      refreshTimeoutRef.current = setTimeout(async () => {
        try {
          const newAccessToken = await refresh();
          if (newAccessToken) {
            setAccessTokenToLocalStorage(newAccessToken);
            const newPayload = decodeToken(newAccessToken);
            setAccessToken(newAccessToken);
            setToken(newPayload);
            scheduleRefresh(newPayload); // schedule lại lần tiếp theo
          } else {
            logout();
          }
        } catch {
          logout();
        }
      }, refreshInMs);
    },
    [refresh]
  );

  const login = useCallback(
    (newAccessToken: string) => {
      setAccessTokenToLocalStorage(newAccessToken);
      const payload = decodeToken(newAccessToken);
      setAccessToken(newAccessToken);
      setToken(payload);
      scheduleRefresh(payload);
    },
    [scheduleRefresh]
  );

  const logout = useCallback(() => {
    removeTokenFormLocalStorage();
    setAccessToken(undefined);
    setToken(undefined);
    clearRefreshTimer();
  }, []);

  // Khi reload page -> check localStorage
  useEffect(() => {
    const savedToken = getAccessTokenFromLocalStorage();
    if (savedToken) {
      const payload = decodeToken(savedToken);
      setAccessToken(savedToken);
      setToken(payload);
      scheduleRefresh(payload);
    }
    return () => clearRefreshTimer();
  }, [scheduleRefresh]);

  return (
    <AuthContext.Provider value={{ accessToken, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
