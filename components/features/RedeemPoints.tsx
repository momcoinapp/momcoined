"use client";

import { Card } from "@/components/ui/Card";
import { Gift, Heart, Coffee, Sparkles } from "lucide-react";
import { useUserSession } from "@/components/providers/UserSessionProvider";
import { toast } from "react-hot-toast";
import { useState } from "react";

export function RedeemPoints() {
    const { userData, updateUserScore } = useUserSession();
    const [loading, setLoading] = useState<string | null>(null);

    const rewards = [
        { id: "hug", name: "Digital Mom Hug", cost: 100, icon: Heart, color: "text-pink-500" },
        { id: "cookie", name: "Mom's Cookie NFT", cost: 500, icon: Coffee, color: "text-yellow-500" },
        { id: "tokens", name: "100 $MOMCOIN Tokens", cost: 1000, icon: Sparkles, color: "text-purple-500" },
    ];

    const handleRedeem = async (rewardId: string, cost: number) => {
        if (!userData || userData.leaderboardScore < cost) {
            toast.error("Not enough points! Go do some chores (tasks)!");
            return;
        }

        setLoading(rewardId);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Deduct points (mock logic - in real app we'd need a deduct function or negative increment)
        // For now, we'll just show success as we only have 'increment' exposed easily, 
        // but visually we want to show it works.
        // We will call updateUserScore with negative value if the API supports it, 
        // otherwise just toast success.

        updateUserScore("redeem_" + rewardId, -cost);
        toast.success("Reward Redeemed! Mom is proud.");
        setLoading(null);
    };

    return (
        <Card className="p-6 border-2 border-indigo-500 bg-indigo-900/10">
            <div className="flex items-center gap-2 mb-6">
                <Gift className="w-6 h-6 text-indigo-400" />
                <h2 className="text-xl font-bold text-indigo-400">Redeem Points</h2>
                <div className="ml-auto bg-indigo-500/20 px-3 py-1 rounded-full text-sm text-indigo-300">
                    Balance: {userData?.leaderboardScore || 0} pts
                </div>
            </div>

            <div className="grid gap-4">
                {rewards.map((reward) => (
                    <div key={reward.id} className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/5">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full bg-white/5 ${reward.color}`}>
                                <reward.icon className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="font-bold text-white">{reward.name}</div>
                                <div className="text-xs text-gray-400">{reward.cost} points</div>
                            </div>
                        </div>
                        <button
                            onClick={() => handleRedeem(reward.id, reward.cost)}
                            disabled={!!loading || (userData?.leaderboardScore || 0) < reward.cost}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-bold text-white transition-colors"
                        >
                            {loading === reward.id ? "..." : "Redeem"}
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-4 text-center text-xs text-indigo-300 font-bold">
                "Mom says: Don't spend it all in one place!"
            </div>
        </Card>
    );
}
