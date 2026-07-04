import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Manifesto · Why HackNova is built on Data-Centric AI",
  description:
    "Why HackNova 2026 is built around data-centric AI with 3LC.ai - and why that changes who wins the hackathon. A short read on judgement, taste, and the actual job of an ML engineer.",
  alternates: { canonical: "/manifesto" },
  openGraph: {
    type: "article",
    title: "HackNova Manifesto - Improve the data, not the model",
    description:
      "Why HackNova 2026 is built around data-centric AI with 3LC.ai - and why that changes who wins.",
    url: absoluteUrl("/manifesto"),
    siteName: SITE.name,
    images: [absoluteUrl("/api/og?team=Manifesto")],
  },
  twitter: {
    card: "summary_large_image",
    title: "HackNova Manifesto - Improve the data, not the model",
    description:
      "Why HackNova 2026 is built around data-centric AI with 3LC.ai.",
    images: [absoluteUrl("/api/og?team=Manifesto")],
  },
};

export default function ManifestoPage() {
  return (
    <article className="relative pt-36 pb-32">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Manifesto", url: "/manifesto" },
        ]}
      />
      <div className="container mx-auto px-6 max-w-3xl">
        {/* Top meta */}
        <div className="flex items-baseline justify-between border-t border-white/10 pt-5 mb-12 font-mono text-[10px] tracking-[0.3em] uppercase text-white/45">
          <Link
            href="/"
            className="inline-flex items-center gap-2 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            Back
          </Link>
          <span>Manifesto · 2026</span>
        </div>

        {/* Title */}
        <h1 className="font-display font-black text-white tracking-[-0.035em] leading-[0.95] uppercase text-[44px] sm:text-[60px] md:text-[76px] mb-12">
          Improve the data,
          <br />
          <span className="text-white/35">not the model.</span>
        </h1>

        {/* Lede */}
        <p className="text-white/85 text-lg leading-[1.7] mb-10">
          Most AI competitions reward whoever has the most compute, the most
          recent paper, and the patience to babysit a training run for fifteen
          hours. HackNova is built differently. The model is fixed. The
          architecture is fixed. The only thing you can change is the dataset
          itself - and that is where the real signal lives.
        </p>

        <Section title="01 · The thesis">
          <p>
            Every production AI team you admire has the same dirty secret:
            their week-to-week wins almost never come from a new architecture.
            They come from spotting the seven mislabeled images that pulled the
            model in the wrong direction, or the one rare class that the
            sampler quietly starved.
          </p>
          <p>
            We chose this format because it forces builders to confront the
            actual job. You will not impress us with a transformer you found on
            arxiv last week. You will impress us by looking at your data the
            way a writer looks at a draft - closely, repeatedly, and with the
            willingness to throw away the ten percent that&apos;s lying to you.
          </p>
        </Section>

        <Section title="02 · What you are actually doing">
          <p>
            On day one you will receive a small labeled image set, a frozen
            classifier, and a much larger pool of unlabeled candidates. Your
            job for the next twenty-four hours is to decide which of those
            candidates are worth labeling, label them well, and feed them back
            until the model on the held-out set climbs.
          </p>
          <p>
            We use{" "}
            <a
              href="https://3lc.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white border-b border-white/20 hover:border-white pb-0.5"
            >
              3LC
            </a>{" "}
            to make the embeddings, the per-sample model feedback, and the
            label history first-class objects you can hold in your hands. The
            tooling exists. The taste is on you.
          </p>
        </Section>

        <Section title="03 · How we judge">
          <p>
            Final accuracy is the visible metric, but it is not the whole
            story. We will read your write-up. We will look at the trajectory
            of your runs. Two teams can land within half a point of each other
            and one of them will win comfortably because they made decisions on
            purpose, and the other one trusted the leaderboard.
          </p>
          <p>
            Show your work. Tell us which samples you killed, which you kept,
            and which one you almost gave up on before you noticed the tell.
            That story is what we are paying attention to.
          </p>
        </Section>

        <Section title="04 · Who this is for">
          <p>
            You do not need to have shipped a model in production. You do not
            need three years of PyTorch on your résumé. You need to be the kind
            of person who, when the metric stops moving, does not immediately
            reach for a different optimizer. You reach for the data.
          </p>
          <p>
            If that sounds like you - or like someone you want to become for a
            weekend - register your team and meet us in Tirupati.
          </p>
        </Section>

        {/* CTA */}
        <div className="mt-16 border-t border-white/10 pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="font-display text-xl font-black text-white tracking-[-0.01em] uppercase">
              Bring your A-team.
            </div>
            <p className="text-sm text-white/55 mt-1">
              August 22 - 23, 2026 · IIT Tirupati
            </p>
          </div>
          <a
            href="https://unstop.com/p/hacknova-sphere-hive-kvg-college-of-engineering-sullia-1693176"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary group h-12 px-7 min-w-[180px] text-[12px] font-bold uppercase tracking-[0.18em]"
          >
            Register Now
            <ArrowUpRight className="w-4 h-4 -mr-1 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </article>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-12">
      <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/45 mb-4">
        {title}
      </div>
      <div className="space-y-5 text-white/75 text-[15px] sm:text-base leading-[1.75]">
        {children}
      </div>
    </section>
  );
}
