"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import StoryNestLoader from "@/components/story-nest-loader/StoryNestLoader";

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

  return (
    <div className="mt-3">
      <StoryNestLoader />
    </div>
  );
}
