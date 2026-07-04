import React from 'react';
import type { Metadata, Viewport } from 'next';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import StarField from '@/components/ui/StarField';
import ParticleCanvas from '@/components/ui/ParticleCanvas';
import ScrollProgress from '@/components/ui/ScrollProgress';
import IntroSplash from '@/components/ui/IntroSplash';
import CommandPalette from '@/components/ui/CommandPalette';
import {
    EventJsonLd,
    OrganizationJsonLd,
    WebsiteJsonLd,
} from '@/components/seo/JsonLd';
import { SITE, absoluteUrl } from '@/lib/site';
import './globals.css';

const TITLE = `${SITE.brand} | AI Hackathon · 24 Hours · IIT Tirupati`;
const DESCRIPTION =
    'HackNova 2026 is a free 24-hour AI hackathon by Sphere Hive at IIT Tirupati (August 22 - 23, 2026), exclusive for IIT Tirupati, IISER Tirupati, and neighbouring institutes. Compete on a data-centric AI challenge with 3LC.ai. ₹50,000 prize pool plus sponsored prizes.';

export const viewport: Viewport = {
    themeColor: SITE.themeColor,
    colorScheme: 'dark',
    width: 'device-width',
    initialScale: 1,
};

export const metadata: Metadata = {
    metadataBase: new URL(SITE.url),
    title: {
        default: TITLE,
        template: '%s · HackNova 2026',
    },
    description: DESCRIPTION,
    applicationName: SITE.name,
    generator: 'Next.js',
    referrer: 'origin-when-cross-origin',
    keywords: [
        'HackNova',
        'HackNova 2026',
        'AI hackathon',
        'AI hackathon India',
        'IISER Tirupati hackathon',
        'IIT Tirupati tech fest',
        'IIT Tirupati hackathon',
        'data centric AI hackathon',
        '3LC.ai hackathon',
        'Sphere Hive',
        'KVG College Sullia',
        '24 hour hackathon',
        'student hackathon India 2026',
        'machine learning competition India',
        'tech fest Andhra Pradesh 2026',
        'free hackathon',
    ],
    authors: [{ name: SITE.organisation.name, url: SITE.url }],
    creator: SITE.organisation.name,
    publisher: SITE.organisation.name,
    category: 'education',
    alternates: {
        canonical: SITE.url,
        languages: {
            'en-IN': SITE.url,
            'x-default': SITE.url,
        },
    },
    openGraph: {
        title: TITLE,
        description: DESCRIPTION,
        url: SITE.url,
        siteName: SITE.name,
        images: [
            {
                url: absoluteUrl('/api/og'),
                width: 1200,
                height: 630,
                alt: 'HackNova 2026 - National AI Hackathon',
            },
        ],
        locale: 'en_IN',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: TITLE,
        description: DESCRIPTION,
        images: [absoluteUrl('/api/og')],
        creator: '@spherehive',
    },
    icons: {
        icon: [
            { url: '/logo.ico', sizes: '32x32' },
            { url: '/logo.ico', sizes: 'any' },
            { url: '/logo.png', type: 'image/png' },
        ],
        apple: [{ url: '/logo.png' }],
        shortcut: ['/logo.ico'],
    },
    manifest: '/manifest.webmanifest',
    robots: {
        index: true,
        follow: true,
        nocache: false,
        googleBot: {
            index: true,
            follow: true,
            noimageindex: false,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    verification: {
        // Drop your Search Console / Bing / Yandex codes into env when you have them.
        google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
        other: {
            'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || '',
        },
    },
    other: {
        // Subject hint for academic / college search engines and crawlers
        'subject': 'AI Hackathon, Data-Centric AI, Student Tech Event',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en-IN" dir="ltr">
            <head>
                {/* Pre-connect to assets we will reach for fast */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                {/* RSS-style discovery for the manifesto (helps content surfaces) */}
                <link
                    rel="alternate"
                    type="text/html"
                    href={absoluteUrl('/manifesto')}
                    title="HackNova Manifesto"
                />
            </head>
            <body className="min-h-screen bg-space-black text-white font-sans selection:bg-space-purple selection:text-white relative flex flex-col">
                {/* Site-wide JSON-LD: rendered server-side so crawlers see it without JS */}
                <EventJsonLd />
                <OrganizationJsonLd />
                <WebsiteJsonLd />

                {/* First-paint intro splash (2.5s editorial counter) */}
                <IntroSplash />

                {/* Ambient cosmic backdrop */}
                <StarField />
                <ParticleCanvas />

                {/* Top-of-page scroll progress bar */}
                <ScrollProgress />

                {/* Side rails */}
                <div className="fixed bottom-20 left-10 [writing-mode:vertical-rl] rotate-180 text-[10px] font-mono tracking-[0.4em] uppercase text-white/25 z-40 pointer-events-none hidden lg:block">
                    Three · lines · of · code
                </div>
                <div className="fixed bottom-20 right-10 [writing-mode:vertical-rl] text-[10px] font-mono tracking-[0.4em] uppercase text-white/25 z-40 pointer-events-none hidden lg:block">
                    Navigate · the · stars
                </div>

                <Navbar />
                <main className="flex-grow relative z-10">{children}</main>
                <Footer />

                <CommandPalette />
            </body>
        </html>
    );
}
