import SocialTasks from "@/components/features/SocialTasks";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "MomCoin Social Tasks 📋",
    description: "Complete tasks, earn Points, and climb the leaderboard!",
};

export default function TasksPage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600 mb-4">
                    Daily Chores (Tasks) 📋
                </h1>
                <p className="text-gray-300 text-lg">
                    "Mom says: Do your chores and get rewarded!"
                </p>
            </div>
            <SocialTasks />
        </div>
    );
}
