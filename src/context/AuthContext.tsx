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
  getAccessTokenFormLocalStorage,
  setAccessTokenToLocalStorage,
  removeTokenFormLocalStorage,
} from "@/lib/localStorage";
import { TokenPayload } from "@/types/jwt.type";

type AuthContextType = {
  role: TokenPayload | undefined;
  login: (accessToken: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  role: undefined,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRole] = useState<TokenPayload | undefined>(undefined);

  // Khi reload page -> check localStorage
  useEffect(() => {
    const accessToken = getAccessTokenFormLocalStorage();
    if (accessToken) {
      const payload = decodeToken(accessToken);
      setRole(payload.role);
    }
  }, []);

  const login = useCallback((accessToken: string) => {
    setAccessTokenToLocalStorage(accessToken);
    const payload = decodeToken(accessToken);
    setRole(payload.role);
  }, []);

  const logout = useCallback(() => {
    removeTokenFormLocalStorage();
    setRole(undefined);
  }, []);

  return (
    <AuthContext.Provider value={{ role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
