"use client";
import { useMemo } from "react";
import { NeatBackground } from "@/components/NeatBackground";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const background = useMemo(() => <NeatBackground />, []);
  return (
    <div className="relative">
      {background}
      <main className="relative z-10">{children}</main>
    </div>
  );
}
