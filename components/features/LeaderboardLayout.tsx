"use client";

import { Card } from "@/components/ui/Card";
import { motion } from "framer-motion";
import { Trophy, ArrowLeft, Medal } from "lucide-react";
import Link from "next/link";

export function LeaderboardLayout() {
    // Mock Data for MVP (Replace with Firebase Fetch later)
    const leaderboard = [
        { rank: 1, name: "CryptoMom_OG", cookies: 15420, tier: "Based Mom" },
        { rank: 2, name: "CookieMonster", cookies: 12100, tier: "Far Mom" },
        { rank: 3, name: "BaseBuilder", cookies: 9800, tier: "Based Kid" },
        { rank: 4, name: "WarpcastUser", cookies: 8500, tier: "Far Kid" },
        { rank: 5, name: "MomFan123", cookies: 7200, tier: "Based Mom" },
    ];

    return (
        <div className="min-h-screen bg-black text-white p-4 md:p-8 flex flex-col items-center relative overflow-hidden">

            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-yellow-900/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-2xl w-full relative z-10 space-y-8">
                {/* Back Link */}
                <Link href="/" className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Link>

                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center gap-3">
                        <Trophy className="w-8 h-8 text-yellow-400" />
                        Top Moms
                    </h1>
                    <p className="text-gray-400">
                        The most active cookie bakers in the family.
                    </p>
                </div>

                {/* List */}
                <div className="space-y-3">
                    {leaderboard.map((user, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="p-4 flex items-center justify-between bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${index === 0 ? "bg-yellow-500 text-black" :
                                            index === 1 ? "bg-gray-400 text-black" :
                                                index === 2 ? "bg-orange-700 text-white" :
                                                    "bg-white/10 text-gray-400"
                                        }`}>
                                        {user.rank}
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">{user.name}</p>
                                        <p className="text-xs text-gray-400">{user.tier}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-mono text-yellow-400 font-bold">{user.cookies.toLocaleString()}</p>
                                    <p className="text-xs text-gray-500">Cookies</p>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <div className="text-center text-xs text-gray-500">
                    *Top 25 updated daily at midnight UTC.
                </div>
            </div>
        </div>
    );
}
