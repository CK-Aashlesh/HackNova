import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

/**
 * Web app manifest served at /manifest.webmanifest.
 * Improves PWA installability scores in Lighthouse and the Chrome
 * "Add to Home Screen" prompt - both signals Google uses for mobile UX.
 */
export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'HackNova 2026 - AI Hackathon',
        short_name: 'HackNova',
        description: SITE.shortDescription,
        start_url: '/',
        display: 'standalone',
        background_color: SITE.themeColor,
        theme_color: SITE.themeColor,
        orientation: 'portrait',
        lang: 'en-IN',
        categories: ['education', 'events', 'productivity'],
        icons: [
            { src: '/logo.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
            { src: '/logo.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
            { src: '/logo.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
        ],
    };
}
