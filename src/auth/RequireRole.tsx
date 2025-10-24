"use client";

import { NeatBackground } from "@/components/NeatBackground";
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
  const { token, initialized } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!initialized) return;
    console.log("tyoe nè", token?.type);
    if (!token) {
      router.replace("/login");
    } else if (token.type !== role) {
      router.replace("/403");
    } else {
      setLoading(false);
    }
  }, [token, role, router, initialized]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        {/* Vẫn có background phía sau vì NeatBackground nằm ngoài RequireRole */}
        <span>Loading...</span>
      </div>
    );
  }

  return <>{children}</>;
}
