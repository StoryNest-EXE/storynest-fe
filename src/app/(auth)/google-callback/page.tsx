"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const avatar = params.get("avatar");

    if (token) {
      login(token);

      if (avatar) {
        localStorage.setItem("avatar", avatar);
      }

      router.push("/");
    }
  }, [login, router]);

  return <p>Đang xử lý đăng nhập Google...</p>;
}
