"use client";

import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import { Menu, X, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const navItems = ["Home", "About", "Challenge", "Schedule", "Sponsors", "FAQ"];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Home");
  const [hidden, setHidden] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [indicator, setIndicator] = useState<{
    left: number;
    width: number;
  } | null>(null);

  // Auto-hide nav on scroll down, reveal on scroll up
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    if (isOpen) return; // don't hide while menu is open
    if (latest > prev && latest > 140) setHidden(true);
    else setHidden(false);
  });

  // Active section tracking
  useEffect(() => {
    if (window.location.pathname !== "/") return;

    const sections = navItems.map((item) => {
      const id = item === "Schedule" ? "schedule" : item.toLowerCase();
      return { id, item, el: document.getElementById(id) };
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const matched = sections.find((s) => s.id === entry.target.id);
            if (matched) setActiveTab(matched.item);
          }
        });
      },
      { rootMargin: "-30% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((sec) => sec.el && observer.observe(sec.el));
    return () => observer.disconnect();
  }, []);

  // Sliding indicator follows hover or active
  useEffect(() => {
    const idx = hoverIndex !== null ? hoverIndex : navItems.indexOf(activeTab);
    const el = tabRefs.current[idx];
    if (el) {
      const parent = el.parentElement!.getBoundingClientRect();
      const rect = el.getBoundingClientRect();
      setIndicator({ left: rect.left - parent.left, width: rect.width });
    }
  }, [activeTab, hoverIndex]);

  // Lock body scroll while mobile menu open + close on Esc
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  const goTo = (item: string) => {
    setActiveTab(item);
    const id = item === "Schedule" ? "schedule" : item.toLowerCase();
    if (window.location.pathname === "/") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = "/#" + id;
    }
  };

  return (
    <>
      {/* Mobile-only backdrop, closes menu on tap */}
      <AnimatePresence>
        {isOpen && (
          <motion.button
            type="button"
            aria-label="Close menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="md:hidden fixed inset-0 z-40 bg-space-black/60 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: hidden ? -120 : 0, opacity: hidden ? 0 : 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 w-[calc(100%-1.5rem)] sm:w-[92%] max-w-5xl z-50"
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      >
        <div className="glass-pill rounded-full pl-3 pr-2 sm:pl-5 sm:pr-2.5 py-2 sm:py-2.5 flex items-center justify-between gap-2 border-gradient">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-2.5 text-white font-display font-black tracking-[2px] group min-w-0"
            onClick={() => setIsOpen(false)}
          >
            <span className="relative inline-flex shrink-0">
              <span className="absolute inset-0 rounded-full bg-space-purple/40 blur-md group-hover:blur-lg transition-all" />
              <img
                src="/logo.png"
                alt="HackNova"
                className="relative h-6 w-6 sm:h-7 sm:w-7 object-contain"
              />
            </span>
            <span className="text-[11px] sm:text-[13px] bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent truncate">
              HACKNOVA
            </span>
          </Link>

          {/* Desktop nav with sliding pill */}
          <div
            className="hidden md:flex items-center gap-1 relative"
            onMouseLeave={() => setHoverIndex(null)}
          >
            {indicator && (
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 h-8 rounded-full bg-white/[0.06] border border-space-violet/40"
                animate={{ left: indicator.left, width: indicator.width }}
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}

            {navItems.map((item, i) => (
              <button
                key={item}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                onMouseEnter={() => setHoverIndex(i)}
                onClick={() => goTo(item)}
                className={`relative px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] font-semibold transition-colors ${
                  activeTab === item
                    ? "text-white"
                    : "text-ink-dim hover:text-white"
                }`}
              >
                {item}
                {activeTab === item && (
                  <motion.span
                    layoutId="active-dot"
                    className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-space-purple shadow-[0_0_8px_rgba(212,175,55,0.9)]"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Right cluster */}
          <div className="flex items-center gap-2 shrink-0">
            {/* ⌘K hint - desktop only */}
            <button
              type="button"
              onClick={() => {
                const isMac = /Mac|iPhone|iPad/.test(navigator.platform);
                window.dispatchEvent(
                  new KeyboardEvent("keydown", {
                    key: "k",
                    metaKey: isMac,
                    ctrlKey: !isMac,
                    bubbles: true,
                  })
                );
              }}
              className="hidden lg:inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] uppercase text-white/45 hover:text-white transition-colors"
              aria-label="Open command palette"
            >
              <kbd className="border border-space-violet/40 rounded px-1.5 py-0.5">⌘</kbd>
              <kbd className="border border-space-violet/40 rounded px-1.5 py-0.5">K</kbd>
            </button>

            {/* Register Button */}
            <Link
              href="/register"
              className="btn-primary px-3.5 py-1.5 md:px-5 md:py-2 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.08em] md:tracking-[0.12em] !rounded-full flex items-center gap-1 shrink-0"
            >
              Register
              <ChevronRight className="w-3 h-3 md:w-3.5 md:h-3.5" />
            </Link>

            {/* Hamburger Button */}
            <button
              className="md:hidden text-white bg-white/[0.07] border border-white/10 p-2 rounded-full hover:bg-white/15 active:bg-white/20 transition-all shrink-0 flex items-center justify-center w-9 h-9"
              onClick={() => setIsOpen((v) => !v)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.99 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-full left-0 right-0 mt-2 glass-panel rounded-2xl p-2.5 flex flex-col gap-1 md:hidden border-gradient max-h-[calc(100vh-7rem)] overflow-y-auto"
            >
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    goTo(item);
                    setIsOpen(false);
                  }}
                  className={`px-4 py-3 rounded-xl text-left font-medium text-sm tracking-[0.08em] uppercase transition-colors ${
                    activeTab === item
                      ? "bg-space-purple/15 text-white border border-space-purple/30"
                      : "text-ink-dim hover:text-white hover:bg-white/[0.04] border border-transparent"
                  }`}
                >
                  {item}
                </button>
              ))}
              {/* No duplicate Register button here since the main navbar Register button is always visible */}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
