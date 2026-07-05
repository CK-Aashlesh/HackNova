"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

interface Particle {
  isDust: boolean;
  // Coordinates
  x: number;
  y: number;
  z: number;
  
  // Morph targets (only for morphing particles)
  s0x?: number;
  s0y?: number;
  s0z?: number;
  s1x?: number;
  s1y?: number;
  s1z?: number;
  s2x?: number;
  s2y?: number;
  s2z?: number;
  s3x?: number;
  s3y?: number;
  s3z?: number;
  
  size: number;
  color: string;
}

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const morphCount = 300;
      const dustCount = 350; // Increased dust count for denser space feeling
      const particles: Particle[] = [];
      
      let width = (canvas.width = window.innerWidth);
      let height = (canvas.height = window.innerHeight);
      let centerX = width / 2;
      let centerY = height / 2;
      const fov = 300; // Lower fov = wider perspective, more dramatic fly-by

      // Morph progress states driven by GSAP ScrollTrigger
      const morph = {
        state0to1: 0,      // Hero -> Stats
        state1to2: 0,      // Stats -> Challenge
        state2to3: 0,      // Challenge -> FAQ/CTA
        scrollOffset: 0,   // Pulls morphing particles forward on scroll
      };

      // 1. Initialize Morphing Particles (Indices 0 to 299)
      for (let i = 0; i < morphCount; i++) {
        // State 0: Chaotic Sphere (Hero)
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        const r0 = 130 + Math.random() * 70;
        const s0x = r0 * Math.sin(phi) * Math.cos(theta);
        const s0y = r0 * Math.sin(phi) * Math.sin(theta);
        const s0z = r0 * Math.cos(phi);

        // State 1: 4 columns matching Stats grid
        const colIdx = i % 4;
        const colX = (colIdx - 1.5) * (width * 0.22);
        const colY = (Math.random() - 0.5) * (height * 0.45);
        const colZ = (Math.random() - 0.5) * 120;

        // State 2: 4 Connected Nodes matching Challenge steps
        const nodeIdx = i % 4;
        const nodeX = (nodeIdx - 1.5) * (width * 0.20);
        const angle = Math.random() * Math.PI * 2;
        const rad = Math.random() * 40 + 5;
        const s2x = nodeX + rad * Math.cos(angle);
        const s2y = rad * Math.sin(angle) + (Math.random() - 0.5) * 10;
        const s2z = (Math.random() - 0.5) * 60;

        // State 3: Dispersed space dust (CTA/Footer)
        const s3x = (Math.random() - 0.5) * width * 2.0;
        const s3y = (Math.random() - 0.5) * height * 2.0;
        const s3z = (Math.random() - 0.5) * 500;

        const colorVal = Math.random();
        const color =
          colorVal < 0.45
            ? "rgba(212, 175, 55, "   // Gold
            : colorVal < 0.75
            ? "rgba(241, 208, 138, "  // Champagne
            : "rgba(255, 255, 255, "; // White

        particles.push({
          isDust: false,
          x: s0x,
          y: s0y,
          z: s0z,
          s0x,
          s0y,
          s0z,
          s1x: colX,
          s1y: colY,
          s1z: colZ,
          s2x,
          s2y,
          s2z,
          s3x,
          s3y,
          s3z,
          size: Math.random() * 2.0 + 1.5, // Increased size for visibility
          color,
        });
      }

      // 2. Initialize Endless Space Dust Particles (Indices 300 to 649)
      // These particles continuously fly past the camera to create the depth travel feel
      for (let i = 0; i < dustCount; i++) {
        const colorVal = Math.random();
        const color =
          colorVal < 0.35
            ? "rgba(212, 175, 55, "   // Gold dust
            : colorVal < 0.65
            ? "rgba(241, 208, 138, "  // Champagne dust
            : "rgba(255, 255, 255, "; // White dust

        particles.push({
          isDust: true,
          x: (Math.random() - 0.5) * width * 2.0,
          y: (Math.random() - 0.5) * height * 2.0,
          z: Math.random() * 1000 - 300, // randomly scattered on Z axis
          size: Math.random() * 1.8 + 1.0, // Increased size for visibility
          color,
        });
      }

      // 3. ScrollTrigger Timelines

      // Timeline 1: Morph Sphere -> Columns
      if (document.getElementById("stats")) {
        gsap.to(morph, {
          state0to1: 1,
          ease: "power1.inOut",
          scrollTrigger: {
            trigger: "#stats",
            start: "top bottom",
            end: "top 25%",
            scrub: 1.2,
          },
        });
      }

      // Timeline 2: Morph Columns -> Nodes
      if (document.getElementById("challenge")) {
        gsap.to(morph, {
          state1to2: 1,
          ease: "power1.inOut",
          scrollTrigger: {
            trigger: "#challenge",
            start: "top 95%",
            end: "top 25%",
            scrub: 1.2,
          },
        });
      }

      // Timeline 3: Morph Nodes -> Starfield
      if (document.getElementById("faq")) {
        gsap.to(morph, {
          state2to3: 1,
          ease: "power1.inOut",
          scrollTrigger: {
            trigger: "#faq",
            start: "top 95%",
            end: "top 20%",
            scrub: 1.2,
          },
        });
      }

      // Timeline 4: Pull all morphing particles forward on scroll (depth descent)
      gsap.to(morph, {
        scrollOffset: 1400, // Pushes shapes deeper past the camera
        ease: "none",
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });

      // 4. Render Loop
      let angleY = 0;
      let frameId: number;
      let currentVelocity = 0;
      let lastScrollY = typeof window !== "undefined" ? window.scrollY : 0;
      let scrollVel = 0;

      const handleScroll = () => {
        const currentScrollY = window.scrollY;
        // Calculate difference in scroll position
        scrollVel = Math.abs(currentScrollY - lastScrollY);
        lastScrollY = currentScrollY;
      };

      if (typeof window !== "undefined") {
        window.addEventListener("scroll", handleScroll);
      }

      const render = () => {
        ctx.clearRect(0, 0, width, height);

        // Slow orbital drift
        angleY += 0.0012;
        const cosY = Math.cos(angleY);
        const sinY = Math.sin(angleY);

        // Apply a gentle decay to speed when scrolling stops
        scrollVel *= 0.92;
        currentVelocity += (scrollVel - currentVelocity) * 0.08;

        // Projection caches
        const px: number[] = [];
        const py: number[] = [];
        const pz: number[] = [];

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];

          if (!p.isDust) {
            // A. MORPHING PARTICLE SYSTEM
            // 1. Double LERP coordinate states
            const tx1 = p.s0x! + (p.s1x! - p.s0x!) * morph.state0to1;
            const ty1 = p.s0y! + (p.s1y! - p.s0y!) * morph.state0to1;
            const tz1 = p.s0z! + (p.s1z! - p.s0z!) * morph.state0to1;

            const tx2 = tx1 + (p.s2x! - tx1) * morph.state1to2;
            const ty2 = ty1 + (p.s2y! - ty1) * morph.state1to2;
            const tz2 = tz1 + (p.s2z! - tz1) * morph.state1to2;

            const finalX = tx2 + (p.s3x! - tx2) * morph.state2to3;
            const finalY = ty2 + (p.s3y! - ty2) * morph.state2to3;
            const finalZ = tz2 + (p.s3z! - tz2) * morph.state2to3;

            // 2. Rotate around Y-axis
            const rx = finalX * cosY - finalZ * sinY;
            const rz = finalX * sinY + finalZ * cosY;

            p.x = rx;
            p.y = finalY;
            
            // Apply depth offset: pulling them past the camera on scroll down
            p.z = rz - morph.scrollOffset;

            // 3. Project
            const distance = fov + p.z;
            if (distance > 10) {
              const scale = fov / distance;
              const projX = centerX + p.x * scale;
              const projY = centerY + p.y * scale;

              px[i] = projX;
              py[i] = projY;
              pz[i] = p.z;

              // Brighter opacity for visibility
              const opacity = Math.min(1.0, Math.max(0.0, (distance - 20) / 200)) * (p.z > 0 ? 0.45 : 0.85);

              ctx.fillStyle = `${p.color}${opacity})`;
              ctx.beginPath();
              ctx.arc(projX, projY, p.size * (scale * 0.8), 0, Math.PI * 2);
              ctx.fill();
            } else {
              px[i] = -9999;
              py[i] = -9999;
              pz[i] = 9999;
            }
          } else {
            // B. PURE SPACE DUST (Continuous warp zoom travel)
            // 1. Move forward (Base speed is faster, scroll speed multiplier is 20x stronger)
            const speed = 1.0 + currentVelocity * 0.16; 
            p.z -= speed;

            // 2. Wrap-around when behind camera
            if (p.z < -fov) {
              p.z = 800; // Reset to far distance
              p.x = (Math.random() - 0.5) * width * 2.0;
              p.y = (Math.random() - 0.5) * height * 2.0;
            }

            // 3. Project
            const distance = fov + p.z;
            if (distance > 10) {
              const scale = fov / distance;
              const projX = centerX + p.x * scale;
              const projY = centerY + p.y * scale;

              // Stars form long streaks at high scroll speed
              const streak = Math.min(45, currentVelocity * 0.28); // Increased max streak length to 45px
              const opacity = Math.min(0.8, Math.max(0.0, (distance - 20) / 300)) * (p.z > 0 ? 0.45 : 0.8);

              ctx.fillStyle = `${p.color}${opacity})`;
              ctx.beginPath();
              if (streak > 1.2) {
                // High-speed streak line pointing outwards from screen center
                ctx.strokeStyle = `${p.color}${opacity})`;
                ctx.lineWidth = p.size * (scale * 0.8);
                ctx.beginPath();
                ctx.moveTo(projX, projY);
                const dx = projX - centerX;
                const dy = projY - centerY;
                const angle = Math.atan2(dy, dx);
                ctx.lineTo(projX + Math.cos(angle) * streak, projY + Math.sin(angle) * streak);
                ctx.stroke();
              } else {
                ctx.arc(projX, projY, p.size * (scale * 0.7), 0, Math.PI * 2);
                ctx.fill();
              }
            }
          }
        }

        // 4. Draw Connecting Lines in the Challenge state
        if (morph.state1to2 > 0.05 && morph.state2to3 < 0.95) {
          const progressFactor = morph.state1to2 * (1.0 - morph.state2to3);
          ctx.strokeStyle = `rgba(212, 175, 55, ${0.15 * progressFactor})`;
          ctx.lineWidth = 0.5;

          for (let j = 0; j < morphCount; j += 12) {
            if (px[j] === -9999 || pz[j] < -100) continue;
            for (let k = j + 12; k < Math.min(morphCount, j + 72); k += 12) {
              if (px[k] === -9999) continue;
              const dx = px[j] - px[k];
              const dy = py[j] - py[k];
              const distSq = dx * dx + dy * dy;

              if (distSq < 7200) {
                ctx.beginPath();
                ctx.moveTo(px[j], py[j]);
                ctx.lineTo(px[k], py[k]);
                ctx.stroke();
              }
            }
          }
        }

        frameId = requestAnimationFrame(render);
      };

      render();

      const handleResize = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        centerX = width / 2;
        centerY = height / 2;
      };

      window.addEventListener("resize", handleResize);

      return () => {
        cancelAnimationFrame(frameId);
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("scroll", handleScroll);
      };
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full bg-transparent" />
    </div>
  );
}
