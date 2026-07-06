"use client";

import { motion, AnimatePresence } from "motion/react";
import { X, Send, MessageCircle } from "lucide-react";
import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  type FormEvent,
} from "react";

/* ─────────────────────────────────────────────
   Types & Constants
   ───────────────────────────────────────────── */

type CuratorPose =
  | "idle"
  | "wave"
  | "thinking"
  | "surprise"
  | "point_left"
  | "point_right"
  | "thumbs_up"
  | "celebrate"
  | "sleep"
  | "look_around"
  | "happy"
  | "sad"
  | "jump";

/** Map every pose to its sprite path. */
const POSE_IMAGES: Record<CuratorPose, string> = {
  idle: "/mascot/idle.png",
  wave: "/mascot/wave.png",
  thinking: "/mascot/thinking.png",
  surprise: "/mascot/surprise.png",
  point_left: "/mascot/point_left.png",
  point_right: "/mascot/point_right.png",
  thumbs_up: "/mascot/thumbs_up.png",
  celebrate: "/mascot/celebrate.png",
  sleep: "/mascot/sleep.png",
  look_around: "/mascot/look_around.png",
  happy: "/mascot/happy.png",
  sad: "/mascot/sad.png",
  jump: "/mascot/jump.png",
};

/** Speech bubble presets for autonomous reactions. */
const POSE_SPEECH: Partial<Record<CuratorPose, string[]>> = {
  wave: ["Hi! I'm The Curator.", "Need help with HackNova?"],
  thinking: ["Thinking..."],
  surprise: ["Wow!"],
  thumbs_up: ["You're all set!"],
  celebrate: ["Amazing!"],
  look_around: ["Still exploring?"],
  happy: ["Glad I could help!"],
  sad: ["Oops... let's try again."],
};

/** When a page section scrolls into view, the mascot reacts. */
const SECTION_REACTIONS: Record<string, { pose: CuratorPose; speech: string }> =
  {
    home: { pose: "wave", speech: "Welcome to HackNova!" },
    challenge: { pose: "surprise", speech: "Check out the challenge!" },
    schedule: { pose: "point_left", speech: "Here's the timeline." },
    sponsors: { pose: "point_right", speech: "Check out our sponsors." },
    faq: { pose: "point_left", speech: "Got questions? Check the FAQ." },
    "sphere-hive": {
      pose: "happy",
      speech: "Meet the team behind HackNova!",
    },
    footer: { pose: "wave", speech: "See you at HackNova! 👋" },
  };

/** Section IDs to observe with IntersectionObserver. */
const OBSERVED_SECTIONS = [
  "home",
  "challenge",
  "schedule",
  "sponsors",
  "faq",
  "sphere-hive",
];

/** Timing constants (ms). */
const SPEECH_DISMISS_MS = 4000;
const INACTIVITY_LOOK_MS = 25_000;
const INACTIVITY_SLEEP_MS = 150_000;
const POSE_RESET_MS = 3000;
const HOVER_RESET_MS = 2000;
const HEAD_TILT_MIN_MS = 25_000;
const HEAD_TILT_MAX_MS = 35_000;

/* ─────────────────────────────────────────────
   Sub-components
   ───────────────────────────────────────────── */

/** Glassmorphic speech bubble with tail. */
function SpeechBubble({ text }: { text: string }) {
  return (
    <motion.div
      key={text}
      initial={{ opacity: 0, y: 6, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.92 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="absolute -top-16 left-1/2 -translate-x-1/2 z-10 pointer-events-none select-none"
    >
      <div
        className="relative rounded-xl px-3.5 py-2.5 font-sans text-[13px] leading-snug text-white/90 max-w-[200px] text-center whitespace-pre-line"
        style={{
          background: "rgba(28, 28, 28, 0.9)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(212, 175, 55, 0.3)",
        }}
      >
        {text}
        {/* Tail */}
        <span
          className="absolute left-1/2 -translate-x-1/2 -bottom-[6px] w-3 h-3 rotate-45"
          style={{
            background: "rgba(28, 28, 28, 0.9)",
            borderRight: "1px solid rgba(212, 175, 55, 0.3)",
            borderBottom: "1px solid rgba(212, 175, 55, 0.3)",
          }}
        />
      </div>
    </motion.div>
  );
}

/** Particle effects keyed by pose. */
function Particles({
  pose,
  reducedMotion,
}: {
  pose: CuratorPose;
  reducedMotion: boolean;
}) {
  if (reducedMotion) return null;

  // Sparkles for celebrate / jump
  if (pose === "celebrate" || pose === "jump") {
    return (
      <AnimatePresence>
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.span
            key={`sparkle-${i}`}
            className="absolute text-[#D4AF37] pointer-events-none select-none"
            style={{
              left: `${30 + Math.random() * 40}%`,
              bottom: "60%",
              fontSize: 8 + Math.random() * 4,
            }}
            initial={{ opacity: 1, y: 0, x: 0 }}
            animate={{
              opacity: 0,
              y: -(40 + Math.random() * 30),
              x: (Math.random() - 0.5) * 40,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 + Math.random() * 0.4, ease: "easeOut" }}
          >
            ✦
          </motion.span>
        ))}
      </AnimatePresence>
    );
  }

  // Zzz for sleep
  if (pose === "sleep") {
    return (
      <AnimatePresence>
        {["Z", "z", "Z"].map((z, i) => (
          <motion.span
            key={`zzz-${i}`}
            className="absolute font-display text-white/30 pointer-events-none select-none"
            style={{
              right: `${10 + i * 12}%`,
              top: `${10 + i * 8}%`,
              fontSize: 14 - i * 2,
            }}
            initial={{ opacity: 0, y: 0, x: 0 }}
            animate={{ opacity: [0, 0.6, 0], y: -20 - i * 10, x: -(8 + i * 6) }}
            transition={{
              duration: 2.5,
              delay: i * 0.7,
              repeat: Infinity,
              repeatDelay: 1,
              ease: "easeOut",
            }}
          >
            {z}
          </motion.span>
        ))}
      </AnimatePresence>
    );
  }

  // Hearts for happy
  if (pose === "happy") {
    return (
      <AnimatePresence>
        {[0, 1, 2].map((i) => (
          <motion.span
            key={`heart-${i}`}
            className="absolute text-red-400/80 pointer-events-none select-none"
            style={{
              left: `${35 + i * 12}%`,
              bottom: "70%",
              fontSize: 10 + i * 2,
            }}
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: -(25 + i * 10) }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1.4,
              delay: i * 0.25,
              ease: "easeOut",
            }}
          >
            ♥
          </motion.span>
        ))}
      </AnimatePresence>
    );
  }

  // Thinking dots
  if (pose === "thinking") {
    return (
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex gap-1 pointer-events-none">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={`dot-${i}`}
            className="w-1.5 h-1.5 rounded-full bg-white/50"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 1.2,
              delay: i * 0.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    );
  }

  return null;
}

/* ─────────────────────────────────────────────
   Main Component
   ───────────────────────────────────────────── */

type ChatMessage = { role: "user" | "curator"; text: string };

export default function TheCurator() {
  /* ── SSR guard ── */
  const [mounted, setMounted] = useState(false);

  /* ── Core state ── */
  const [pose, setPose] = useState<CuratorPose>("idle");
  const [speech, setSpeech] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "curator",
      text: "Hi! I'm The Curator, your guide to HackNova 2026. Ask me anything about the hackathon!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSleeping, setIsSleeping] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  /* ── Drag constraints ── */
  const [dragConstraints, setDragConstraints] = useState({
    left: -800,
    right: 20,
    top: -800,
    bottom: 20,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const updateConstraints = () => {
      const size = window.innerWidth >= 768 ? 162 : window.innerWidth >= 640 ? 138 : 110;
      setDragConstraints({
        left: -window.innerWidth + size + 16,
        right: 16,
        top: -window.innerHeight + size + 16,
        bottom: 16,
      });
    };
    updateConstraints();
    window.addEventListener("resize", updateConstraints);
    return () => window.removeEventListener("resize", updateConstraints);
  }, []);

  /* ── Refs ── */
  const speechTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const poseResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const headTiltTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastActivityRef = useRef<number>(Date.now());
  const inactivityIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reactedSectionsRef = useRef<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const mascotRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  /* ── Helpers ── */

  /** Clear the speech auto-dismiss timer. */
  const clearSpeechTimer = useCallback(() => {
    if (speechTimerRef.current) {
      clearTimeout(speechTimerRef.current);
      speechTimerRef.current = null;
    }
  }, []);

  /** Clear the pose reset timer. */
  const clearPoseResetTimer = useCallback(() => {
    if (poseResetTimerRef.current) {
      clearTimeout(poseResetTimerRef.current);
      poseResetTimerRef.current = null;
    }
  }, []);

  /** Show speech text with auto-dismiss. */
  const showSpeech = useCallback(
    (text: string, duration = SPEECH_DISMISS_MS) => {
      clearSpeechTimer();
      setSpeech(text);
      speechTimerRef.current = setTimeout(() => setSpeech(null), duration);
    },
    [clearSpeechTimer]
  );

  /** Transition to a pose, optionally with speech, and auto-return to idle. */
  const triggerPose = useCallback(
    (
      newPose: CuratorPose,
      speechText?: string | null,
      autoReset = true,
      resetMs = POSE_RESET_MS
    ) => {
      clearPoseResetTimer();
      setPose(newPose);
      setIsSleeping(newPose === "sleep");

      if (speechText) {
        showSpeech(speechText);
      }

      if (autoReset && newPose !== "idle" && newPose !== "sleep") {
        poseResetTimerRef.current = setTimeout(() => {
          setPose("idle");
          setIsSleeping(false);
        }, resetMs);
      }
    },
    [clearPoseResetTimer, showSpeech]
  );

  /** Record user activity. */
  const recordActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
  }, []);

  /* ── Mount ── */
  useEffect(() => {
    setMounted(true);
  }, []);

  /* ── Reduced motion ── */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  /* ── Image preloading ── */
  useEffect(() => {
    if (typeof window === "undefined") return;
    Object.values(POSE_IMAGES).forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  /* ── First visit wave ── */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const visited = sessionStorage.getItem("curator-visited");
    if (!visited) {
      const greetings = POSE_SPEECH.wave ?? [];
      const greeting =
        greetings[Math.floor(Math.random() * greetings.length)] ??
        "Hi! I'm The Curator.";
      triggerPose("wave", greeting, true, SPEECH_DISMISS_MS);
      sessionStorage.setItem("curator-visited", "true");
    }
  }, [triggerPose]);

  /* ── Inactivity detection ── */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const events = ["mousemove", "scroll", "keydown", "touchstart"] as const;
    const onActivity = () => {
      recordActivity();
      // Wake up if sleeping or looking around
      if (isSleeping || pose === "look_around") {
        setPose("idle");
        setIsSleeping(false);
        setSpeech(null);
        clearSpeechTimer();
      }
    };

    events.forEach((e) => window.addEventListener(e, onActivity, { passive: true }));

    inactivityIntervalRef.current = setInterval(() => {
      if (chatOpen) return; // Don't sleep while chatting
      const elapsed = Date.now() - lastActivityRef.current;
      if (elapsed >= INACTIVITY_SLEEP_MS && !isSleeping) {
        triggerPose("sleep", undefined, false);
      } else if (
        elapsed >= INACTIVITY_LOOK_MS &&
        !isSleeping &&
        pose === "idle"
      ) {
        triggerPose("look_around", "Still exploring?", false);
      }
    }, 5000);

    return () => {
      events.forEach((e) => window.removeEventListener(e, onActivity));
      if (inactivityIntervalRef.current) {
        clearInterval(inactivityIntervalRef.current);
      }
    };
  }, [
    chatOpen,
    isSleeping,
    pose,
    recordActivity,
    triggerPose,
    clearSpeechTimer,
  ]);

  /* ── Head tilt (idle micro-interaction) ── */
  useEffect(() => {
    if (typeof window === "undefined" || reducedMotion) return;

    const scheduleHeadTilt = () => {
      const delay =
        HEAD_TILT_MIN_MS +
        Math.random() * (HEAD_TILT_MAX_MS - HEAD_TILT_MIN_MS);
      headTiltTimerRef.current = setTimeout(() => {
        if (mascotRef.current && pose === "idle") {
          const dir = Math.random() > 0.5 ? 1 : -1;
          mascotRef.current.style.transition = "transform 0.6s ease-in-out";
          mascotRef.current.style.transform = `rotate(${dir * 3}deg)`;
          setTimeout(() => {
            if (mascotRef.current) {
              mascotRef.current.style.transform = "rotate(0deg)";
            }
          }, 600);
        }
        scheduleHeadTilt();
      }, delay);
    };

    scheduleHeadTilt();
    return () => {
      if (headTiltTimerRef.current) clearTimeout(headTiltTimerRef.current);
    };
  }, [pose, reducedMotion]);

  /* ── Scroll awareness (IntersectionObserver) ── */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleIntersection: IntersectionObserverCallback = (entries) => {
      for (const entry of entries) {
        const id = entry.target.id || (entry.target.tagName === "FOOTER" ? "footer" : "");
        if (!id) continue;

        if (entry.isIntersecting) {
          const reaction = SECTION_REACTIONS[id];
          if (
            reaction &&
            !reactedSectionsRef.current.has(id) &&
            pose === "idle" &&
            !chatOpen
          ) {
            reactedSectionsRef.current.add(id);
            triggerPose(reaction.pose, reaction.speech, true, SPEECH_DISMISS_MS);
          }
        } else {
          // Reset so we can re-trigger when section comes back
          reactedSectionsRef.current.delete(id);
        }
      }
    };

    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold: 0.3,
    });

    // Observe named sections
    OBSERVED_SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observerRef.current!.observe(el);
    });

    // Observe footer element
    const footer = document.querySelector("footer");
    if (footer) observerRef.current.observe(footer);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [pose, chatOpen, triggerPose]);

  /* ── Custom event listener ── */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as {
        action?: CuratorPose;
        message?: string;
      };
      if (detail?.action) {
        triggerPose(detail.action, detail.message ?? null, true, SPEECH_DISMISS_MS);
      }
    };

    window.addEventListener("curator-event", handler);
    return () => window.removeEventListener("curator-event", handler);
  }, [triggerPose]);

  /* ── Chat auto-scroll ── */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  /* ── Focus input when chat opens ── */
  useEffect(() => {
    if (chatOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [chatOpen]);

  /* ── Cleanup all timers on unmount ── */
  useEffect(() => {
    return () => {
      if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
      if (poseResetTimerRef.current) clearTimeout(poseResetTimerRef.current);
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
      if (headTiltTimerRef.current) clearTimeout(headTiltTimerRef.current);
      if (inactivityIntervalRef.current)
        clearInterval(inactivityIntervalRef.current);
      observerRef.current?.disconnect();
    };
  }, []);

  /* ── Event handlers ── */

  const toggleChat = useCallback(() => {
    setChatOpen((prev) => {
      if (!prev) {
        triggerPose("wave", "Hi! How can I help?", true, POSE_RESET_MS);
      }
      return !prev;
    });
  }, [triggerPose]);

  const handleMouseEnter = useCallback(() => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    if (pose === "idle" || pose === "sleep") {
      const greetings = POSE_SPEECH.wave ?? [];
      const greeting =
        greetings[Math.floor(Math.random() * greetings.length)] ??
        "Hi! I'm The Curator.";
      triggerPose("wave", greeting, false);
    }
  }, [pose, triggerPose]);

  const handleMouseLeave = useCallback(() => {
    hoverTimerRef.current = setTimeout(() => {
      if (!chatOpen) {
        setPose("idle");
        setIsSleeping(false);
        setSpeech(null);
      }
    }, HOVER_RESET_MS);
  }, [chatOpen]);

  const handleSend = useCallback(
    async (e?: FormEvent) => {
      e?.preventDefault();
      const trimmed = input.trim();
      if (!trimmed || isTyping) return;

      const userMsg: ChatMessage = { role: "user", text: trimmed };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsTyping(true);
      triggerPose("thinking", "Thinking...", false);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: trimmed }),
        });

        if (!res.ok) throw new Error("Chat request failed");

        const data = await res.json();
        const curatorMsg: ChatMessage = {
          role: "curator",
          text: data.reply ?? "I'm not sure about that. Try asking differently!",
        };
        setMessages((prev) => [...prev, curatorMsg]);
        setIsTyping(false);

        const suggestedPose = (data.suggestedState as CuratorPose) || "happy";
        triggerPose(suggestedPose, undefined, true, POSE_RESET_MS);
      } catch {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            role: "curator",
            text: "Sorry, something went wrong. Please try again!",
          },
        ]);
        triggerPose("sad", "Oops... let's try again.", true, POSE_RESET_MS);
      }
    },
    [input, isTyping, triggerPose]
  );

  /* ── Derived values ── */

  const floatingStyle = useMemo(
    () =>
      reducedMotion
        ? {}
        : isSleeping
          ? {
              animation:
                "curator-float 7s ease-in-out infinite, curator-breathe 6s ease-in-out infinite",
            }
          : {
              animation:
                "curator-float 5s ease-in-out infinite, curator-breathe 4s ease-in-out infinite",
            },
    [reducedMotion, isSleeping]
  );

  const jumpAnimation =
    (pose === "jump" || pose === "celebrate") && !reducedMotion
      ? { y: [0, -20, 0] }
      : {};

  const jumpTransition =
    pose === "jump" || pose === "celebrate"
      ? { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] as const }
      : undefined;

  /* ── SSR guard return ── */
  if (!mounted) return null;

  return (
    <>
      {/* ── Keyframes ── */}
      <style>{`
        @keyframes curator-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes curator-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.015); }
        }
        @keyframes curator-glow-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
        @keyframes curator-sleep-pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 0.5; }
        }
      `}</style>

      {/* ── Mascot Container (Draggable) ── */}
      <motion.div
        drag
        dragConstraints={dragConstraints}
        dragMomentum={false}
        dragElastic={0.05}
        whileDrag={{ scale: 1.03 }}
        className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 md:bottom-6 md:right-6 z-50 flex flex-col items-center select-none touch-none cursor-grab active:cursor-grabbing"
        role="complementary"
        aria-label="The Curator AI mascot"
      >
        {/* Chat Panel (inside draggable container so it stays positioned relative to mascot) */}
        <AnimatePresence>
          {chatOpen && (
            <motion.div
              key="chat-panel"
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute z-50 flex flex-col cursor-auto"
              style={{
                bottom: "calc(100% + 12px)",
                right: 0,
                width: "min(350px, calc(100vw - 32px))",
                height: "min(460px, 55vh)",
                borderRadius: 16,
                background:
                  "linear-gradient(180deg, rgba(28, 28, 28, 0.95) 0%, rgba(13, 13, 13, 0.98) 100%)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(43, 36, 26, 0.5)",
                boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5)",
              }}
              onPointerDown={(e) => e.stopPropagation()} // Prevents dragging mascot when interacting with chat elements
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-4 shrink-0"
                style={{
                  height: 52,
                  borderBottom: "1px solid rgba(43, 36, 26, 0.35)",
                }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: "#D4AF37" }}
                  />
                  <span className="font-display text-sm text-white/90 tracking-wide">
                    The Curator
                  </span>
                </div>
                <button
                  onClick={() => setChatOpen(false)}
                  className="p-1 rounded-md text-white/50 hover:text-white/90 hover:bg-white/5 transition-colors cursor-pointer"
                  aria-label="Close chat"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-xl px-3 py-2 text-[13px] leading-relaxed ${
                        msg.role === "user"
                          ? "text-white/90"
                          : "text-white/80"
                      }`}
                      style={
                        msg.role === "user"
                          ? { background: "rgba(212, 175, 55, 0.15)" }
                          : {
                              background:
                                "linear-gradient(180deg, #1C1C1C 0%, #171717 100%)",
                              border: "1px solid rgba(43, 36, 26, 0.45)",
                            }
                      }
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div
                      className="flex items-center gap-1 rounded-xl px-3 py-2.5"
                      style={{
                        background:
                          "linear-gradient(180deg, #1C1C1C 0%, #171717 100%)",
                        border: "1px solid rgba(43, 36, 26, 0.45)",
                      }}
                    >
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/60"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{
                            duration: 1,
                            delay: i * 0.2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Input area */}
              <form
                onSubmit={handleSend}
                className="flex items-center gap-2 px-3 py-3 shrink-0"
                style={{ borderTop: "1px solid rgba(43, 36, 26, 0.35)" }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask The Curator..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[13px] text-white/90 placeholder:text-white/30 outline-none focus:border-[#D4AF37]/40 transition-colors font-sans"
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="p-2 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  style={{
                    background: input.trim()
                      ? "rgba(212, 175, 55, 0.2)"
                      : "rgba(255, 255, 255, 0.05)",
                    color: input.trim()
                      ? "#D4AF37"
                      : "rgba(255, 255, 255, 0.3)",
                  }}
                  aria-label="Send message"
                >
                  <Send size={16} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Speech Bubble */}
        <div className="relative w-[110px] sm:w-[138px] md:w-[162px]">
          <AnimatePresence mode="wait">
            {speech && !chatOpen && <SpeechBubble text={speech} />}
          </AnimatePresence>
        </div>

        {/* Particles & Mascot */}
        <div className="relative w-[110px] h-[110px] sm:w-[138px] sm:h-[138px] md:w-[162px] md:h-[162px]">
          <Particles pose={pose} reducedMotion={reducedMotion} />

          {/* Clickable mascot button */}
          <button
            onClick={toggleChat}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative w-full h-full cursor-pointer group outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]/50 rounded-full"
            aria-label={chatOpen ? "Close chat with The Curator" : "Open chat with The Curator"}
          >
            {/* Floating + breathing wrapper */}
            <div ref={mascotRef} style={floatingStyle} className="relative w-full h-full">
              <AnimatePresence>
                <motion.img
                  key={pose}
                  src={POSE_IMAGES[pose]}
                  alt={`The Curator - ${pose}`}
                  draggable={false}
                  className="absolute inset-0 w-full h-full object-contain select-none pointer-events-none"
                  initial={{ opacity: 0, scale: 0.97, y: 4 }}
                  animate={{
                    opacity: isSleeping && !reducedMotion ? [0.7, 0.5, 0.7] : 1,
                    scale: 1,
                    y: 0,
                    ...jumpAnimation,
                  }}
                  exit={{ opacity: 0, scale: 0.97, y: -4, transition: { duration: 0.08 } }}
                  transition={{
                    opacity: isSleeping
                      ? { duration: 3, repeat: Infinity, ease: "easeInOut" }
                      : { duration: 0.1 },
                    scale: { duration: 0.1 },
                    y: { duration: 0.1 },
                    ...(jumpTransition ? { y: jumpTransition } : {}),
                  }}
                />
              </AnimatePresence>
            </div>

            {/* Gold glow beneath mascot */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
              style={{
                width: "80%",
                height: 20,
                background:
                  "radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, transparent 70%)",
                filter: "blur(8px)",
                animation: reducedMotion
                  ? "none"
                  : "curator-glow-pulse 3s ease-in-out infinite",
              }}
            />

            {/* Subtle hover ring */}
            <div className="absolute inset-0 rounded-full border border-[#D4AF37]/0 group-hover:border-[#D4AF37]/20 transition-colors duration-300 pointer-events-none" />
          </button>
        </div>

        {/* Persistent "Need help?" label when idle (no speech, chat closed) */}
        {!chatOpen && !speech && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="text-center pointer-events-none select-none mt-1"
          >
            <span
              className="font-sans text-[10px] sm:text-[11px] tracking-wide text-white/50"
              style={{ textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}
            >
              Need help?{" "}
              <span className="text-[#D4AF37]/70 font-medium">Ask Curator</span>
            </span>
          </motion.div>
        )}

        {/* Chat indicator dot when closed */}
        {!chatOpen && (
          <motion.div
            className="absolute -top-1 -right-1 md:top-0 md:right-0"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <span className="relative flex h-3 w-3 font-sans">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37]/40" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#D4AF37]" />
            </span>
          </motion.div>
        )}
      </motion.div>
    </>
  );
}
