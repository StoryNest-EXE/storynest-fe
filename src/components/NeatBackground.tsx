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
        {
          color: "#472655",
          enabled: true,
        },
        {
          color: "#03162D",
          enabled: true,
        },
        {
          color: "#002027",
          enabled: true,
        },
        {
          color: "#020210",
          enabled: true,
        },
        {
          color: "#02152A",
          enabled: true,
        },
      ],
      speed: 2,
      horizontalPressure: 3,
      verticalPressure: 5,
      waveFrequencyX: 1,
      waveFrequencyY: 3,
      waveAmplitude: 8,
      shadows: 0,
      highlights: 2,
      colorBrightness: 1,
      colorSaturation: 6,
      wireframe: false,
      colorBlending: 7,
      backgroundColor: "#003FFF",
      backgroundAlpha: 1,
      grainScale: 2,
      grainSparsity: 0,
      grainIntensity: 0.175,
      grainSpeed: 1,
      resolution: 1,
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
