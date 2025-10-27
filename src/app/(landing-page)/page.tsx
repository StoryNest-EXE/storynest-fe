import { Features } from "@/components/landing/Features";
import Hero from "@/components/landing/Hero";
import { NeatBackground } from "@/components/NeatBackground";
import React from "react";

function LadingPage() {
  return (
    <div>
      <NeatBackground />
      <Hero />
      <Features />
    </div>
  );
}

export default LadingPage;
