"use client";

import { useRef, useEffect } from "react";
import { ArrowUpRight, Clock, Calendar, MapPin } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const taglineRef = useRef<HTMLParagraphElement | null>(null);
  const infoRef = useRef<HTMLDivElement | null>(null);

  // 1. GSAP Scroll-Driven, Entrance, and Ambient Particle Animations
  useGSAP(
    () => {
      // Entrance Timeline
      const tl = gsap.timeline();
      
      tl.from(
        ".hero-subtitle-line",
        {
          y: "105%",
          duration: 1.2,
          ease: "power4.out",
        }
      )
        .from(
          ".hero-title-line",
          {
            y: "105%",
            duration: 1.4,
            ease: "power4.out",
            stagger: 0.15,
          },
          "-=0.9"
        )
        .from(
          taglineRef.current,
          {
            opacity: 0,
            y: 15,
            duration: 1.2,
            ease: "power3.out",
          },
          "-=1.0"
        )
        .from(
          infoRef.current,
          {
            opacity: 0,
            y: 10,
            duration: 1.0,
            ease: "power2.out",
          },
          "-=0.9"
        )
        .from(
          ".hero-cta-btn",
          {
            opacity: 0,
            y: 15,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.1,
          },
          "-=0.9"
        )
        .from(
          ".scroll-cue-el",
          {
            opacity: 0,
            y: 10,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.5"
        );

      // Scroll-Driven Parallax on Background Video/Image Container
      gsap.to(".hero-bg-scroll", {
        y: 120,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Scroll-Driven Fade-out on Text Content
      gsap.to(contentRef.current, {
        opacity: 0,
        y: -100,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom 30%",
          scrub: true,
        },
      });

      // Slow, subtle ambient background floating animation (idle floating)
      gsap.to(".bg-float-wrapper", {
        x: -15,
        y: 10,
        scale: 1.04,
        duration: 18,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Ambient Floating Particles Setup (Set random coordinates & animate client-side only)
      gsap.set(".cosmic-dust-particle", {
        x: () => gsap.utils.random(-80, 80),
        y: () => gsap.utils.random(-80, 80),
        scale: () => gsap.utils.random(0.6, 2.0),
        opacity: () => gsap.utils.random(0.1, 0.5),
      });

      gsap.to(".cosmic-dust-particle", {
        x: "+=random(-60, 60)",
        y: "+=random(-90, 90)",
        opacity: "random(0.15, 0.75)",
        duration: "random(8, 15)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: {
          amount: 2.5,
          from: "random",
        },
      });
    },
    { scope: containerRef }
  );

  // 2. Interactive Mouse Parallax (Dynamic Depth Shift)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const xVal = (e.clientX - width / 2) / (width / 2); // -1 to 1
      const yVal = (e.clientY - height / 2) / (height / 2); // -1 to 1

      // Move the video backdrop and particles slightly in opposite directions for dynamic depth
      gsap.to(".hero-bg-media", {
        x: xVal * -30,
        y: yVal * -30,
        duration: 1.5,
        ease: "power2.out",
        overwrite: "auto",
      });

      gsap.to(".cosmic-dust-particle", {
        x: (i) => (i % 2 === 0 ? xVal * 25 : xVal * -25),
        y: (i) => (i % 2 === 0 ? yVal * 25 : yVal * -25),
        duration: 1.8,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative min-h-dvh w-full overflow-hidden bg-black"
    >
      {/* ===== BACKGROUND VIDEO & IMAGE FIT ON THE RIGHT SIDE ===== */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        <div className="hero-bg-scroll absolute right-0 top-0 h-[115%] w-full md:w-[70%] lg:w-[58%] pointer-events-none">
          {/* Subtle Float Wrapper */}
          <div className="bg-float-wrapper w-full h-full">
            {/* Using hero-bg.png as main cosmic backdrop */}
            <img
              src="/hero-bg.png"
              alt="HackNova cosmic background"
              className="hero-bg-media h-full w-full object-cover object-[70%_center] md:object-right scale-100 md:scale-110"
              draggable={false}
            />
          </div>
        </div>
        
        {/* Ambient Cosmic Shade layers to protect text readability and blend image edges */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 md:via-black/90 lg:via-black/95 to-transparent w-full lg:w-[75%] pointer-events-none z-10" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-space-black via-space-black/85 to-transparent h-[60%] lg:h-[45%] pointer-events-none z-10" />
      </div>

      {/* ===== AMBIENT FLOATING SPACE PARTICLES OVERLAY ===== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            className="cosmic-dust-particle absolute rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F1D08A]/40"
            style={{
              width: `${(i % 3) * 1.5 + 2}px`,
              height: `${(i % 3) * 1.5 + 2}px`,
              // Spread initially on the right side over the cosmic background
              top: `${(i * 5.5) + 10}%`,
              left: `${(i % 4) * 12 + 40}%`,
              filter: "blur(0.5px)",
            }}
          />
        ))}
      </div>

      {/* ===== CONTENT ===== */}
      <div
        ref={contentRef}
        className="relative z-10 min-h-dvh flex flex-col justify-end pt-32"
      >
        <div className="px-6 sm:px-12 lg:px-20 pb-20 xs:pb-24 sm:pb-24 md:pb-28 max-w-3xl">
          {/* Accessible heading */}
          <h1 className="sr-only">
            HackNova 2026 - AI Hackathon at IIT Tirupati · 24 hours · August 22 - 23, 2026
          </h1>

          {/* Small subtitle above title */}
          <div className="overflow-hidden mb-3.5 max-w-[240px] xs:max-w-none">
            <span className="hero-subtitle-line block font-mono text-[9px] xs:text-[10px] sm:text-[9px] md:text-[10px] tracking-[0.16em] sm:tracking-[0.22em] md:tracking-[0.25em] uppercase text-[#D4AF37]/80 whitespace-normal leading-[1.6] xs:leading-normal">
              KVGCE SPHERE HIVE X <br className="xs:hidden" /> DGITALWIZARDS IIT TIRUPATI
            </span>
          </div>

          {/* Title */}
          <div
            aria-hidden="true"
            className="font-display font-black tracking-[-0.03em] leading-[0.92] uppercase mb-5 text-[48px] xs:text-[56px] sm:text-[48px] md:text-[64px] lg:text-[76px]"
          >
            <div className="overflow-hidden">
              <span className="hero-title-line block text-white">
                HACK <br className="md:hidden" /> <span className="text-gradient-gold">Nova.</span>
              </span>
            </div>
          </div>

          {/* Tagline */}
          <p
            ref={taglineRef}
            className="text-[14px] sm:text-[15px] text-white/55 leading-[1.7] max-w-md mb-6 font-light"
          >
            An AI hackathon for IIT Tirupati, IISER Tirupati, and neighbouring institutes uniting innovators, creators, and problem solvers to build limitless solutions for tomorrow.
          </p>

          {/* Mobile Divider Line */}
          <div className="w-12 h-[1px] bg-[#D4AF37]/40 my-6 md:hidden" />

          {/* Info pills & lists */}
          <div
            ref={infoRef}
            className="mb-8"
          >
            {/* Desktop Info pills */}
            <div className="hidden md:flex flex-wrap items-center gap-y-2 gap-x-2 sm:gap-3 font-mono text-[9px] sm:text-[10px] tracking-[0.15em] sm:tracking-[0.25em] uppercase text-white/40">
              <span>24 Hours</span>
              <span className="hidden sm:inline w-[3px] h-[3px] rounded-full bg-[#D4AF37]/40" />
              <span>Aug 22–23 · 2026</span>
              <span className="hidden sm:inline w-[3px] h-[3px] rounded-full bg-[#D4AF37]/40" />
              <span>IIT Tirupati</span>
            </div>

            {/* Mobile Info List with Icons */}
            <div className="flex md:hidden flex-col gap-4 font-mono text-[10px] tracking-[0.2em] uppercase text-white/60">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#D4AF37]/80" />
                <span>24 Hours</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-[#D4AF37]/80" />
                <span>Aug 22-23 · 2026</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[#D4AF37]/80" />
                <span>IIT Tirupati</span>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="hidden md:flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <a
              href="https://unstop.com/p/hacknova-sphere-hive-kvg-college-of-engineering-sullia-1693176"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-cta-btn btn-primary group h-11 px-6 text-[11px] font-bold uppercase tracking-[0.15em] w-full sm:w-auto justify-center"
            >
              Register Now
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>

            <button
              onClick={() =>
                document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
              }
              className="hero-cta-btn btn-secondary h-11 px-6 text-[11px] font-bold uppercase tracking-[0.15em] w-full sm:w-auto justify-center"
            >
              Explore Tracks
            </button>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="scroll-cue-el absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 text-white/25">
        <span className="font-mono text-[9px] tracking-[0.4em] uppercase">Scroll</span>
        <span className="relative w-px h-8 overflow-hidden bg-white/10">
          <span className="absolute inset-x-0 top-0 h-2.5 bg-[#D4AF37]/60 animate-scroll-dot" />
        </span>
      </div>
    </section>
  );
}
