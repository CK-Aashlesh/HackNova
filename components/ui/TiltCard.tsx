"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";

type Props = {
  children: ReactNode;
  className?: string;
  intensity?: number; // tilt magnitude in deg
  glare?: boolean;
};

export default function TiltCard({
  children,
  className = "",
  intensity = 10,
  glare = true,
}: Props) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const glareRef = useRef<HTMLDivElement | null>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;

    const px = x / r.width; // 0 to 1
    const py = y / r.height; // 0 to 1

    const rx = (py - 0.5) * -intensity * 2; // tilt around X axis based on Y pos
    const ry = (px - 0.5) * intensity * 2;  // tilt around Y axis based on X pos

    gsap.to(card, {
      rotateX: rx,
      rotateY: ry,
      transformPerspective: 1000,
      duration: 0.5,
      ease: "power2.out",
      overwrite: "auto",
    });

    if (glare && glareRef.current) {
      gsap.to(glareRef.current, {
        opacity: 1,
        background: `radial-gradient(350px circle at ${px * 100}% ${py * 100}%, rgba(212,175,55,0.18), transparent 60%)`,
        duration: 0.5,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  };

  const onLeave = () => {
    const card = cardRef.current;
    if (!card) return;

    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.8,
      ease: "power3.out",
      overwrite: "auto",
    });

    if (glare && glareRef.current) {
      gsap.to(glareRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        overwrite: "auto",
      });
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ transformStyle: "preserve-3d" }}
      className={`relative select-none ${className}`}
    >
      <div style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }} className="h-full w-full">
        {children}
      </div>
      {glare && (
        <div
          ref={glareRef}
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 z-20"
        />
      )}
    </div>
  );
}
