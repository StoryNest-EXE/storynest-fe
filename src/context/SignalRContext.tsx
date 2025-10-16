// contexts/SignalRContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import * as signalR from "@microsoft/signalr";
import { getAccessTokenFromLocalStorage } from "@/lib/localStorage";

// Giả sử bạn có một hook để lấy thông tin auth
// import { useAuth } from "@/hooks/useAuth";

interface SignalRContextType {
  connection: signalR.HubConnection | null;
}

const SignalRContext = createContext<SignalRContextType>({ connection: null });

export const useSignalR = () => useContext(SignalRContext);

export const SignalRProvider = ({ children }: { children: ReactNode }) => {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );
  // const { token } = useAuth(); // Lấy token từ context/hook quản lý auth của bạn

  // Tạm thời dùng token từ localStorage để demo
  const token =
    typeof window !== "undefined" ? getAccessTokenFromLocalStorage() : null;

  useEffect(() => {
    if (token) {
      const newConnection = new signalR.HubConnectionBuilder()
        .withUrl("https://api.storynest.io.vn/hubs/notify", {
          accessTokenFactory: () => token,
        })
        .withAutomaticReconnect() // Tự động kết nối lại nếu mất mạng
        .configureLogging(signalR.LogLevel.Information)
        .build();

      setConnection(newConnection);
    }
  }, [token]);

  useEffect(() => {
    if (
      connection &&
      connection.state === signalR.HubConnectionState.Disconnected
    ) {
      connection
        .start()
        .then(() => {
          console.log("✅ SignalR Connected!");
        })
        .catch((err) => console.error("SignalR Connection Error: ", err));
    }

    // Cleanup: Ngắt kết nối khi component bị unmount (ví dụ khi user logout)
    return () => {
      connection?.stop().then(() => console.log("🔌 SignalR Disconnected."));
    };
  }, [connection]);

  return (
    <SignalRContext.Provider value={{ connection }}>
      {children}
    </SignalRContext.Provider>
  );
};
