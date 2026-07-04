"use client";

import { motion, useScroll, useSpring } from "motion/react";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.4,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[2px] origin-left z-[60] pointer-events-none"
    >
      <div className="h-full w-full bg-gradient-to-r from-space-purple via-space-purple-glow to-cyan-glow shadow-[0_0_12px_rgba(212,175,55,0.7)]" />
    </motion.div>
  );
}
