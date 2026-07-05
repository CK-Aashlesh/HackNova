"use client";

import dynamic from "next/dynamic";

const TheCurator = dynamic(() => import("@/components/ui/TheCurator"), {
    ssr: false,
});

export default function TheCuratorLoader() {
    return <TheCurator />;
}
