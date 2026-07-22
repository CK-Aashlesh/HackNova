/**
 * FAQ source of truth.
 * Used by:
 *   - components/ui/FAQ.tsx (visible accordion)
 *   - components/seo/JsonLd.tsx → FAQJsonLd (rich result)
 *
 * Keep questions short; answers self-contained (no "as mentioned above")
 * so each one reads cleanly when Google snippets it.
 */
export type FAQItem = { question: string; answer: string };

export const FAQS: FAQItem[] = [
  {
    question: "Who can participate in HackNova 2026?",
    answer:
      "HackNova 2026 is exclusive for students of IIT Tirupati, IISER Tirupati, and neighbouring institutes. You can be a beginner or a seasoned coder - both are welcome.",
  },
  {
    question: "Is HackNova a team or solo hackathon?",
    answer:
      "It is a team hackathon. Teams of 2 to 4 members compete together. You can register as an existing team or assemble one before submission closes.",
  },
  {
    question: "How much does it cost to register for HackNova?",
    answer:
      "Registration for HackNova 2026 is completely free. There is no participation fee.",
  },
  {
    question: "Who owns the work I build during HackNova?",
    answer:
      "You do. The code you ship during the hackathon stays entirely yours, except where sponsor-specific bounty rules apply - those are communicated up front.",
  },
  {
    question: "Will food and drinks be provided at HackNova?",
    answer:
      "Yes. Full meals, snacks, and caffeine are provided throughout the 24-hour event so you can focus on building.",
  },
  {
    question: "Do I need prior AI or machine learning experience?",
    answer:
      "No prior expertise is required. Mentors and warm-up materials are provided so any motivated builder can compete on day one.",
  },
  {
    question: "Where is HackNova 2026 held?",
    answer:
      "HackNova 2026 is held offline at IIT Tirupati, Andhra Pradesh, India on August 29 - 30, 2026.",
  },
  {
    question: "What is the prize pool for HackNova 2026?",
    answer:
      "The total prize pool is ₹50,000 along with sponsored prizes, free .xyz domain registration for every participant, certificates, and goodies.",
  },
];
