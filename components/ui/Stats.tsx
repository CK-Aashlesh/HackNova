"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

type Stat = {
  label: string;
  value?: number;
  suffix?: string;
  prefix?: string;
  staticValue?: string;
  desc: string;
};

const stats: Stat[] = [
  { label: "Builders", value: 200, suffix: "+", desc: "Engineers and designers nationwide." },
  { label: "Mentors", value: 20, suffix: "+", desc: "From leading AI research and industry." },
  // Prize pool updated to 50K
  { label: "Prize Pool", value: 50, prefix: "₹", suffix: "K", desc: "Plus sponsored prizes & goodies." },
  { label: "Arena", staticValue: "IIT", desc: "Tirupati · 24-hour offline." },
];

export default function Stats() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      // 1. Entrance staggered card animations: subtle 3D rotational tilt entry
      gsap.from(".stat-card", {
        opacity: 0,
        y: 40,
        rotationX: 12,
        transformOrigin: "50% 0%",
        duration: 1.2,
        ease: "power4.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
        },
      });

      // 2. GSAP Count up
      stats.forEach((s, i) => {
        if (s.staticValue) return;
        const countEl = document.querySelector(`.stat-count-${i}`);
        if (!countEl) return;

        const obj = { val: 0 };
        gsap.to(obj, {
          val: s.value!,
          duration: 2.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          },
          onUpdate: () => {
            countEl.textContent = `${s.prefix || ""}${Math.round(obj.val).toLocaleString()}${s.suffix || ""}`;
          },
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="relative z-20 py-16 md:py-20 overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 border-y border-space-violet/40">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`stat-card px-5 sm:px-7 py-7 sm:py-8 ${
                i < stats.length - 1 ? "lg:border-r border-space-violet/40" : ""
              } ${i % 2 === 0 ? "border-r border-space-violet/40 lg:border-r" : ""} ${
                i < 2 ? "border-b lg:border-b-0 border-space-violet/40" : ""
              }`}
            >
              <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/45 mb-3">
                {s.label}
              </div>
              <div className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-[-0.02em] mb-2">
                {s.staticValue ? (
                  <span>{s.staticValue}</span>
                ) : (
                  <span className={`stat-count-${i}`}>
                    {s.prefix}
                    0
                    {s.suffix}
                  </span>
                )}
              </div>
              <div className="text-[12px] sm:text-[13px] text-white/55 leading-relaxed font-light">
                {s.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
