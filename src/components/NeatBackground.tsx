"use client";

import { useEffect, useRef } from "react";
import { NeatGradient } from "@firecms/neat";
import { useNeatBackgroundInit } from "@/hooks/useNeatBackgroundInit";

export function NeatBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isInitialized, setInitialized } = useNeatBackgroundInit();

  useEffect(() => {
    if (!canvasRef.current || isInitialized) return;

    const gradient = new NeatGradient({
      ref: canvasRef.current,
      colors: [
        { color: "#2A4235", enabled: true },
        { color: "#769E7A", enabled: true },
        { color: "#B2C9AB", enabled: true },
        { color: "#E5E5E5", enabled: true },
        { color: "#C4DDC5", enabled: false },
      ],
      speed: 2,
      horizontalPressure: 5,
      verticalPressure: 5,
      waveFrequencyX: 3,
      waveFrequencyY: 3,
      waveAmplitude: 4,
      shadows: 4,
      highlights: 6,
      colorBrightness: 1,
      colorSaturation: 5,
      wireframe: false,
      colorBlending: 8,
      backgroundColor: "#3B7D1E",
      backgroundAlpha: 1,
      grainScale: 2,
      grainSparsity: 0,
      grainIntensity: 0.2,
      grainSpeed: 0.8,
      resolution: 1.2,
      yOffset: 0,
    });

    setInitialized();
    // ❌ Không destroy để giữ hiệu ứng khi chuyển trang
  }, [isInitialized, setInitialized]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10 pointer-events-none"
      suppressHydrationWarning
    />
  );
}
