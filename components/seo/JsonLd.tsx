import { SITE, absoluteUrl } from "@/lib/site";

/**
 * Server-rendered JSON-LD blocks. Each one targets a specific Google
 * rich-result feature:
 *
 *   <EventJsonLd>     → Event listing rich result (calendar / "happening soon")
 *   <OrganizationJsonLd> → Knowledge-panel surface for "Sphere Hive"
 *   <WebsiteJsonLd>   → Sitelinks searchbox eligibility
 *   <BreadcrumbJsonLd>→ Breadcrumb trail under SERP titles
 *   <FAQJsonLd>       → Expandable FAQ list under the homepage result
 *
 * Render them inline in the page server component so the JSON is in the
 * initial HTML - Googlebot does not need to evaluate JS to find them.
 */

function script(json: Record<string, unknown>) {
  // Use dangerouslySetInnerHTML so it renders as a literal <script type="application/ld+json"> block.
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(json).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export function EventJsonLd() {
  const e = SITE.event;
  return script({
    "@context": "https://schema.org",
    "@type": "Hackathon",
    name: e.name,
    description: SITE.longDescription,
    startDate: e.startDate,
    endDate: e.endDate,
    eventStatus: e.eventStatus,
    eventAttendanceMode: e.attendanceMode,
    image: [absoluteUrl("/api/og")],
    url: SITE.url,
    inLanguage: "en-IN",
    isAccessibleForFree: true,
    keywords: e.keywords.join(", "),
    location: {
      "@type": "Place",
      name: e.venue.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: e.venue.streetAddress,
        addressLocality: e.venue.addressLocality,
        addressRegion: e.venue.addressRegion,
        postalCode: e.venue.postalCode,
        addressCountry: e.venue.addressCountry,
      },
    },
    organizer: {
      "@type": "Organization",
      name: SITE.organisation.name,
      url: SITE.url,
      sameAs: [SITE.organisation.instagram],
    },
    sponsor: [
      {
        "@type": "Organization",
        name: "3LC.ai",
        url: "https://3lc.ai",
      },
      {
        "@type": "Organization",
        name: "Gen.xyz",
        url: "https://gen.xyz",
      },
    ],
    offers: {
      "@type": "Offer",
      url: e.registerUrl,
      price: "0",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      validFrom: "2025-12-01T00:00:00+05:30",
      category: "Free registration",
    },
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "student",
    },
    award: e.prizePool,
  });
}

export function OrganizationJsonLd() {
  const o = SITE.organisation;
  return script({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: o.name,
    legalName: o.legalName,
    url: SITE.url,
    logo: absoluteUrl("/logo.png"),
    foundingDate: o.foundingDate,
    parentOrganization: { "@type": "CollegeOrUniversity", name: o.parent },
    email: o.email,
    sameAs: [o.instagram, ...Object.values(SITE.socials)].filter(
      (v, i, a) => v && a.indexOf(v) === i,
    ),
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: o.email,
        areaServed: "IN",
        availableLanguage: ["English", "Kannada", "Hindi"],
      },
    ],
  });
}

export function WebsiteJsonLd() {
  return script({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    inLanguage: "en-IN",
    publisher: { "@type": "Organization", name: SITE.organisation.name },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE.url}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  });
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: Array<{ name: string; url: string }>;
}) {
  return script({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url.startsWith("http") ? it.url : absoluteUrl(it.url),
    })),
  });
}

export function FAQJsonLd({
  items,
}: {
  items: Array<{ question: string; answer: string }>;
}) {
  return script({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  });
}
