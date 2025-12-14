"use client";

import { useUserSession } from "@/components/providers/UserSessionProvider";
import { Card } from "@/components/ui/Card";
import { motion } from "framer-motion";
import { Cookie } from "lucide-react";

export function CookieCounter() {
    const { userData } = useUserSession();

    return (
        <Card className="p-6 bg-gradient-to-br from-orange-400/20 to-yellow-400/20 border-orange-400/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Cookie className="w-32 h-32 text-orange-500" />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center space-y-2">
                <div className="p-3 bg-orange-500/20 rounded-full mb-2">
                    <Cookie className="w-8 h-8 text-orange-400" />
                </div>
                <h3 className="text-xl font-bold text-orange-200">Your Cookies</h3>
                <motion.div
                    key={userData?.leaderboardScore}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-5xl font-black text-white drop-shadow-xl font-mono"
                >
                    {(userData?.leaderboardScore || 0).toLocaleString()}
                </motion.div>
                <p className="text-sm text-orange-300/80">
                    Earn cookies by minting, inviting, and posting memes!
                </p>
            </div>
        </Card>
    );
}
