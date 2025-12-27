"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

// Lazy load heavy components with animations - prevents hydration issues
const FloatingMomAI = dynamic(
    () => import("@/components/features/FloatingMomAI").then(mod => ({ default: mod.FloatingMomAI })),
    { ssr: false, loading: () => null }
);

export function ClientComponents() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Don't render anything until client-side mounted
    if (!mounted) return null;

    return (
        <>
            <FloatingMomAI />
        </>
    );
}
