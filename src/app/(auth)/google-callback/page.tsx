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
    const planId = params.get("planId");
    const planName = params.get("planName");

    if (token) {
      login(token);

      if (avatar) {
        localStorage.setItem("avatar", avatar);
      }

      if (planId) {
        localStorage.setItem("plainId", planId);
      } else {
        localStorage.setItem("planId", "null");
      }

      if (planName) {
        localStorage.setItem("planName", planName);
      } else {
        localStorage.setItem("planName", "null");
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
