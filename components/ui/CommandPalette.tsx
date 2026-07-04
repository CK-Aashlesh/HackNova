"use client";

import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  Calendar,
  ExternalLink,
  FileText,
  HelpCircle,
  Home as HomeIcon,
  Mail,
  MessageCircle,
  Rocket,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Action = {
  id: string;
  label: string;
  hint?: string;
  group: string;
  icon: React.ReactNode;
  keywords?: string;
  run: () => void;
};

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [konamiUnlocked, setKonamiUnlocked] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const konamiBuf = useRef<string[]>([]);

  // ----- Actions -----
  const goto = useCallback((id: string) => {
    if (window.location.pathname !== "/") {
      window.location.href = "/#" + id;
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const baseActions = useMemo<Action[]>(
    () => [
      // Navigate
      { id: "nav-home", label: "Top of page", group: "Navigate", icon: <HomeIcon className="w-3.5 h-3.5" />, keywords: "home hero", run: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
      { id: "nav-about", label: "About the mission", group: "Navigate", icon: <Sparkles className="w-3.5 h-3.5" />, keywords: "about mission", run: () => goto("about") },
      { id: "nav-challenge", label: "The challenge", group: "Navigate", icon: <Zap className="w-3.5 h-3.5" />, keywords: "challenge data centric 3lc", run: () => goto("challenge") },
      { id: "nav-schedule", label: "Schedule", group: "Navigate", icon: <Calendar className="w-3.5 h-3.5" />, keywords: "schedule timeline", run: () => goto("schedule") },
      { id: "nav-sponsors", label: "Sponsors & partners", group: "Navigate", icon: <Trophy className="w-3.5 h-3.5" />, keywords: "sponsors partners", run: () => goto("sponsors") },
      { id: "nav-faq", label: "FAQ", group: "Navigate", icon: <HelpCircle className="w-3.5 h-3.5" />, keywords: "faq questions", run: () => goto("faq") },
      { id: "nav-sphere", label: "About Sphere Hive", group: "Navigate", icon: <Users className="w-3.5 h-3.5" />, keywords: "sphere hive team", run: () => goto("sphere-hive") },

      // Actions
      { id: "act-register", label: "Register for HackNova", hint: "Opens Unstop", group: "Actions", icon: <Rocket className="w-3.5 h-3.5" />, keywords: "register signup join", run: () => window.open("https://unstop.com/p/hacknova-sphere-hive-kvg-college-of-engineering-sullia-1693176", "_blank", "noopener,noreferrer") },
      { id: "act-manifesto", label: "Read the manifesto", group: "Actions", icon: <FileText className="w-3.5 h-3.5" />, keywords: "manifesto why data centric", run: () => (window.location.href = "/manifesto") },
      { id: "act-email", label: "Email the organisers", hint: "spherehive@kvgce.ac.in", group: "Actions", icon: <Mail className="w-3.5 h-3.5" />, keywords: "email contact mail", run: () => (window.location.href = "mailto:spherehive@kvgce.ac.in") },
      { id: "act-whatsapp", label: "Join the WhatsApp community", group: "Actions", icon: <MessageCircle className="w-3.5 h-3.5" />, keywords: "whatsapp community chat", run: () => window.open("https://chat.whatsapp.com/IhdbBT7OKAd1LHpYy9XBkc", "_blank", "noopener,noreferrer") },

      // System
      { id: "sys-admin", label: "Open Mission Control", hint: "Admin", group: "System", icon: <ShieldCheck className="w-3.5 h-3.5" />, keywords: "admin login", run: () => (window.location.href = "/admin") },
      { id: "sys-source", label: "View source on GitHub", group: "System", icon: <ExternalLink className="w-3.5 h-3.5" />, keywords: "source github code", run: () => window.open("https://github.com", "_blank", "noopener,noreferrer") },
    ],
    [goto]
  );

  const easterActions = useMemo<Action[]>(
    () => [
      { id: "egg-boot", label: "Boot sequence", hint: "Reload the splash", group: "Easter Eggs", icon: <Sparkles className="w-3.5 h-3.5" />, keywords: "boot splash intro", run: () => window.location.reload() },
      { id: "egg-snake", label: "Lost in space (snake)", group: "Easter Eggs", icon: <Zap className="w-3.5 h-3.5" />, keywords: "snake game 404", run: () => (window.location.href = "/lost") },
    ],
    []
  );

  const actions = konamiUnlocked ? [...baseActions, ...easterActions] : baseActions;

  // ----- Filter -----
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter((a) => {
      const hay = `${a.label} ${a.hint ?? ""} ${a.keywords ?? ""} ${a.group}`.toLowerCase();
      return q.split(/\s+/).every((token) => hay.includes(token));
    });
  }, [actions, query]);

  // group filtered list
  const grouped = useMemo(() => {
    const out: Record<string, Action[]> = {};
    for (const a of filtered) {
      (out[a.group] ||= []).push(a);
    }
    return out;
  }, [filtered]);

  // Reset active when filter changes
  useEffect(() => {
    setActive(0);
  }, [query, open]);

  // ----- Keyboard: open / close / konami / `?` -----
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Konami buffer (ignore while typing in palette)
      if (!open) {
        konamiBuf.current.push(e.key);
        if (konamiBuf.current.length > KONAMI.length) konamiBuf.current.shift();
        if (
          konamiBuf.current.length === KONAMI.length &&
          konamiBuf.current.every((k, i) => k.toLowerCase() === KONAMI[i].toLowerCase())
        ) {
          setKonamiUnlocked(true);
          setOpen(true);
          konamiBuf.current = [];
          return;
        }
      }

      const target = e.target as HTMLElement | null;
      const isTyping =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      // Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
        return;
      }

      // `?` - only when not typing
      if (!isTyping && (e.key === "?" || (e.key === "/" && e.shiftKey))) {
        e.preventDefault();
        setOpen(true);
        return;
      }

      // Escape closes
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Lock scroll while open
  useEffect(() => {
    if (open) {
      const prev = document.documentElement.style.overflow;
      document.documentElement.style.overflow = "hidden";
      // focus input next tick
      const t = window.setTimeout(() => inputRef.current?.focus(), 30);
      return () => {
        document.documentElement.style.overflow = prev;
        window.clearTimeout(t);
      };
    }
  }, [open]);

  // ----- Active row navigation -----
  const onListKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(filtered.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const a = filtered[active];
      if (a) {
        a.run();
        setOpen(false);
      }
    }
  };

  // Scroll active into view
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLLIElement>(`[data-idx='${active}']`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[150] flex items-start justify-center pt-[12vh] px-4 bg-space-black/80 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ y: -8, opacity: 0, scale: 0.985 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -8, opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={onListKey}
            className="w-full max-w-xl overflow-hidden rounded-xl border border-white/15 bg-[#06041a]/95 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]"
          >
            {/* Header / prompt */}
            <div className="flex items-center gap-3 border-b border-space-violet/40 px-4 sm:px-5 h-14">
              <span className="font-mono text-xs text-white/55 select-none">
                hacknova:~$
              </span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="type a command…"
                className="flex-1 bg-transparent outline-none font-mono text-sm tracking-tight text-white placeholder:text-white/30 caret-space-purple"
                spellCheck={false}
                autoComplete="off"
              />
              <kbd className="hidden sm:inline-block font-mono text-[10px] tracking-[0.2em] uppercase text-white/45 border border-space-violet/40 rounded px-1.5 py-0.5">
                ESC
              </kbd>
            </div>

            {/* List */}
            <ul
              ref={listRef}
              className="max-h-[55vh] overflow-y-auto py-2"
              role="listbox"
            >
              {filtered.length === 0 && (
                <li className="px-5 py-6 font-mono text-xs text-white/45 text-center">
                  ⌐ no commands match &ldquo;{query}&rdquo;
                </li>
              )}

              {Object.entries(grouped).map(([group, items]) => (
                <li key={group} className="py-1">
                  <div className="px-5 py-2 font-mono text-[10px] tracking-[0.3em] uppercase text-white/35">
                    {group}
                  </div>
                  <ul>
                    {items.map((a) => {
                      const idx = filtered.indexOf(a);
                      const isActive = idx === active;
                      return (
                        <li
                          key={a.id}
                          data-idx={idx}
                          onMouseEnter={() => setActive(idx)}
                          onClick={() => {
                            a.run();
                            setOpen(false);
                          }}
                          className={`mx-2 my-0.5 px-3 py-2.5 rounded-md flex items-center gap-3 cursor-pointer transition-colors ${
                            isActive
                              ? "bg-white/[0.08] text-white"
                              : "text-white/75 hover:text-white"
                          }`}
                          role="option"
                          aria-selected={isActive}
                        >
                          <span
                            className={`w-6 h-6 inline-flex items-center justify-center rounded ${
                              isActive ? "text-white" : "text-white/55"
                            }`}
                          >
                            {a.icon}
                          </span>
                          <span className="flex-1 truncate text-[13px] tracking-tight">
                            {a.label}
                          </span>
                          {a.hint && (
                            <span className="hidden sm:inline-block font-mono text-[10px] tracking-[0.18em] uppercase text-white/40">
                              {a.hint}
                            </span>
                          )}
                          <ArrowRight
                            className={`w-3.5 h-3.5 transition-transform ${
                              isActive
                                ? "translate-x-0.5 text-space-purple-glow"
                                : "text-white/25"
                            }`}
                          />
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ul>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-space-violet/40 px-4 sm:px-5 h-10 font-mono text-[10px] tracking-[0.22em] uppercase text-white/45">
              <div className="flex items-center gap-3">
                <span>
                  <kbd className="border border-space-violet/40 rounded px-1.5 py-0.5 mr-1.5">↑</kbd>
                  <kbd className="border border-space-violet/40 rounded px-1.5 py-0.5">↓</kbd>{" "}
                  navigate
                </span>
                <span className="hidden sm:inline">
                  <kbd className="border border-space-violet/40 rounded px-1.5 py-0.5">↵</kbd> run
                </span>
              </div>
              <div className="flex items-center gap-2">
                {konamiUnlocked && (
                  <span className="text-space-purple-glow">
                    ✦ konami unlocked
                  </span>
                )}
                <span>
                  <kbd className="border border-space-violet/40 rounded px-1.5 py-0.5">⌘K</kbd> /{" "}
                  <kbd className="border border-space-violet/40 rounded px-1.5 py-0.5">?</kbd>
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
