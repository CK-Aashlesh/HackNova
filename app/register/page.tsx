import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Register for HackNova powered by 3LC",
  description:
    "Register your team for HackNova powered by 3LC - a free 24-hour AI hackathon at IIT Tirupati, August 29 - 30, 2026, exclusive for IIT Tirupati, IISER Tirupati, and neighbouring institutes.",
  alternates: { canonical: "/register" },
  robots: {
    // Page is just a redirect - let crawlers follow but don't index the empty body
    index: false,
    follow: true,
  },
};

export default function Register() {
  redirect(SITE.event.registerUrl);
}
