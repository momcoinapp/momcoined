"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Users, Share2, Copy, Check, Loader2 } from "lucide-react";
import { useUserSession } from "@/components/providers/UserSessionProvider";
import { toast } from "react-hot-toast";
import { InviteMom } from "./InviteMom";

export default function ReferralDashboard() {
    const { userData, userAddress } = useUserSession();
    const [referralCode, setReferralCode] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<"general" | "mom">("general");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (userData?.referralCode) {
            setReferralCode(userData.referralCode);
        } else if (userAddress && !loading && !referralCode) {
            generateCode();
        }
    }, [userData, userAddress]);

    const generateCode = async () => {
        if (!userAddress) return;
        setLoading(true);
        try {
            const res = await fetch("/api/referral/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ walletAddress: userAddress })
            });
            const data = await res.json();
            if (data.code) setReferralCode(data.code);
        } catch (error) {
            console.error("Failed to generate code", error);
        } finally {
            setLoading(false);
        }
    };

    const inviteLink = typeof window !== "undefined" && referralCode
        ? `${window.location.origin}?ref=${referralCode}`
        : "";

    const handleCopy = () => {
        if (!inviteLink) return;
        navigator.clipboard.writeText(inviteLink);
        setCopied(true);
        toast.success("Link copied!");
        setTimeout(() => setCopied(false), 2000);
    };

    if (!userAddress) {
        return (
            <Card className="p-6 text-center text-purple-200">
                <p>Connect wallet to start referring friends!</p>
            </Card>
        );
    }

    if (loading && !referralCode) {
        return (
            <Card className="p-6 flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
            </Card>
        );
    }

    return (
        <Card className="p-0 overflow-hidden">
            <div className="flex border-b border-white/10">
                <button
                    onClick={() => setActiveTab("general")}
                    className={`flex-1 p-4 text-sm font-bold transition-colors ${activeTab === "general"
                            ? "bg-purple-500/20 text-white border-b-2 border-purple-500"
                            : "text-purple-300 hover:bg-white/5"
                        }`}
                >
                    Invite Friends
                </button>
                <button
                    onClick={() => setActiveTab("mom")}
                    className={`flex-1 p-4 text-sm font-bold transition-colors ${activeTab === "mom"
                            ? "bg-pink-500/20 text-white border-b-2 border-pink-500"
                            : "text-purple-300 hover:bg-white/5"
                        }`}
                >
                    Invite Mom
                </button>
            </div>

            <div className="p-6">
                {activeTab === "mom" ? (
                    <InviteMom referralCode={referralCode!} />
                ) : (
                    <div className="space-y-6">
                        <div className="text-center space-y-2">
                            <div className="inline-block p-3 bg-purple-500/20 rounded-full mb-2">
                                <Users className="w-8 h-8 text-purple-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Invite Friends</h3>
                            <p className="text-purple-200 text-sm">
                                Earn 500 Points for every friend who joins MomCoin.
                            </p>
                        </div>

                        <div className="bg-black/20 p-4 rounded-xl flex items-center gap-3 border border-white/10">
                            <div className="flex-1 font-mono text-sm text-purple-200 truncate">
                                {inviteLink}
                            </div>
                            <button
                                onClick={handleCopy}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5 text-white" />}
                            </button>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => window.open(`https://twitter.com/intent/tweet?text=Join%20me%20on%20MomCoin!%20${encodeURIComponent(inviteLink)}`, "_blank")}
                                className="flex-1 py-3 bg-[#1DA1F2] hover:bg-[#1a91da] text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                            >
                                <Share2 className="w-5 h-5" />
                                Share on X
                            </button>
                        </div>
                    </div>
                )}

                <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 gap-4 text-center">
                    <div>
                        <div className="text-2xl font-bold text-white">{userData?.referralCount || 0}</div>
                        <div className="text-xs text-purple-300 uppercase tracking-wider">Referrals</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-yellow-400">{userData?.referralPoints || 0}</div>
                        <div className="text-xs text-purple-300 uppercase tracking-wider">Points Earned</div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
