"use client";

import Leaderboard from "@/components/features/Leaderboard";
import { CookieLeaderboard } from "@/components/features/CookieLeaderboard";
import { useState } from "react";
import { Card } from "@/components/ui/Card";

export function LeaderboardLayout() {
    const [activeTab, setActiveTab] = useState<"points" | "cookies">("points");

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-black text-white drop-shadow-lg">
                    MomCoin Hall of Fame 🏆
                </h1>
                <p className="text-xl text-pink-200">
                    See who is winning the Mom Movement.
                </p>

                {/* Toggle */}
                <div className="flex justify-center mt-6">
                    <div className="bg-black/40 p-1 rounded-xl flex gap-2 border border-white/10">
                        <button
                            onClick={() => setActiveTab("points")}
                            className={`px-6 py-2 rounded-lg font-bold transition-all ${activeTab === "points"
                                    ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg"
                                    : "text-gray-400 hover:text-white"
                                }`}
                        >
                            Start App Rank 🌟
                        </button>
                        <button
                            onClick={() => setActiveTab("cookies")}
                            className={`px-6 py-2 rounded-lg font-bold transition-all ${activeTab === "cookies"
                                    ? "bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-lg"
                                    : "text-gray-400 hover:text-white"
                                }`}
                        >
                            Cookie Jar Rank 🍪
                        </button>
                    </div>
                </div>
            </div>

            <div className="min-h-[500px]">
                {activeTab === "points" ? (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                        <div className="bg-purple-900/20 p-4 rounded-xl border border-purple-500/30 text-center text-sm text-purple-200">
                            Daily Tasks + Login Streaks = <b>Mom Power Points</b>
                        </div>
                        <Leaderboard />
                    </div>
                ) : (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                        <div className="bg-orange-900/20 p-4 rounded-xl border border-orange-500/30 text-center text-sm text-orange-200">
                            Social Fame (Likes/Recasts) = <b>Cookies</b>. Top 25 Daily get Revealed!
                        </div>
                        <CookieLeaderboard />
                    </div>
                )}
            </div>
        </div>
    );
}
