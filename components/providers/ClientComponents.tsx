"use client";

import dynamic from "next/dynamic";

// Lazy load heavy components with animations - prevents hydration issues
const WelcomeOverlay = dynamic(
    () => import("@/components/ui/WelcomeOverlay").then(mod => ({ default: mod.WelcomeOverlay })),
    { ssr: false }
);

const FloatingMomAI = dynamic(
    () => import("@/components/features/FloatingMomAI").then(mod => ({ default: mod.FloatingMomAI })),
    { ssr: false }
);

export function ClientComponents() {
    return (
        <>
            <WelcomeOverlay />
            <FloatingMomAI />
        </>
    );
}
