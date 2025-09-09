"use client";

import { useAuth } from "@/context/AuthContext";
import https from "@/lib/axios";

export default function Login() {
  const { login } = useAuth();

  const handleLogin = async () => {
    const res = await https.post("/api/Auth/login", {
      usernameOrEmail: "caidenlam@gmail.com",
      password: "123456",
      deviceId: null,
      ipAddress: null,
      userAgent: null,
    });
    console.log(res.data);
    const accessToken = res.data.data.accessToken;
    login(accessToken); // cập nhật vào AuthContext
  };

  return (
    <div className="p-4">
      <button
        onClick={handleLogin}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Login
      </button>
    </div>
  );
}
