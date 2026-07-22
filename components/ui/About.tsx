"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const facts: [string, string][] = [
  ["Date", "August 29 - 30, 2026"],
  ["Duration", "24 Hours, non-stop"],
  ["Venue", "IIT Tirupati, Andhra Pradesh"],
  ["Open To", "IIT Tirupati, IISER Tirupati & neighbouring institutes"],
];

export default function About() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const headlineRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      // 1. Meta rule fade-in
      gsap.from(".about-meta", {
        opacity: 0,
        y: 15,
        duration: 1.0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
        },
      });

      // 2. Heading text lines reveal
      gsap.from(".about-title-line", {
        y: "105%",
        duration: 1.3,
        ease: "power4.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: headlineRef.current,
          start: "top 85%",
        },
      });

      // 3. Story text block entrance
      gsap.from(".about-text", {
        opacity: 0,
        y: 20,
        duration: 1.0,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: ".about-story-container",
          start: "top 80%",
        },
      });

      // 4. Prize block pop & glow sweep
      gsap.from(".about-prize", {
        scale: 0.95,
        opacity: 0,
        duration: 1.2,
        ease: "elastic.out(1, 0.75)",
        scrollTrigger: {
          trigger: ".about-prize",
          start: "top 90%",
        },
      });

      // 5. Fact rows staggered reveal + scroll progress highlight
      const factRows = gsap.utils.toArray<HTMLElement>(".about-fact-row");

      gsap.from(factRows, {
        opacity: 0,
        x: 30,
        duration: 1.0,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: ".about-facts-container",
          start: "top 80%",
        },
      });

      // Interactive scrub highlight for facts
      factRows.forEach((row) => {
        gsap.to(row, {
          color: "#ffffff",
          borderColor: "#D4AF37",
          duration: 0.5,
          scrollTrigger: {
            trigger: row,
            start: "top 70%",
            end: "bottom 40%",
            toggleActions: "play reverse play reverse",
          },
        });
      });
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      id="about"
      className="py-28 md:py-36 relative overflow-hidden"
    >
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Top meta rule */}
        <div className="about-meta flex items-baseline justify-between border-t border-space-violet/40 pt-5 mb-14 md:mb-20 font-mono text-[10px] tracking-[0.3em] uppercase text-white/45">
          <span>Mission - 01</span>
          <span className="hidden sm:block">Aug 29 - 30 · 2026</span>
        </div>

        {/* Headline - Split Line Mask Reveal */}
        <div ref={headlineRef} className="mb-12 md:mb-16">
          <div className="overflow-hidden">
            <h2 className="about-title-line font-display font-black text-white tracking-[-0.035em] leading-[0.92] uppercase text-[40px] sm:text-[64px] md:text-[88px] lg:text-[104px]">
              Write your
            </h2>
          </div>
          <div className="overflow-hidden mt-1 sm:mt-2">
            <h2 className="about-title-line font-display font-black tracking-[-0.035em] leading-[0.92] uppercase text-[40px] sm:text-[64px] md:text-[88px] lg:text-[104px] text-gradient-purple">
              legacy in code.
            </h2>
          </div>
        </div>

        {/* Story + facts split */}
        <div className="about-story-container grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-7">
            <p className="about-text text-[17px] md:text-lg text-white/85 leading-[1.65] mb-5 max-w-2xl font-light">
              HackNova is not a competition. It&apos;s a 24-hour proving ground
              where the most curious builders from IIT Tirupati, IISER Tirupati,
              and neighbouring institutes gather to push the edges of artificial
              intelligence.
            </p>
            <p className="about-text text-[15px] md:text-base text-white/55 leading-[1.7] max-w-2xl font-light">
              No model architectures to brute-force. No leaderboard tricks.
              Teams compete on a single AI challenge - judged on how well they
              think about data, edge cases, and quality.
            </p>

            <div className="about-prize mt-10 inline-flex items-baseline gap-3 font-display font-black uppercase tracking-[-0.02em]">
              <span className="text-white text-4xl sm:text-5xl">₹50K</span>
              <span className="font-mono text-[11px] tracking-[0.25em] text-[#D4AF37] uppercase">
                Prize Pool · Sponsored Prizes · Goodies
              </span>
            </div>
          </div>

          <div className="about-facts-container lg:col-span-5 border-t border-space-violet/40">
            {facts.map(([k, v], idx) => (
              <div
                key={k}
                className="about-fact-row border-b border-space-violet/40 py-4 grid grid-cols-12 gap-4 items-baseline text-white/40 transition-colors duration-300"
              >
                <dt className="col-span-4 font-mono text-[10px] tracking-[0.3em] uppercase text-inherit">
                  {k}
                </dt>
                <dd className="col-span-8 text-[15px] font-light tracking-tight text-white/90">
                  {v}
                </dd>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
