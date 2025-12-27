"use client";

import { useState, useEffect } from "react";
import { MessageSquare, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

// Lazy load MomChat - it's heavy and not needed immediately
const MomChat = dynamic(() => import("@/components/features/MomChat"), {
    loading: () => <div className="p-4 text-center text-white/70">Loading MomAI...</div>,
    ssr: false
});

export function FloatingMomAI() {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    // Don't render until mounted (prevents hydration issues)
    if (!mounted) return null;

    return (
        <>
            {/* Floating Button */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full shadow-lg shadow-pink-500/40 border-2 border-white/20"
            >
                {isOpen ? (
                    <X className="w-6 h-6 text-white" />
                ) : (
                    <div className="relative">
                        <img
                            src="/mom-avatar.jpg"
                            alt="Mom"
                            className="w-10 h-10 rounded-full object-cover border border-white/50"
                            loading="lazy"
                            onError={(e) => e.currentTarget.src = "https://api.dicebear.com/7.x/avataaars/svg?seed=Mom"}
                        />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-black animate-pulse" />
                    </div>
                )}
            </motion.button>

            {/* Chat Window - only loads when opened */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-24 right-6 z-50 w-[350px] md:w-[400px] shadow-2xl"
                    >
                        <MomChat />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
