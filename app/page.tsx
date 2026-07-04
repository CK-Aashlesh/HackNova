import type { Metadata } from 'next';
import Home from '@/components/sections/Home';
import { BreadcrumbJsonLd, FAQJsonLd } from '@/components/seo/JsonLd';
import { FAQS } from '@/lib/faqs';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
    title:
        'HackNova powered by 3LC · AI Hackathon at IIT Tirupati · 24 Hours · August 22 - 23',
    description:
        'HackNova powered by 3LC - a free 24-hour AI hackathon by Sphere Hive at IIT Tirupati, exclusive for IIT Tirupati, IISER Tirupati, and neighbouring institutes. Compete on a data-centric AI challenge with 3LC.ai. ₹50,000 prize pool, mentors, swag, and free .xyz domain for every participant.',
    alternates: { canonical: '/' },
};

export default function Page() {
    return (
        <>
            <FAQJsonLd items={FAQS} />
            <BreadcrumbJsonLd
                items={[{ name: 'Home', url: SITE.url }]}
            />
            <Home />
        </>
    );
}
