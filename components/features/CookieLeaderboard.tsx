"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card } from "@/components/ui/Card";
import { Trophy, Medal, Cookie, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface CookieJar {
    tokenId: string;
    ownerAddress: string;
    cookieScore: number; // All Time
    dailyCookieScore: number; // Daily
    tier: number;
}

export function CookieLeaderboard() {
    const [jars, setJars] = useState<CookieJar[]>([]);
    const [loading, setLoading] = useState(true);
    const [timeframe, setTimeframe] = useState<"daily" | "allTime">("daily");

    useEffect(() => {
        const fetchLeaderboard = async () => {
            setLoading(true);
            try {
                // In production, this would query the 'jars' collection
                // For MVP/Demo, we might mock or use a placeholder if collection is empty
                const sortField = timeframe === "daily" ? "dailyCookieScore" : "cookieScore";

                // Mock Data for Demo if DB is empty
                const mockData: CookieJar[] = [
                    { tokenId: "1", ownerAddress: "0x123...456", cookieScore: 1500, dailyCookieScore: 120, tier: 1 },
                    { tokenId: "42", ownerAddress: "0xabc...def", cookieScore: 1200, dailyCookieScore: 80, tier: 2 },
                    { tokenId: "7", ownerAddress: "0x999...888", cookieScore: 900, dailyCookieScore: 200, tier: 1 },
                ].sort((a, b) => (timeframe === "daily" ? b.dailyCookieScore - a.dailyCookieScore : b.cookieScore - a.cookieScore));

                setJars(mockData);

                // Real Query (commented out until backend populates it)
                /*
                const q = query(
                    collection(db, "jars"),
                    orderBy(sortField, "desc"),
                    limit(10)
                );
                const snapshot = await getDocs(q);
                const data: CookieJar[] = [];
                snapshot.forEach(doc => data.push(doc.data() as CookieJar));
                setJars(data);
                */

            } catch (error) {
                console.error("Error fetching cookie leaderboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, [timeframe]);

    const formatAddress = (address: string) => {
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };

    return (
        <Card className="p-6 w-full bg-white/5 border-white/10">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Cookie className="w-6 h-6 text-pink-500" />
                    <h2 className="text-xl font-bold text-white">Top Jars</h2>
                </div>

                <div className="flex bg-black/40 rounded-lg p-1">
                    <button
                        onClick={() => setTimeframe("daily")}
                        className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${timeframe === "daily" ? "bg-pink-600 text-white" : "text-gray-400 hover:text-white"
                            }`}
                    >
                        Daily
                    </button>
                    <button
                        onClick={() => setTimeframe("allTime")}
                        className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${timeframe === "allTime" ? "bg-pink-600 text-white" : "text-gray-400 hover:text-white"
                            }`}
                    >
                        All Time
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-12 bg-white/5 rounded-lg animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="space-y-3">
                    {jars.map((jar, index) => (
                        <div
                            key={jar.tokenId}
                            className={`flex items-center justify-between p-3 rounded-xl border ${index === 0 ? "bg-yellow-500/10 border-yellow-500/30" : "bg-white/5 border-white/5"
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-6 h-6 flex items-center justify-center rounded-full font-bold text-sm ${index === 0 ? "text-yellow-500" : "text-gray-500"
                                    }`}>
                                    {index + 1}
                                </div>
                                <div>
                                    <div className="font-bold text-sm text-white">
                                        Jar #{jar.tokenId}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {formatAddress(jar.ownerAddress)}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-pink-400">
                                    {timeframe === "daily" ? jar.dailyCookieScore : jar.cookieScore} 🍪
                                </div>
                                <div className="text-[10px] text-gray-500 uppercase">
                                    {timeframe}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-4 pt-4 border-t border-white/10 text-center">
                <p className="text-xs text-gray-400">
                    Top 25 Jars (Daily) get Revealed! 🔓
                </p>
            </div>
        </Card>
    );
}
