"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ChevronRight, Rocket } from "lucide-react";
import MagneticButton from "./MagneticButton";
import Countdown from "./Countdown";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function CTA() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      // 1. Zoom-out and expand reveal card
      gsap.fromTo(
        ".cta-card",
        { scale: 0.9, borderRadius: "2.5rem" },
        {
          scale: 1,
          borderRadius: "1rem",
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 95%",
            end: "top 35%",
            scrub: true,
          },
        }
      );

      // 2. Headline split reveals
      gsap.from(".cta-title-line", {
        y: "105%",
        duration: 1.2,
        ease: "power4.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: ".cta-card",
          start: "top 75%",
        },
      });

      // 3. Countdown & button fade reveals
      gsap.from(".cta-fade-in", {
        opacity: 0,
        y: 25,
        duration: 1.0,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: ".cta-card",
          start: "top 70%",
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="cta-section-container py-20 sm:py-28 md:py-32 relative overflow-hidden border-t border-space-violet/40 bg-transparent">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(700px,90vw)] h-[min(700px,90vw)] bg-space-purple/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center">
        <div className="cta-card max-w-4xl mx-auto glass-card border border-space-violet/20 rounded-3xl p-6 sm:p-10 md:p-16 relative overflow-hidden">
          {/* Decorative inner columns */}
          <div className="hidden md:block absolute inset-0 opacity-30 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-[#2B241A] to-transparent" />
            <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-[#2B241A] to-transparent" />
          </div>

          {/* Top eyebrow */}
          <span className="cta-fade-in eyebrow mx-auto mb-5 sm:mb-6">
            <Rocket className="w-3 h-3" />
            Final Boarding Call
          </span>

          {/* Headline - Split Line Mask Reveal */}
          <div className="mb-6 flex flex-col items-center">
            <div className="overflow-hidden">
              <h2 className="cta-title-line font-display text-[30px] sm:text-[52px] md:text-[72px] font-black leading-[0.95] uppercase tracking-[-0.03em] text-white">
                Answer the
              </h2>
            </div>
            <div className="overflow-hidden mt-1 sm:mt-2">
              <h2 className="cta-title-line font-display text-[30px] sm:text-[52px] md:text-[72px] font-black leading-[0.95] uppercase tracking-[-0.03em] text-gradient-purple">
                call to build
              </h2>
            </div>
          </div>

          <p className="cta-fade-in text-[14px] sm:text-base leading-[1.65] text-ink-dim max-w-[520px] mx-auto mb-7 sm:mb-9 font-light">
            The challenge awaits. Gather your team, sharpen your skills, and
            prepare to build the future. Registration closes soon.
          </p>

          {/* Countdown */}
          <div className="cta-fade-in flex justify-center mb-7 sm:mb-9">
            <Countdown />
          </div>

          <div className="cta-fade-in">
            <MagneticButton
              href="https://unstop.com/p/hacknova-sphere-hive-kvg-college-of-engineering-sullia-1693176"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary group inline-flex w-full sm:w-auto text-center px-6 sm:px-10 h-12 sm:h-auto sm:py-4 text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.18em] sm:tracking-[0.2em] justify-center"
              strength={0.25}
            >
              Claim Your Spot
              <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </MagneticButton>
          </div>

          {/* Compact countdown */}
          <div className="cta-fade-in mt-6 hidden sm:block">
            <Countdown compact />
          </div>
        </div>
      </div>
    </section>
  );
}
