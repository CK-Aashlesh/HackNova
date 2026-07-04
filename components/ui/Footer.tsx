"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Github, Instagram, Linkedin, Twitter, Mail, ArrowUp } from "lucide-react";

const socials = [
  { Icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { Icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { Icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { Icon: Github, href: "https://github.com", label: "GitHub" },
];

const links = {
  Event: [
    { label: "About", href: "/#about" },
    { label: "Challenge", href: "/#challenge" },
    { label: "Schedule", href: "/#schedule" },
    { label: "Sponsors", href: "/#sponsors" },
    { label: "Manifesto", href: "/manifesto" },
    { label: "FAQ", href: "/#faq" },
  ],
  Legal: [
    { label: "Code of Conduct", href: "/code-of-conduct" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
  ],
};

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative pt-20 pb-10 bg-space-black border-t border-space-violet/25 overflow-hidden">
      {/* Top edge gradient */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-space-purple/60 to-transparent" />

      {/* Glow */}
      <div
        className="absolute top-[-30%] left-1/2 -translate-x-1/2 w-[80%] h-[400px] blur-[120px] opacity-30 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(212,175,55,0.25) 0%, transparent 60%)",
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* Massive watermark + grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 mb-16">
          {/* Brand block */}
          <div className="lg:col-span-5">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 text-white font-display font-black text-base tracking-[2px] mb-5"
            >
              <span className="relative inline-flex">
                <span className="absolute inset-0 rounded-full bg-space-purple/40 blur-md" />
                <img
                  src="/logo.png"
                  alt="HackNova"
                  className="relative h-8 w-8 object-contain"
                />
              </span>
              HACKNOVA
            </Link>

            <p className="text-sm text-ink-dim font-light leading-relaxed max-w-md mb-6">
              A 24-hour AI hackathon presented by Sphere Hive at IIT Tirupati, exclusive for IIT Tirupati, IISER Tirupati, and neighbouring institutes.
            </p>

            {/* Socials */}
            <div className="flex items-center gap-2">
              {socials.map(({ Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 rounded-full glass-card flex items-center justify-center text-white/60 hover:text-white hover:bg-space-purple/15 hover:border-space-purple/40 transition-colors duration-200"
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-6">
            {Object.entries(links).map(([title, items]) => (
              <div key={title}>
                <div className="text-space-purple font-mono text-[10px] uppercase tracking-[0.3em] font-bold mb-4">
                  {title}
                </div>
                <ul className="space-y-2.5">
                  {items.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="text-[13px] text-ink-dim hover:text-white transition-colors underline-grow"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Contact / CTA */}
          <div className="lg:col-span-3">
            <div className="text-space-purple font-mono text-[10px] uppercase tracking-[0.3em] font-bold mb-4">
              Contact
            </div>
            <a
              href="mailto:spherehive@kvgce.ac.in"
              className="group inline-flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors"
            >
              <Mail className="w-4 h-4 text-space-purple-glow" />
              spherehive@kvgce.ac.in
            </a>
            <p className="mt-4 text-[12px] text-ink-dim font-light leading-relaxed">
              Sphere Hive, HQ · KVG College of Engineering · Sullia<br />
              India · 574327
            </p>

            <Link
              href="/register"
              className="mt-6 btn-primary inline-flex w-full px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] !rounded-full justify-center"
            >
              Register Now
            </Link>
          </div>
        </div>

        {/* Watermark */}
        <div className="relative overflow-hidden mb-8">
          <div className="font-display font-black text-center leading-[0.85] tracking-[-0.05em] uppercase text-[18vw] md:text-[15vw] text-stroke select-none pointer-events-none">
            HACKNOVA
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-space-violet/25 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-mono text-[11px] tracking-[0.2em] text-ink-dim uppercase">
            © {new Date().getFullYear()} HackNova powered by 3LC · Three lines of code
          </div>

          <button
            onClick={scrollToTop}
            className="group inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.25em] text-white/55 hover:text-white transition-colors"
          >
            Back to top
            <span className="w-7 h-7 rounded-full glass-card flex items-center justify-center group-hover:bg-space-purple/15 group-hover:border-space-purple/40 transition-colors">
              <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
