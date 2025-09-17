"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RequireRole({
  children,
  role,
}: {
  children: React.ReactNode;
  role: "admin" | "user";
}) {
  const { token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      router.replace("/login");
    } else if (token.type !== role) {
      router.replace("/403");
    } else {
      setLoading(false);
    }
  }, [token, role, router]);

  if (loading) return <div>Loading...</div>;

  return <>{children}</>;
}
