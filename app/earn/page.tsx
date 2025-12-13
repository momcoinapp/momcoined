import SocialTasks from "@/components/features/SocialTasks";
import { DailyClaim } from "@/components/features/DailyClaim";
import { Metadata } from "next";
import { Coins, Sparkles } from "lucide-react";

export const metadata: Metadata = {
    title: "Earn MomCoin | Tasks & Rewards",
    description: "Complete daily social tasks and earn MomCoin + Cookies!",
};

export default function EarnPage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
            <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 px-4 py-2 rounded-full mb-2">
                    <Coins className="w-5 h-5 text-yellow-500" />
                    <span className="text-yellow-200 font-bold text-sm uppercase tracking-wider">Daily Rewards</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white drop-shadow-xl">
                    Earn $MomCoin
                </h1>
                <p className="text-xl text-purple-200 max-w-2xl mx-auto">
                    Mom pays you to do your chores. Complete social tasks, refer friends, and climb the leaderboard.
                </p>
            </div>

            <DailyClaim />
            <SocialTasks />
        </div>
    );
}
