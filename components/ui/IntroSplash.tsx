"use client";

import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

const DURATION = 2.5; // seconds - total counter run
const TAIL = 0.4; // seconds - fade-out after hitting 100

/**
 * First-paint intro splash.
 * Matches the rest of the site: meta rules, mono labels, a single
 * editorial counter at the bottom-left, no neon and no glow rings.
 *
 * Mount once at the top of the layout. It self-unmounts after the
 * counter completes plus a short tail fade.
 */
export default function IntroSplash() {
  const [active, setActive] = useState(true);
  const count = useMotionValue(0);
  const numRef = useRef<HTMLSpanElement | null>(null);
  const barWidth = useTransform(count, [0, 100], ["0%", "100%"]);

  useEffect(() => {
    const controls = animate(count, 100, {
      duration: DURATION,
      ease: [0.16, 1, 0.3, 1],
    });

    // Render the integer count into a span without re-rendering React.
    const unsub = count.on("change", (v) => {
      if (numRef.current) {
        numRef.current.textContent = String(Math.floor(v)).padStart(3, "0");
      }
    });

    const t = window.setTimeout(
      () => setActive(false),
      (DURATION + TAIL) * 1000,
    );

    return () => {
      controls.stop();
      unsub();
      window.clearTimeout(t);
    };
  }, [count]);

  // Lock body scroll while the splash is up
  useEffect(() => {
    if (active) {
      const prev = document.documentElement.style.overflow;
      document.documentElement.style.overflow = "hidden";
      return () => {
        document.documentElement.style.overflow = prev;
      };
    }
  }, [active]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: TAIL, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[200] bg-space-black text-white overflow-hidden"
          aria-hidden
        >
          {/* Faint grain so it doesn't look flat */}
          <div className="absolute inset-0 bg-noise opacity-[0.05] mix-blend-overlay pointer-events-none" />

          {/* Top meta row */}
          <div className="absolute top-6 left-6 right-6 flex items-baseline justify-between font-mono text-[10px] tracking-[0.3em] uppercase text-white/55">
            <span>HackNova · 2026</span>
            <span className="hidden sm:block">Aug 29–30</span>
          </div>

          {/* Optional center wordmark - extremely quiet */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-black uppercase tracking-[-0.04em] text-[18vw] sm:text-[14vw] leading-none text-white/[0.04] select-none"
            >
              HACKNOVA
            </motion.div>
          </div>

          {/* Bottom-left counter block */}
          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-6">
            <div className="min-w-0 max-w-[420px] w-full">
              {/* Big number */}
              <div className="flex items-baseline gap-3">
                <span
                  ref={numRef}
                  className="font-display font-black tabular-nums text-white tracking-[-0.04em] text-6xl sm:text-7xl md:text-8xl leading-none"
                >
                  000
                </span>
                <span className="font-mono text-[11px] tracking-[0.25em] uppercase text-white/45">
                  / 100
                </span>
              </div>

              {/* Progress rule */}
              <div className="mt-5 h-px w-full bg-white/10 overflow-hidden">
                <motion.div
                  style={{ width: barWidth }}
                  className="h-full bg-white/85"
                />
              </div>

              {/* Sublabel */}
              <div className="mt-3 font-mono text-[10px] tracking-[0.3em] uppercase text-white/45">
                Loading
              </div>
            </div>

            {/* Right caption */}
            <div className="hidden sm:block font-mono text-[10px] tracking-[0.3em] uppercase text-white/35 text-right">
              Sphere Hive
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
