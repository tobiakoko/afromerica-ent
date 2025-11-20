"use client";

import { useEffect, useRef } from "react";

export function ShaderRGB() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const drawGradient = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Create animated gradient
      const gradient = ctx.createLinearGradient(
        Math.sin(time * 0.001) * width,
        Math.cos(time * 0.001) * height,
        Math.cos(time * 0.001) * width,
        Math.sin(time * 0.001) * height
      );

      gradient.addColorStop(0, `rgba(0, 255, 240, ${0.1 + Math.sin(time * 0.002) * 0.05})`);
      gradient.addColorStop(0.5, `rgba(138, 43, 226, ${0.08 + Math.cos(time * 0.002) * 0.05})`);
      gradient.addColorStop(1, `rgba(255, 105, 180, ${0.1 + Math.sin(time * 0.002) * 0.05})`);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      time += 1;
      animationFrameId = requestAnimationFrame(drawGradient);
    };

    resize();
    drawGradient();

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0 opacity-30"
      style={{ mixBlendMode: "overlay" }}
    />
  );
}