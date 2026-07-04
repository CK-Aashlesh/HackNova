"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

type EventItem = {
  name: string;
  kind: string;
  date: string;
  blurb: string;
};

const events: EventItem[] = [
  {
    name: "HACKWISE 1.0",
    kind: "National Hackathon",
    date: "Apr 2025",
    blurb:
      "Our first flagship - students from across India came to compete and build.",
  },
  {
    name: "HACKWISE X",
    kind: "Internal Hackathon",
    date: "Mar 2026",
    blurb:
      "An internal edition, exclusively for KVGCE students to build, compete, and grow.",
  },
  {
    name: "HACKWISE 2.0",
    kind: "National Hackathon",
    date: "Apr 2026",
    blurb:
      "The second edition of our flagship - bigger in scale, reach, and participation.",
  },
  {
    name: "HACK[AI]THON 2026",
    kind: "AI Hackathon",
    date: "May 2026",
    blurb: "A national AI hackathon - the event where we met.",
  },
];

export default function SphereHive() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      // 1. Meta rule reveal
      gsap.from(".team-meta", {
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
      gsap.from(".team-title-line", {
        y: "105%",
        duration: 1.3,
        ease: "power4.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: ".team-headline",
          start: "top 85%",
        },
      });

      // 3. Image parallax zoom out
      gsap.fromTo(
        ".team-photo-img",
        { scale: 1.15 },
        {
          scale: 1.0,
          ease: "none",
          scrollTrigger: {
            trigger: ".team-photo-container",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      // Image container fade reveal
      gsap.from(".team-photo-container", {
        opacity: 0,
        y: 30,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".team-photo-container",
          start: "top 80%",
        },
      });

      // 4. Story paragraph details reveal
      gsap.from(".team-story-text", {
        opacity: 0,
        y: 20,
        duration: 1.0,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: ".team-story-row",
          start: "top 80%",
        },
      });

      // 5. Events list stagger entrance
      gsap.from(".team-event-row", {
        opacity: 0,
        y: 25,
        duration: 1.0,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: ".team-events-list",
          start: "top 80%",
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} id="sphere-hive" className="py-28 md:py-36 relative bg-transparent">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Top meta rule */}
        <div className="team-meta flex items-baseline justify-between border-t border-space-violet/40 pt-5 mb-14 md:mb-20 font-mono text-[10px] tracking-[0.3em] uppercase text-white/45">
          <span>Sphere Hive - 06</span>
          <span className="hidden sm:block">KVGCE · Sullia</span>
        </div>

        {/* Headline */}
        <div className="team-headline mb-16 md:mb-20">
          <div className="overflow-hidden">
            <h2 className="team-title-line font-display font-black text-white tracking-[-0.035em] leading-[0.92] uppercase text-[44px] sm:text-[68px] md:text-[92px] lg:text-[108px]">
              Built by
            </h2>
          </div>
          <div className="overflow-hidden mt-1">
            <h2 className="team-title-line font-display font-black tracking-[-0.035em] leading-[0.92] uppercase text-[44px] sm:text-[68px] md:text-[92px] lg:text-[108px] text-gradient-purple">
              Sphere Hive.
            </h2>
          </div>
        </div>

        {/* Photo */}
        <figure className="mb-5">
          <div className="team-photo-container relative aspect-[16/9] w-full overflow-hidden rounded-sm bg-[#0a0712]">
            <img
              src="/team-group.jpeg"
              alt="The Sphere Hive team"
              className="team-photo-img absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
          <figcaption className="mt-4 flex items-center gap-3 font-mono text-[11px] tracking-[0.22em] uppercase text-white/40">
            <span className="w-8 h-px bg-white/25" />
            The team - KVG College of Engineering, Sullia
          </figcaption>
        </figure>

        {/* Story + events */}
        <div className="team-story-row grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mt-20 md:mt-28">
          {/* Copy */}
          <div className="lg:col-span-5">
            <p className="team-story-text text-[17px] md:text-lg text-white/85 leading-[1.65] mb-6 font-light">
              Sphere Hive is the technology and innovation club of KVG College
              of Engineering, Sullia. We started it from the ground up in
              November 2024.
            </p>
            <p className="team-story-text text-[15px] md:text-base text-white/55 leading-[1.7] font-light">
              In under two years we&apos;ve run national hackathons, competed at
              IIT-level events, partnered with industry, and built an active
              student community across India.
            </p>

            <div className="team-story-text">
              <a
                href="https://www.instagram.com/spherehive"
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-10 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.25em] uppercase text-white/55 hover:text-white transition-colors"
              >
                <span className="border-b border-white/20 group-hover:border-white pb-0.5">
                  @spherehive
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>

          {/* Events list */}
          <div className="lg:col-span-7">
            <div className="flex items-baseline justify-between mb-5 font-mono text-[10px] tracking-[0.3em] uppercase text-white/45">
              <span>Selected Events</span>
              <span>2025 - 2026</span>
            </div>

            <ul className="team-events-list border-t border-space-violet/40">
              {events.map((ev, i) => (
                <li
                  key={ev.name}
                  className="team-event-row group border-b border-space-violet/40 py-6 grid grid-cols-12 gap-3 sm:gap-6 items-baseline transition-colors hover:bg-white/[0.015]"
                >
                  <div className="col-span-12 sm:col-span-9">
                    <div className="font-display text-lg sm:text-xl font-black tracking-[-0.01em] text-white uppercase">
                      {ev.name}
                    </div>
                    <p className="mt-1.5 text-[13px] sm:text-sm text-white/55 leading-relaxed font-light">
                      <span className="text-white/75">{ev.kind}</span>
                      <span className="mx-2 text-white/25">·</span>
                      {ev.blurb}
                    </p>
                  </div>
                  <div className="col-span-12 sm:col-span-3 sm:text-right font-mono text-[11px] tracking-[0.22em] uppercase text-white/55">
                    {ev.date}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
