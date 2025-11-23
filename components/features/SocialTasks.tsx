"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Twitter, MessageCircle, CheckCircle, ExternalLink, Send, Quote, TrendingUp, Wallet, Mail, Sparkles } from "lucide-react";
import { toast } from "react-hot-toast";
import { doc, updateDoc, increment, arrayUnion } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useUserSession } from "@/components/providers/UserSessionProvider";

const TASKS = [
    {
        id: "daily_quote_share",
        platform: "twitter",
        title: "Share Daily Mom Quote",
        reward: 100, // Increased to 100
        link: "https://twitter.com/intent/tweet?text=My%20mom%20told%20me%20to%20buy%20%24MOM%20%F0%9F%92%8E%20@momcoined",
        icon: Quote,
        color: "text-yellow-400",
        repeatable: true
    },
    {
        id: "join_telegram",
        platform: "telegram",
        title: "Join MomCoin Telegram",
        reward: 500,
        link: "https://t.me/momcoined",
        icon: Send,
        color: "text-blue-400"
    },
    {
        id: "trade_flaunch",
        platform: "flaunch",
        title: "Trade on Flaunch.gg",
        reward: 500,
        link: "https://flaunch.gg/base/group/0xaA52a2CF3D6cFD863483aaA3534423f2e1F5c809",
        icon: TrendingUp,
        color: "text-green-400"
    },
    {
        id: "follow_tiktok",
        platform: "tiktok",
        title: "Follow @momcoin on TikTok",
        reward: 500,
        link: "https://www.tiktok.com/@momcoin",
        icon: ExternalLink, // Using ExternalLink as generic icon for TikTok if specific one isn't imported
        color: "text-pink-500"
    },
    {
        id: "share_tiktok",
        platform: "tiktok",
        title: "Share MomCoin on TikTok",
        reward: 1000,
        link: "https://www.tiktok.com/upload", // Direct link to upload
        icon: ExternalLink,
        color: "text-pink-500",
        repeatable: true
    },
    {
        id: "follow_twitter_blokmom",
        platform: "twitter",
        title: "Follow @blokmom on X",
        reward: 500,
        link: "https://x.com/blokmom",
        icon: Twitter,
        color: "text-blue-400"
    },
    {
        id: "follow_twitter_momcoined",
        platform: "twitter",
        title: "Follow @momcoined on X",
        reward: 500,
        link: "https://x.com/momcoined",
        icon: Twitter,
        color: "text-blue-400"
    },
    {
        id: "engage_twitter_blokmom",
        platform: "twitter",
        title: "Like & Repost @blokmom",
        reward: 50,
        link: "https://x.com/blokmom",
        icon: Twitter,
        color: "text-pink-400",
        repeatable: true
    },
    {
        id: "engage_twitter_momcoined",
        platform: "twitter",
        title: "Like & Repost @momcoined",
        reward: 50,
        link: "https://x.com/momcoined",
        icon: Twitter,
        color: "text-pink-400",
        repeatable: true
    },
    {
        id: "connect_wallet",
        platform: "wallet",
        title: "Connect Base Smart Wallet",
        reward: 500,
        link: "#",
        icon: Wallet,
        color: "text-blue-500"
    },
    {
        id: "join_newsletter",
        platform: "email",
        title: "Join Mom's Newsletter",
        reward: 500,
        link: "#",
        icon: Mail,
        color: "text-pink-500"
    },
    {
        id: "meme_contest",
        platform: "twitter",
        title: "Post a Meme ($MOM Contest)",
        reward: 1000,
        link: "https://twitter.com/intent/tweet?text=Check%20out%20my%20%24MOM%20meme!%20%F0%9F%A4%A3%20@momcoined&hashtags=MomCoin,MemeContest",
        icon: Sparkles,
        color: "text-yellow-400",
        repeatable: true
    },
    {
        id: "join_farcaster",
        platform: "farcaster",
        title: "Follow /momcoin on Farcaster",
        reward: 500,
        link: "https://warpcast.com/momcoin",
        icon: MessageCircle,
        color: "text-purple-500"
    }
];

export default function SocialTasks() {
    const { userData } = useUserSession();
    const [verifying, setVerifying] = useState<string | null>(null);

    const handleTask = async (task: typeof TASKS[0]) => {
        if (!userData?.walletAddress) {
            toast.error("Please connect wallet first");
            return;
        }

        // Open link
        window.open(task.link, "_blank");

        // Simulate verification (Optimistic)
        setVerifying(task.id);

        setTimeout(async () => {
            try {
                const userRef = doc(db, "users", userData.walletAddress);

                // Check if already completed (unless repeatable)
                if (!task.repeatable && userData.tasksCompleted?.includes(task.id)) {
                    toast.error("Task already completed");
                    setVerifying(null);
                    return;
                }

                // For repeatable tasks, we might want to check a "lastCompleted" timestamp
                // For now, we'll just allow it (simple implementation) or rely on the "Done" state in UI

                await updateDoc(userRef, {
                    leaderboardScore: increment(task.reward),
                    tasksCompleted: arrayUnion(task.id)
                });
                toast.success(`Task verified! +${task.reward} Points`);
            } catch (error) {
                console.error("Task error:", error);
                toast.error("Verification failed");
            } finally {
                setVerifying(null);
            }
        }, 5000); // 5 second delay
    };

    const isCompleted = (taskId: string) => {
        // If repeatable, maybe check if done TODAY? 
        // For simplicity in this MVP, we'll just show "Done" if in array, 
        // but for "daily_quote_share" we might want to allow it again.
        // Let's assume "repeatable" tasks don't show "Done" permanently.
        const task = TASKS.find(t => t.id === taskId);
        if (task?.repeatable) return false;

        return userData?.tasksCompleted?.includes(taskId);
    };

    return (
        <Card className="p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-pink-500" />
                Social Tasks
            </h3>
            <div className="space-y-3">
                {TASKS.map((task) => (
                    <div
                        key={task.id}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full bg-white/5 ${task.color}`}>
                                <task.icon className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="font-bold">{task.title}</div>
                                <div className="text-xs text-green-400">+{task.reward} PTS</div>
                            </div>
                        </div>

                        {isCompleted(task.id) ? (
                            <div className="flex items-center gap-1 text-green-500 text-sm font-bold">
                                <CheckCircle className="w-4 h-4" />
                                Done
                            </div>
                        ) : (
                            <button
                                onClick={() => handleTask(task)}
                                disabled={!!verifying}
                                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                            >
                                {verifying === task.id ? (
                                    "Verifying..."
                                ) : (
                                    <>
                                        Start <ExternalLink className="w-3 h-3" />
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </Card>
    );
}
