"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const steps = [
  {
    n: "01",
    title: "Analyze embeddings",
    desc: "Explore the dataset for patterns, anomalies, and edge cases.",
  },
  {
    n: "02",
    title: "Identify samples",
    desc: "Select the most impactful data points the model struggles with.",
  },
  {
    n: "03",
    title: "Label strategically",
    desc: "Provide high-quality annotations for the chosen samples.",
  },
  {
    n: "04",
    title: "Retrain & improve",
    desc: "Feed the improved data back into the model and measure the lift.",
  },
];

export default function Challenge() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollingRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      // 1. Meta rule reveal
      gsap.from(".challenge-meta", {
        opacity: 0,
        y: 15,
        duration: 1.0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
        },
      });

      // 2. Headline reveals
      gsap.from(".challenge-title-line", {
        y: "105%",
        duration: 1.3,
        ease: "power4.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: ".challenge-headline",
          start: "top 85%",
        },
      });

      // 3. Comparison brief and stats table reveal
      gsap.from(".challenge-brief", {
        opacity: 0,
        y: 20,
        duration: 1.0,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".challenge-brief-container",
          start: "top 80%",
        },
      });

      gsap.from(".challenge-table-row", {
        opacity: 0,
        x: 30,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: ".challenge-brief-container",
          start: "top 80%",
        },
      });

      // 4. Desktop Horizontal Step Carousel Pinning
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        if (!scrollingRef.current) return;
        
        const scrollWidth = scrollingRef.current.scrollWidth;
        const widthToScroll = scrollWidth - window.innerWidth + 200;

        const scrollTween = gsap.to(scrollingRef.current, {
          x: -widthToScroll,
          ease: "none",
          scrollTrigger: {
            trigger: ".challenge-horizontal-wrapper",
            pin: true,
            scrub: 1.2,
            start: "top 15%",
            end: () => `+=${widthToScroll}`,
            invalidateOnRefresh: true,
          },
        });

        // Staggered reveal of step card elements during horizontal scrub
        steps.forEach((s, idx) => {
          gsap.from(`.step-card-${idx}`, {
            opacity: 0.4,
            scale: 0.92,
            y: 20,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              containerAnimation: scrollTween,
              trigger: `.step-card-${idx}`,
              start: "left 85%",
              end: "left 45%",
              scrub: true,
            },
          });
        });
      });

      // Mobile steps vertical staggered entry
      mm.add("(max-width: 1023px)", () => {
        gsap.from(".challenge-step-mobile", {
          opacity: 0,
          y: 35,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: ".challenge-steps-mobile-container",
            start: "top 80%",
          },
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} id="challenge" className="py-28 md:py-36 relative overflow-hidden bg-[#0a0a0a]">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Meta rule */}
        <div className="challenge-meta flex items-baseline justify-between border-t border-space-violet/40 pt-5 mb-14 md:mb-20 font-mono text-[10px] tracking-[0.3em] uppercase text-white/45">
          <span>Challenge - 02</span>
          <span>Powered by 3LC.ai</span>
        </div>

        {/* Headline - Split Line Mask Reveal */}
        <div className="challenge-headline mb-12 md:mb-16">
          <div className="overflow-hidden">
            <h2 className="challenge-title-line font-display font-black text-white tracking-[-0.035em] leading-[0.92] uppercase text-[40px] sm:text-[64px] md:text-[88px] lg:text-[104px]">
              Improve the data,
            </h2>
          </div>
          <div className="overflow-hidden mt-1 sm:mt-2">
            <h2 className="challenge-title-line font-display font-black tracking-[-0.035em] leading-[0.92] uppercase text-[40px] sm:text-[64px] md:text-[88px] lg:text-[104px] text-gradient-purple">
              not the model.
            </h2>
          </div>
        </div>

        {/* Brief */}
        <div className="challenge-brief-container grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 mb-20">
          <div className="challenge-brief lg:col-span-7">
            <p className="text-[17px] md:text-lg text-white/85 leading-[1.65] mb-5 max-w-2xl font-light">
              Build an image classification model using data-centric AI with
              3LC. Train on a small labeled set, then improve performance by
              strategically labeling additional data using embeddings and model
              feedback.
            </p>
            <p className="text-[15px] md:text-base text-white/55 leading-[1.7] max-w-2xl font-light">
              Instead of changing model architectures, competitors must improve
              accuracy by improving the dataset itself.
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="border-t border-space-violet/40">
              <div className="challenge-table-row border-b border-space-violet/40 py-4 grid grid-cols-12 gap-4 items-baseline">
                <dt className="col-span-5 font-mono text-[10px] tracking-[0.3em] uppercase text-white/45">
                  Traditional AI
                </dt>
                <dd className="col-span-7 text-[14px] text-white/55 font-light leading-relaxed">
                  Improve the model and the algorithm.
                </dd>
              </div>
              <div className="challenge-table-row border-b border-space-violet/40 py-4 grid grid-cols-12 gap-4 items-baseline">
                <dt className="col-span-5 font-mono text-[10px] tracking-[0.3em] uppercase text-white">
                  Data-Centric AI
                </dt>
                <dd className="col-span-7 text-[14px] text-white/85 font-light leading-relaxed">
                  Improve the data the model learns from.
                </dd>
              </div>
            </div>
          </div>
        </div>

        {/* Horizontal Pin Wrapper for desktop */}
        <div className="challenge-horizontal-wrapper hidden lg:block border-t border-space-violet/40 pt-10">
          <div className="flex items-baseline justify-between mb-8 font-mono text-[10px] tracking-[0.3em] uppercase text-white/45">
            <span>Methodology</span>
            <span>04 Steps (Scroll to slide)</span>
          </div>

          <div className="overflow-hidden -mx-6 px-6">
            <div
              ref={scrollingRef}
              className="flex gap-8 py-5 w-max select-none"
            >
              {steps.map((s, i) => (
                <div
                  key={s.n}
                  className={`step-card-${i} w-[360px] glass-card border border-space-violet/20 hover:border-space-purple/40 rounded-2xl p-8 transition-colors duration-300 relative overflow-hidden`}
                >
                  <div className="font-mono text-[11px] tracking-[0.3em] text-[#D4AF37] mb-6">
                    / {s.n}
                  </div>
                  <div className="font-display text-xl font-black text-white tracking-[-0.01em] uppercase mb-3">
                    {s.title}
                  </div>
                  <p className="text-[13px] text-white/60 leading-relaxed font-light">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile steps vertical list */}
        <div className="challenge-steps-mobile-container lg:hidden border-t border-space-violet/40">
          <div className="flex items-baseline justify-between py-5 font-mono text-[10px] tracking-[0.3em] uppercase text-white/45">
            <span>Method</span>
            <span>04 Steps</span>
          </div>

          <ol className="grid grid-cols-1 md:grid-cols-2 border-t border-space-violet/40">
            {steps.map((s, i) => (
              <li
                key={s.n}
                className={`challenge-step-mobile group p-7 sm:p-8 border-b border-space-violet/40 ${
                  i % 2 === 0 ? "md:border-r" : ""
                }`}
              >
                <div className="font-mono text-[10px] tracking-[0.3em] text-[#D4AF37] mb-6">
                  / {s.n}
                </div>
                <div className="font-display text-lg font-black text-white tracking-[-0.01em] uppercase mb-2">
                  {s.title}
                </div>
                <p className="text-[13px] text-white/55 leading-relaxed font-light">
                  {s.desc}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
