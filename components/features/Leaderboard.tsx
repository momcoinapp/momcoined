"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card } from "@/components/ui/Card";
import { Trophy, Medal } from "lucide-react";

interface LeaderboardUser {
    walletAddress: string;
    leaderboardScore: number;
    momBalance: number;
}

export default function Leaderboard() {
    const [users, setUsers] = useState<LeaderboardUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const q = query(
                    collection(db, "users"),
                    orderBy("leaderboardScore", "desc"),
                    limit(10)
                );
                const querySnapshot = await getDocs(q);
                const leaderboardData: LeaderboardUser[] = [];
                querySnapshot.forEach((doc) => {
                    leaderboardData.push(doc.data() as LeaderboardUser);
                });
                setUsers(leaderboardData);
            } catch (error) {
                console.error("Error fetching leaderboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    const formatAddress = (address: string) => {
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };

    return (
        <Card className="p-6 w-full max-w-2xl mx-auto bg-white/10 backdrop-blur-md border-white/20">
            <div className="flex items-center gap-3 mb-6">
                <Trophy className="w-8 h-8 text-yellow-500" />
                <h2 className="text-2xl font-bold text-white">Top Moms</h2>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-12 bg-white/5 rounded-lg animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="space-y-3">
                    {users.map((user, index) => (
                        <div
                            key={user.walletAddress}
                            className={`flex items-center justify-between p-4 rounded-xl transition-all hover:bg-white/5 ${index === 0 ? "bg-yellow-500/20 border border-yellow-500/50" :
                                    index === 1 ? "bg-gray-400/20 border border-gray-400/50" :
                                        index === 2 ? "bg-orange-500/20 border border-orange-500/50" :
                                            "bg-white/5 border border-white/10"
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${index === 0 ? "text-yellow-500" :
                                        index === 1 ? "text-gray-400" :
                                            index === 2 ? "text-orange-500" :
                                                "text-gray-500"
                                    }`}>
                                    {index < 3 ? <Medal className="w-6 h-6" /> : `#${index + 1}`}
                                </div>
                                <div>
                                    <div className="font-mono font-bold text-white">
                                        {formatAddress(user.walletAddress)}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        {user.momBalance.toLocaleString()} $MOM
                                    </div>
                                </div>
                            </div>
                            <div className="text-xl font-bold text-pink-500">
                                {user.leaderboardScore.toLocaleString()} PTS
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
}
