"use client";

import { Card } from "@/components/ui/Card";
import { motion } from "framer-motion";
import { Users, ArrowLeft, Copy, Share2, Gift, Trophy, Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { toast } from "react-hot-toast";

import { useState, useEffect } from "react";
import { useUserSession } from "@/components/providers/UserSessionProvider";
import { getOrCreateReferralCode } from "@/lib/referral";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export function ReferralLayout() {
    const { userData } = useUserSession();
    const [referralCode, setReferralCode] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ invites: 0, cookies: 0, momInvited: false });

    useEffect(() => {
        async function fetchData() {
            if (userData?.walletAddress) {
                try {
                    const code = await getOrCreateReferralCode(userData.walletAddress);
                    setReferralCode(code);

                    // Fetch referral stats
                    const userRef = doc(db, "users", userData.walletAddress.toLowerCase());
                    const userSnap = await getDoc(userRef);
                    if (userSnap.exists()) {
                        const data = userSnap.data();
                        setStats({
                            invites: data.referralCount || 0,
                            cookies: data.cookiesFromReferrals || 0,
                            momInvited: data.momInvited || false
                        });
                    }
                } catch (e) {
                    console.error("Failed to get data", e);
                }
            }
            setLoading(false);
        }
        fetchData();
    }, [userData]);

    const referralLink = referralCode
        ? `https://app.momcoined.com?ref=${referralCode}`
        : "Connect Wallet to get link";

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        toast.success("Referral Link Copied!");
    };

    return (
        <div className="min-h-screen bg-black text-white p-4 md:p-8 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[20%] w-[60%] h-[60%] bg-green-900/10 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-xl w-full relative z-10 space-y-6">
                <Link href="/" className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Link>

                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center gap-3">
                        <Users className="w-8 h-8 text-green-400" />
                        Invite the Family
                    </h1>
                    <p className="text-gray-400">
                        Earn 🍪 Cookies for every friend you invite!
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-3">
                    <Card className="p-4 bg-white/5 border-green-500/20 text-center">
                        <div className="text-3xl font-bold text-green-400">{stats.invites}</div>
                        <div className="text-xs text-gray-400">Invites</div>
                    </Card>
                    <Card className="p-4 bg-white/5 border-pink-500/20 text-center">
                        <div className="text-3xl font-bold text-pink-400">{stats.cookies}</div>
                        <div className="text-xs text-gray-400">🍪 Earned</div>
                    </Card>
                    <Card className={`p-4 ${stats.momInvited ? 'bg-pink-500/20 border-pink-500/40' : 'bg-white/5 border-white/10'} text-center`}>
                        <div className="text-2xl">{stats.momInvited ? '✅' : '❌'}</div>
                        <div className="text-xs text-gray-400">Mom Joined</div>
                    </Card>
                </div>

                {/* Rewards Info */}
                <Card className="p-4 bg-gradient-to-r from-green-900/30 to-pink-900/30 border-white/10 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                        <Gift className="w-4 h-4 text-green-400" />
                        <span><strong>1,000 🍪</strong> per friend invited</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-pink-300">
                        <Heart className="w-4 h-4 text-pink-400" />
                        <span><strong>5,000 🍪 BONUS</strong> if you invite YOUR ACTUAL MOM! (one-time)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-yellow-300">
                        <Trophy className="w-4 h-4 text-yellow-400" />
                        <span>Cookies = Leaderboard rank + exclusive bonuses + MomCoin claims</span>
                    </div>
                </Card>

                {/* Code & Share */}
                <Card className="p-6 bg-white/5 border-green-500/30 text-center space-y-4">
                    <div>
                        <p className="text-sm text-gray-400 mb-2">Your Referral Code</p>
                        <div className="bg-black/50 p-3 rounded-xl border border-white/10 font-mono text-2xl text-green-400">
                            {referralCode || "..."}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 justify-center">
                        <Button onClick={handleCopy} className="bg-green-600 hover:bg-green-500 text-white">
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Link
                        </Button>
                        <Button
                            variant="outline"
                            className="border-blue-500/50 text-blue-400 hover:bg-blue-950/30"
                            onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Join me on MomCoin! 🍪\n\nUse my code: ${referralCode}\n${referralLink}\n\n@momcoined #Base #Crypto`)}`, '_blank')}
                        >
                            Share on X
                        </Button>
                        <Button
                            className="bg-purple-600 hover:bg-purple-500 text-white"
                            onClick={() => window.open(`https://warpcast.com/~/compose?text=${encodeURIComponent(`Join me on MomCoin! 🍪\n\nUse my code: ${referralCode}\n${referralLink}`)}&embeds[]=${encodeURIComponent(referralLink)}`, '_blank')}
                        >
                            Cast
                        </Button>
                    </div>
                </Card>

                <div className="text-center text-xs text-gray-500">
                    *Cookies move you up leaderboards, unlock bonuses, and convert to $MomCoin claims!
                </div>
            </div>
        </div>
    );
}
