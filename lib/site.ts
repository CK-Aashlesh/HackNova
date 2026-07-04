/**
 * Single source of truth for site-wide constants used in metadata,
 * structured data, sitemap, manifest, and the OG image generator.
 *
 * Keep this small - anything change-prone (date, venue, prize) lives here
 * so SEO assets never drift from the visible content.
 */

export const SITE = {
  name: "HackNova",
  brand: "HackNova powered by 3LC",
  shortDescription:
    "A 24-hour AI hackathon by Sphere Hive at IIT Tirupati, exclusive for IIT Tirupati, IISER Tirupati, and neighbouring institutes.",
  longDescription:
    "HackNova 2026 is a 24-hour Artificial Intelligence hackathon hosted by Sphere Hive at IIT Tirupati, exclusive for IIT Tirupati, IISER Tirupati, and neighbouring institutes. Teams compete on a single data-centric AI challenge powered by 3LC.ai - improving model accuracy by improving the dataset itself.",
  // The canonical, public, production URL. Override in env if you change domains.
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://hacknova.in",
  locale: "en_IN",
  themeColor: "#D4AF37",

  organisation: {
    name: "Sphere Hive",
    legalName: "Sphere Hive - Technology & Innovation Club",
    foundingDate: "2024-11",
    parent: "KVG College of Engineering, Sullia",
    email: "spherehive@kvgce.ac.in",
    instagram: "https://www.instagram.com/spherehive",
    whatsapp: "https://chat.whatsapp.com/IhdbBT7OKAd1LHpYy9XBkc",
  },

  event: {
    name: "HackNova 2026",
    startDate: "2026-08-22T09:00:00+05:30",
    endDate: "2026-08-23T13:00:00+05:30",
    eventStatus: "https://schema.org/EventScheduled",
    attendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    venue: {
      name: "IIT Tirupati",
      streetAddress: "IIT Tirupati, Yerpedu-Venkatagiri Road, Settipalli",
      addressLocality: "Tirupati",
      addressRegion: "Andhra Pradesh",
      postalCode: "517619",
      addressCountry: "IN",
    },
    registerUrl:
      "https://unstop.com/p/hacknova-sphere-hive-kvg-college-of-engineering-sullia-1693176",
    prizePool: "INR 50,000",
    keywords: [
      "AI Hackathon",
      "AI Hackathon 2026",
      "IIT Tirupati Hackathon",
      "Andhra Pradesh tech fest 2026",
      "Data-centric AI competition",
      "Student AI hackathon India",
      "24 hour hackathon",
      "Sphere Hive HackNova",
    ],
  },

  socials: {
    twitter: "https://twitter.com",
    instagram: "https://www.instagram.com/spherehive",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
  },
} as const;

export const absoluteUrl = (path = "/") =>
  `${SITE.url}${path.startsWith("/") ? path : "/" + path}`;
