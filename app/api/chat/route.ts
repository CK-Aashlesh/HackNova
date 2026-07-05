import { NextRequest, NextResponse } from 'next/server';

// ---------------------------------------------------------------------------
// Google GenAI SDK – imported dynamically only when the key is available so
// the build never fails in environments where the package isn't resolved.
// ---------------------------------------------------------------------------
import { GoogleGenAI } from '@google/genai';

// ---------------------------------------------------------------------------
// CORS helpers – allow the mascot widget to call from any origin during dev.
// ---------------------------------------------------------------------------
const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

/** Preflight handler */
export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

// ---------------------------------------------------------------------------
// Valid mascot expression states
// ---------------------------------------------------------------------------
const VALID_STATES = [
  'idle',
  'wave',
  'thinking',
  'surprise',
  'point_left',
  'point_right',
  'thumbs_up',
  'celebrate',
  'sleep',
  'look_around',
  'happy',
  'sad',
  'jump',
] as const;

type MascotState = (typeof VALID_STATES)[number];

// ---------------------------------------------------------------------------
// Local knowledge base – used as a fallback when Gemini is unavailable.
// ---------------------------------------------------------------------------
interface KnowledgeEntry {
  keywords: string[];
  answer: string;
  state: MascotState;
}

const KNOWLEDGE_BASE: KnowledgeEntry[] = [
  {
    keywords: ['what', 'hacknova', 'about', 'tell', 'explain', 'info'],
    answer:
      'HackNova 2026 is a free 24-hour AI hackathon by Sphere Hive at IIT Tirupati on Aug 22–23, 2026. Build cool AI projects, win prizes, and have a blast! 🚀',
    state: 'wave',
  },
  {
    keywords: ['who', 'eligible', 'eligibility', 'participate', 'join', 'allowed', 'can i'],
    answer:
      'HackNova is open to students from IIT Tirupati, IISER Tirupati, and neighbouring institutes. Everyone is welcome — no prior AI experience needed!',
    state: 'happy',
  },
  {
    keywords: ['team', 'size', 'members', 'people', 'group', 'solo'],
    answer:
      'Teams can have 2–4 members. Grab your friends and start building! 🤝',
    state: 'idle',
  },
  {
    keywords: ['cost', 'fee', 'free', 'pay', 'price', 'money', 'charge'],
    answer:
      'HackNova is completely FREE to attend. No registration fee at all — just bring your laptop and enthusiasm! 🎉',
    state: 'happy',
  },
  {
    keywords: ['prize', 'prizes', 'reward', 'win', 'winning', 'pool', 'amount'],
    answer:
      'There\'s a ₹50,000 prize pool up for grabs! Plus bragging rights, of course. 🏆',
    state: 'surprise',
  },
  {
    keywords: ['when', 'date', 'time', 'schedule', 'day', 'august', 'aug'],
    answer:
      'HackNova runs for 24 hours on August 22–23, 2026. Mark your calendar! 📅',
    state: 'idle',
  },
  {
    keywords: ['where', 'location', 'venue', 'place', 'address', 'iit', 'tirupati', 'campus'],
    answer:
      'It\'s happening at IIT Tirupati campus. See you there! 📍',
    state: 'point_left',
  },
  {
    keywords: ['food', 'snack', 'eat', 'drink', 'coffee', 'caffeine', 'meals', 'hungry'],
    answer:
      'Food, snacks, and unlimited caffeine are provided throughout the hackathon. No hungry hackers on our watch! ☕🍕',
    state: 'happy',
  },
  {
    keywords: ['register', 'registration', 'sign', 'signup', 'apply', 'how', 'unstop', 'link'],
    answer:
      'Registration is free on Unstop! Head over to our registration page and grab your spot before they fill up. 📝',
    state: 'point_right',
  },
  {
    keywords: ['experience', 'beginner', 'skill', 'know', 'prerequisite', 'background', 'newbie', 'noob'],
    answer:
      'No prior AI experience needed! We\'ll have mentors to guide you, and the event is beginner-friendly. Just come ready to learn! 💪',
    state: 'thumbs_up',
  },
  {
    keywords: ['sponsor', 'sponsors', '3lc', 'partner', 'backed', 'organizer', 'sphere', 'hive'],
    answer:
      'HackNova is organised by Sphere Hive and features a data-centric AI challenge powered by 3LC.ai. 🤖',
    state: 'point_left',
  },
  {
    keywords: ['ip', 'ownership', 'intellectual', 'property', 'code', 'rights', 'keep'],
    answer:
      'You retain full IP and ownership of everything you build at HackNova. It\'s YOUR project! 🛡️',
    state: 'thumbs_up',
  },
  {
    keywords: ['domain', 'xyz', '.xyz', 'free domain'],
    answer:
      'Every participant gets a free .xyz domain! A nice perk to host your hackathon project. 🌐',
    state: 'happy',
  },
  {
    keywords: ['mentor', 'mentors', 'help', 'guidance', 'support'],
    answer:
      'We have experienced mentors on-site to help you throughout the hackathon. Don\'t hesitate to ask for guidance! 🧑‍🏫',
    state: 'thumbs_up',
  },
];

const DEFAULT_ANSWER: { answer: string; state: MascotState } = {
  answer:
    "Great question! I'm not 100 % sure about that one. Check out our website or ask an organiser for more details. I'm here if you need anything else! 😊",
  state: 'idle',
};

// ---------------------------------------------------------------------------
// Fuzzy matcher – tokenise → count keyword hits → pick best match.
// ---------------------------------------------------------------------------
function fuzzyMatch(message: string): { answer: string; state: MascotState } {
  const tokens = message
    .toLowerCase()
    .replace(/[^a-z0-9\s.]/g, '')
    .split(/\s+/)
    .filter(Boolean);

  let bestEntry: KnowledgeEntry | null = null;
  let bestScore = 0;

  for (const entry of KNOWLEDGE_BASE) {
    let score = 0;
    for (const keyword of entry.keywords) {
      // Support multi-word keywords (e.g. "can i", "free domain")
      if (keyword.includes(' ')) {
        if (message.toLowerCase().includes(keyword)) score += 2;
      } else if (tokens.includes(keyword)) {
        score += 1;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestEntry = entry;
    }
  }

  if (bestEntry && bestScore > 0) {
    return { answer: bestEntry.answer, state: bestEntry.state };
  }

  return DEFAULT_ANSWER;
}

// ---------------------------------------------------------------------------
// Gemini helper – returns { reply, suggestedState } or null on failure.
// ---------------------------------------------------------------------------
const SYSTEM_INSTRUCTION = `You are The Curator, a friendly AI assistant mascot for HackNova 2026 — a free 24-hour AI hackathon by Sphere Hive at IIT Tirupati (Aug 22-23, 2026). Teams of 2-4. ₹50,000 prize pool. Registration is free on Unstop. The event is exclusive for IIT Tirupati, IISER Tirupati, and neighbouring institutes. The challenge is a data-centric AI challenge powered by 3LC.ai. Food, snacks, caffeine provided. No prior AI experience needed. Mentors available. Every participant gets a free .xyz domain. Keep answers brief (1-3 sentences), friendly, and helpful. Also include in your response a JSON tag like [STATE:happy] to indicate what expression state you recommend. Valid states: idle, wave, happy, sad, surprise, thumbs_up, point_left, point_right, celebrate, jump.`;

const STATE_TAG_REGEX = /\[STATE:(\w+)\]/i;

function parseStateTag(text: string): { reply: string; suggestedState: MascotState } {
  const match = text.match(STATE_TAG_REGEX);
  let suggestedState: MascotState = 'idle';

  if (match) {
    const raw = match[1].toLowerCase();
    if ((VALID_STATES as readonly string[]).includes(raw)) {
      suggestedState = raw as MascotState;
    }
  }

  // Strip ALL [STATE:xxx] tags from the visible reply
  const reply = text.replace(/\[STATE:\w+\]/gi, '').trim();

  return { reply, suggestedState };
}

async function askGemini(
  userMessage: string,
): Promise<{ reply: string; suggestedState: MascotState } | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: userMessage,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        maxOutputTokens: 256,
      },
    });

    const text = response.text;
    if (!text) return null;

    return parseStateTag(text);
  } catch (err) {
    console.error('[chat/route] Gemini error:', err);
    return null;
  }
}

// ---------------------------------------------------------------------------
// POST /api/chat
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message: string | undefined = body?.message;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'A non-empty "message" field is required.' },
        { status: 400, headers: CORS_HEADERS },
      );
    }

    // 1️⃣ Try Gemini first
    const geminiResult = await askGemini(message.trim());

    if (geminiResult) {
      return NextResponse.json(
        { reply: geminiResult.reply, suggestedState: geminiResult.suggestedState },
        { status: 200, headers: CORS_HEADERS },
      );
    }

    // 2️⃣ Fallback to local knowledge base
    const fallback = fuzzyMatch(message);

    return NextResponse.json(
      { reply: fallback.answer, suggestedState: fallback.state },
      { status: 200, headers: CORS_HEADERS },
    );
  } catch (err) {
    console.error('[chat/route] Unexpected error:', err);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500, headers: CORS_HEADERS },
    );
  }
}
