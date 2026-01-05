// @ts-nocheck
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Twitter, MessageCircle, CheckCircle, ExternalLink, Send, Quote, TrendingUp, Wallet, Mail, Sparkles, Users } from "lucide-react";
import { toast } from "react-hot-toast";
import { doc, updateDoc, increment, arrayUnion } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useUserSession } from "@/components/providers/UserSessionProvider";

const TASKS = [
    {
        id: "daily_post_share",
        platform: "twitter",
        title: "Daily $MOMCOIN Post",
        reward: 100,
        link: "https://twitter.com/intent/tweet?text=I%27m%20earning%20%24MOM%20rewards%20on%20Base!%20%F0%9F%A5%9E%20@momcoined&hashtags=MomCoin,Base",
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
        title: "Follow @momcoined on TikTok",
        reward: 500,
        link: "https://www.tiktok.com/@momcoined",
        icon: ExternalLink,
        color: "text-pink-500"
    },
    {
        id: "share_tiktok",
        platform: "tiktok",
        title: "Share MomCoin on TikTok",
        reward: 1000,
        link: "https://www.tiktok.com/upload",
        icon: ExternalLink,
        color: "text-pink-500",
        repeatable: true
    },
    {
        id: "twitter_follow",
        platform: "twitter" as const,
        title: "Follow @momcoined",
        description: "Follow us on X for updates!",
        reward: 500,
        icon: Twitter,
        actionLabel: "Follow",
        link: "https://twitter.com/momcoined"
    },
    {
        id: "invite_mom",
        platform: "mom" as const,
        title: "Invite Mom",
        description: "Send a Holiday Card or Invite Link!",
        reward: 1000,
        icon: Users,
        actionLabel: "Invite",
        link: "/cards"
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
        title: "Like/Repost Pinned @blokmom",
        reward: 100,
        link: "https://x.com/blokmom",
        icon: Twitter,
        color: "text-pink-400",
        repeatable: true
    },
    {
        id: "engage_twitter_momcoined",
        platform: "twitter",
        title: "Like/Repost Pinned @momcoined",
        reward: 100,
        link: "https://x.com/momcoined",
        icon: Twitter,
        color: "text-pink-400",
        repeatable: true
    },
    {
        id: "engage_farcaster_momcoined",
        platform: "farcaster",
        title: "Like/Recast Pinned on Warpcast",
        reward: 100,
        link: "https://warpcast.com/momcoined",
        icon: MessageCircle,
        color: "text-purple-400",
        repeatable: true
    },
    {
        id: "buy_clanker",
        platform: "clanker",
        title: "Buy on Clanker Presale",
        reward: 1000,
        link: "https://clanker.world/clanker/0x2177bCAC5c26507bfb4F0FF2cCbd255AE4BEDb07",
        icon: Sparkles,
        color: "text-purple-500"
    },
    {
        id: "meme_contest",
        platform: "twitter",
        title: "Post a Meme ($MOMCOIN Contest)",
        reward: 1000,
        link: "https://twitter.com/intent/tweet?text=Check%20out%20my%20%24MOM%20meme!%20%F0%9F%A4%A3%20@momcoined&hashtags=MomCoin,MemeContest",
        icon: Sparkles,
        color: "text-yellow-400",
        repeatable: true
    },
    {
        id: "join_farcaster",
        platform: "farcaster",
        title: "Follow /momcoined on Farcaster",
        reward: 500,
        link: "https://warpcast.com/momcoined",
        icon: MessageCircle,
        color: "text-purple-500"
    },
    {
        id: "add_farcaster_frame",
        platform: "farcaster",
        title: "Add MomCoin to Farcaster",
        reward: 1000,
        link: "https://warpcast.com/~/add-cast-action?url=https://momcoined.com/api/frame",
        icon: Sparkles,
        color: "text-purple-600"
    },
    {
        id: "share_reveal",
        platform: "farcaster",
        title: "Share Your Mom Reveal",
        reward: 1000,
        link: "https://warpcast.com/~/compose?text=I%20just%20minted%20my%20Mom%20on%20Base!%20%F0%9F%A5%9E%20Check%20her%20out!%20@momcoined&embeds[]=https://momcoined.com",
        icon: Sparkles,
        color: "text-pink-500",
        repeatable: true
    }
];

export default function SocialTasks() {
    const { userData } = useUserSession();
    const [verifying, setVerifying] = useState<string | null>(null);

    // Helper to get verification params for each task
    const getVerificationParams = (taskId: string): { type: string, target?: string } | null => {
        switch (taskId) {
            case "engage_farcaster_momcoined":
                return { type: "like", target: "0x..." }; // TODO: Need actual cast hash
            case "join_farcaster":
                return { type: "follow", target: "815259" }; // MomCoin FID (example, need actual)
            case "share_reveal":
            case "daily_post_share": // Assuming this is also a share task
                return { type: "share_url", target: "momcoined.com" };
            default:
                return null;
        }
    };

    const handleTask = async (task: typeof TASKS[0]) => {
        if (!userData?.walletAddress) {
            toast.error("Please connect wallet first");
            return;
        }

        // Open link
        window.open(task.link, "_blank");

        // Check if verifyable via API
        const params = getVerificationParams(task.id);

        // If not verifiable (e.g. twitter), fall back to optimistic 5s timer
        if (!params || task.platform === "twitter" || task.platform === "tiktok") {
            setVerifying(task.id);
            setTimeout(async () => {
                await completeTask(task);
            }, 5000);
            return;
        }

        // Real Verification
        setVerifying(task.id);
        try {
            // Wait a bit for the action to propagate (optional but helpful)
            await new Promise(r => setTimeout(r, 2000));

            // We need user's FID. Assuming it's in userData or we prompt.
            // For now, let's assume userData has fid if they connected Farcaster.
            // If they only connected wallet, we might need to resolve FID from address?
            // Let's assume userData.fid exists implementation details.

            const userFid = userData.fid;
            if (!userFid) {
                toast.error("Please connect Farcaster ID to verify.");
                setVerifying(null);
                return;
            }

            const res = await fetch("/api/social/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userFid: userFid,
                    actionType: params.type,
                    target: params.target
                })
            });

            const data = await res.json();

            if (data.success) {
                await completeTask(task);
            } else {
                toast.error("Verification failed: Action not found.");
            }
        } catch (error) {
            console.error("Verification error:", error);
            toast.error("Error verifying task");
        } finally {
            setVerifying(null);
        }
    };

    const completeTask = async (task: typeof TASKS[0]) => {
        try {
            const userRef = doc(db, "users", userData!.walletAddress);
            if (!task.repeatable && userData?.tasksCompleted?.includes(task.id)) {
                toast.error("Task already completed");
                return;
            }

            await updateDoc(userRef, {
                leaderboardScore: increment(task.reward),
                tasksCompleted: arrayUnion(task.id)
            });
            toast.success(`Task verified! +${task.reward} Points`);
        } catch (error) {
            console.error("Task completion error", error);
        }
    }

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
