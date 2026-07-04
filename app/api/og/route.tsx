import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

const W = 1200;
const H = 630;

/**
 * Dynamic share card.
 * Try:
 *   /api/og                          → default poster
 *   /api/og?team=Star+Voyagers       → personalized poster
 *   /api/og?team=...&kind=registered → "I just registered" variant
 *
 * Designed to match the editorial feel of the site:
 * one strong number / wordmark, a hairline rule, mono meta.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const team = (searchParams.get("team") || "").trim().slice(0, 60);
  const kind = (searchParams.get("kind") || "").trim().toLowerCase();

  const isRegistered = kind === "registered";
  const headline = team
    ? isRegistered
      ? "I just registered."
      : "We're going to HackNova."
    : "An exclusive AI hackathon.";
  const subhead = team
    ? team.toUpperCase()
    : "HACKNOVA · 2026";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "60px 72px",
          background:
            "radial-gradient(circle at 25% 20%, rgba(212,175,55,0.32) 0%, transparent 55%), radial-gradient(circle at 80% 90%, rgba(241,208,138,0.22) 0%, transparent 55%), #0D0D0D",
          color: "white",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
        }}
      >
        {/* Top meta */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            fontSize: 18,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.55)",
            borderTop: "1px solid rgba(255,255,255,0.18)",
            paddingTop: 22,
          }}
        >
          <span>HackNova · 2026</span>
          <span>Aug 22 - 23 · IIT Tirupati</span>
        </div>

        {/* Centered block */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {team && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                fontSize: 22,
                letterSpacing: 5,
                textTransform: "uppercase",
                color: "rgba(212,175,55,0.95)",
                marginBottom: 24,
              }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  background: "#D4AF37",
                  boxShadow: "0 0 20px rgba(212,175,55,0.8)",
                }}
              />
              {isRegistered ? "Confirmed · Team" : "Team"}
            </div>
          )}

          <div
            style={{
              fontSize: team ? 96 : 124,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: -3,
              textTransform: "uppercase",
              color: "white",
              maxWidth: 980,
              display: "flex",
            }}
          >
            {headline}
          </div>

          <div
            style={{
              fontSize: team ? 132 : 56,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: -4,
              textTransform: "uppercase",
              color: team ? "white" : "rgba(255,255,255,0.35)",
              marginTop: team ? 24 : 16,
              display: "flex",
              maxWidth: 1080,
              wordBreak: "break-word",
            }}
          >
            {subhead}
          </div>
        </div>

        {/* Bottom meta */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            fontSize: 18,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.55)",
            borderTop: "1px solid rgba(255,255,255,0.18)",
            paddingTop: 22,
          }}
        >
          <span>hacknova.in</span>
          <span>by Sphere Hive</span>
        </div>
      </div>
    ),
    {
      width: W,
      height: H,
      // 6h cache + stale-while-revalidate for share crawlers
      headers: {
        "Cache-Control":
          "public, max-age=21600, stale-while-revalidate=86400",
      },
    }
  );
}
