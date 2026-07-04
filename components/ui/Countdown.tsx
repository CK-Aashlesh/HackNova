"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

const TARGET = new Date("2026-08-22T09:00:00+05:30").getTime();

function diff(now: number) {
  const d = Math.max(0, TARGET - now);
  return {
    days: Math.floor(d / (1000 * 60 * 60 * 24)),
    hours: Math.floor((d / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((d / 1000 / 60) % 60),
    seconds: Math.floor((d / 1000) % 60),
  };
}

type Props = { compact?: boolean; className?: string };

export default function Countdown({ compact = false, className = "" }: Props) {
  const [time, setTime] = useState(() => diff(Date.now()));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setTime(diff(Date.now())), 1000);
    return () => clearInterval(id);
  }, []);

  if (!mounted) {
    return <div className={`h-12 ${className}`} aria-hidden />;
  }

  const items: Array<[string, number]> = [
    ["DAYS", time.days],
    ["HRS", time.hours],
    ["MIN", time.minutes],
    ["SEC", time.seconds],
  ];

  if (compact) {
    return (
      <div
        className={`inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.25em] uppercase text-white/80 ${className}`}
      >
        <span className="chip-dot" />
        T-MINUS {time.days}D : {String(time.hours).padStart(2, "0")}H :{" "}
        {String(time.minutes).padStart(2, "0")}M :{" "}
        {String(time.seconds).padStart(2, "0")}S
      </div>
    );
  }

  return (
    <div
      className={`inline-grid grid-cols-4 gap-1.5 sm:gap-3 ${className}`}
      role="timer"
      aria-label="Countdown to HackNova 2026"
    >
      {items.map(([label, val], i) => (
        <div
          key={label}
          className="relative glass-card rounded-xl px-2 sm:px-4 py-2.5 sm:py-3 min-w-[58px] sm:min-w-[88px] text-center overflow-hidden border-gradient"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-space-purple/60 to-transparent" />
          <motion.div
            key={val}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-2xl sm:text-3xl md:text-4xl font-black tabular-nums text-white"
          >
            {String(val).padStart(2, "0")}
          </motion.div>
          <div className="font-mono text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-white/55 mt-1">
            {label}
          </div>
          {i < 3 && (
            <span className="hidden sm:block absolute -right-1.5 top-1/2 -translate-y-1/2 text-space-purple/60 font-display font-black">
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
