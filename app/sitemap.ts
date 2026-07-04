import type { MetadataRoute } from 'next';
import { SITE, absoluteUrl } from '@/lib/site';

/**
 * App Router sitemap. Regenerated on every deploy from this single source,
 * served at /sitemap.xml. Last-modified is the build time so search engines
 * see fresh dates whenever you push.
 */
export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();

    return [
        {
            url: SITE.url,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 1,
            // Multilingual + image hints - supported by Google's sitemap spec
            alternates: { languages: { 'en-IN': SITE.url } },
            images: [absoluteUrl('/api/og'), absoluteUrl('/logo.png')],
        },
        {
            url: absoluteUrl('/manifesto'),
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: absoluteUrl('/register'),
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: absoluteUrl('/code-of-conduct'),
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.4,
        },
        {
            url: absoluteUrl('/privacy'),
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: absoluteUrl('/terms'),
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
    ];
}
