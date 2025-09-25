"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function GoogleCallbackClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    const avatar = searchParams.get("avatar");

    if (token) {
      login(token);

      if (avatar) {
        localStorage.setItem("avatar", avatar);
      }

      router.push("/");
    }
  }, [searchParams, login, router]);

  return (
    <Suspense fallback={<p>Đang xử lý đăng nhập Google...</p>}>
      <GoogleCallbackClient />
    </Suspense>
  );
}
