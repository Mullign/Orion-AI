"use client";

import { useEffect, useRef } from "react";

type Star = {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  layer: number;
};

function createStars(width: number, height: number, count: number): Star[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 1.4 + 0.3,
    opacity: Math.random() * 0.5 + 0.3,
    twinkleSpeed: Math.random() * 0.015 + 0.005,
    twinkleOffset: Math.random() * Math.PI * 2,
    layer: Math.random() < 0.35 ? 2 : Math.random() < 0.55 ? 1 : 0,
  }));
}

export function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let animationFrame = 0;
    let stars: Star[] = [];
    let width = 0;
    let height = 0;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      stars = createStars(width, height, prefersReducedMotion ? 80 : 180);
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);

      for (const star of stars) {
        const drift =
          prefersReducedMotion ? 0 : (star.layer + 1) * 0.015;
        star.x = (star.x + drift) % width;
        if (star.x < 0) star.x += width;

        const twinkle = prefersReducedMotion
          ? star.opacity
          : star.opacity *
            (0.55 +
              0.45 *
                Math.sin(time * star.twinkleSpeed + star.twinkleOffset));

        context.beginPath();
        context.fillStyle = `rgba(255, 255, 255, ${twinkle})`;
        context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        context.fill();
      }

      animationFrame = window.requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    animationFrame = window.requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="space-bg absolute inset-0" />
      <div className="nebula nebula-one absolute inset-0" />
      <div className="nebula nebula-two absolute inset-0" />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(3,0,20,0.35)_45%,rgba(3,0,20,0.92))]" />
    </div>
  );
}
