"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function GoogleCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    const avatar = searchParams.get("avatar");

    if (token) {
      // gọi login() trong AuthContext
      login(token);

      // nếu muốn lưu avatar
      if (avatar) {
        localStorage.setItem("avatar", avatar);
      }

      // redirect về home sau khi login
      router.push("/");
    }
  }, [searchParams, login, router]);

  return <p>Đang xử lý đăng nhập Google...</p>;
}
