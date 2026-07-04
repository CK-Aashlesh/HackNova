"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

type Item = {
  time: string;
  title: string;
  desc: string;
  day: 1 | 2;
};

const schedule: Item[] = [
  { time: "09:00 AM", title: "Opening Ceremony", desc: "Welcome address and rules briefing.", day: 1 },
  { time: "10:00 AM", title: "Hacking Begins", desc: "Teams assemble and start building.", day: 1 },
  { time: "02:00 PM", title: "Mentor Sessions", desc: "1-on-1 guidance from industry experts.", day: 1 },
  { time: "08:00 PM", title: "Checkpoint 1", desc: "Progress review and midnight snacks.", day: 1 },
  { time: "08:00 AM", title: "Hacking Ends", desc: "Final code submission.", day: 2 },
  { time: "10:00 AM", title: "Judging & Awards", desc: "Presentations and closing ceremony.", day: 2 },
];

export default function Timeline() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const spineRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      // 1. Heading text slide-in
      gsap.from(".timeline-header span, .timeline-header h2", {
        opacity: 0,
        y: 20,
        duration: 1.0,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: ".timeline-header",
          start: "top 85%",
        },
      });

      // 2. Scroll-linked Spine draw-in
      gsap.fromTo(
        ".timeline-spine-glow",
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: "top center",
          ease: "none",
          scrollTrigger: {
            trigger: spineRef.current,
            start: "top 65%",
            end: "bottom 65%",
            scrub: true,
          },
        }
      );

      // 3. Staggered card reveals with side-based entrance (3D rotate & slide)
      const cards = gsap.utils.toArray<HTMLElement>(".timeline-card-wrapper");
      
      cards.forEach((card, idx) => {
        const isEven = idx % 2 === 0;
        
        // Staggered card entrance
        gsap.from(card, {
          opacity: 0,
          x: isEven ? 60 : -60,
          rotationY: isEven ? -15 : 15,
          duration: 1.1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
          },
        });

        // Interactive highlight as node crosses active scroll horizon
        const node = card.querySelector(".timeline-node");
        const cardInner = card.querySelector(".timeline-card-inner");

        if (node && cardInner) {
          gsap.timeline({
            scrollTrigger: {
              trigger: card,
              start: "top 65%",
              end: "bottom 55%",
              toggleActions: "play reverse play reverse",
            },
          })
            .to(node, {
              scale: 1.25,
              borderColor: "#D4AF37",
              backgroundColor: "#D4AF37",
              boxShadow: "0 0 16px rgba(212,175,55,0.8)",
              duration: 0.3,
            })
            .to(
              cardInner,
              {
                borderColor: "#D4AF37",
                boxShadow: "0 0 25px rgba(212,175,55,0.12)",
                duration: 0.3,
              },
              0
            );
        }
      });
    },
    { scope: containerRef }
  );

  // Find first index of day 2 to mark a divider
  const firstDay2 = schedule.findIndex((s) => s.day === 2);

  return (
    <section ref={containerRef} id="schedule" className="py-28 md:py-32 relative overflow-hidden bg-[#0d0d0d]">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-[40%] right-[-10%] w-[450px] h-[300px] blur-[100px] opacity-50"
          style={{
            background:
              "radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 60%)",
          }}
        />
      </div>

      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        {/* Heading */}
        <div className="timeline-header text-center mb-20">
          <span className="eyebrow mb-5 mx-auto">
            The Schedule
          </span>
          <h2 className="font-display text-[44px] sm:text-[60px] md:text-[80px] font-black leading-[0.92] uppercase tracking-[-0.03em]">
            <span className="text-white">EVENT </span>
            <span className="text-gradient-purple">TIMELINE</span>
          </h2>
        </div>

        <div ref={spineRef} className="relative">
          {/* Spine: faint base + scroll-driven gradient overlay */}
          <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-px bg-white/10" />
          <div className="timeline-spine-glow absolute left-[28px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-space-purple via-[#F1D08A] to-cyan-glow shadow-[0_0_12px_rgba(212,175,55,0.7)]" />

          <div className="space-y-12">
            {schedule.map((item, index) => {
              const showDay = index === 0 || index === firstDay2;
              return (
                <div key={index}>
                  {showDay && (
                    <div className="relative mb-8 select-none">
                      <div className="ml-16 md:ml-0 md:flex md:justify-center">
                        <span className="inline-flex items-center gap-2 chip">
                          <span className="chip-dot" />
                          {item.day === 1 ? "DAY 01 · AUGUST 22" : "DAY 02 · AUGUST 23"}
                        </span>
                      </div>
                    </div>
                  )}

                  <div
                    className={`timeline-card-wrapper relative flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-0 ${
                      index % 2 === 0 ? "md:justify-end" : "md:justify-start"
                    }`}
                    style={{ perspective: 1000 }}
                  >
                    {/* Node */}
                    <div className="timeline-node absolute left-[16px] md:left-1/2 md:ml-[-12px] mt-1.5 md:mt-0 w-6 h-6 flex items-center justify-center z-10 rounded-full border border-space-purple bg-space-black transition-all duration-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-space-purple" />
                    </div>

                    {/* Card container */}
                    <div
                      className={`w-full md:w-1/2 pl-16 md:pl-0 ${
                        index % 2 === 0 ? "md:pl-12" : "md:pr-12 text-left md:text-right"
                      }`}
                    >
                      <div className="timeline-card-inner group glass-card glass-card-hover border border-space-violet/25 hover:border-space-purple/30 rounded-2xl p-6 transition-all duration-300 relative overflow-hidden">
                        <div className="relative z-10">
                          <div className="text-space-purple-glow font-mono text-[10px] uppercase font-bold tracking-[0.2em] mb-2">
                            {item.time}
                          </div>
                          <h3 className="text-lg font-display font-black text-white mb-2 tracking-wide group-hover:text-space-purple-glow transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-[12px] text-ink-dim leading-[1.65] font-light">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
