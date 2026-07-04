import type { Metadata } from 'next';
import CodeOfConduct from '@/components/sections/CodeOfConduct';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
    title: 'Code of Conduct',
    description:
        'The HackNova 2026 Code of Conduct - our commitment to a safe, inclusive, harassment-free hackathon for every participant.',
    alternates: { canonical: '/code-of-conduct' },
};

export default function Page() {
    return (
        <>
            <BreadcrumbJsonLd
                items={[
                    { name: 'Home', url: '/' },
                    { name: 'Code of Conduct', url: '/code-of-conduct' },
                ]}
            />
            <CodeOfConduct />
        </>
    );
}
