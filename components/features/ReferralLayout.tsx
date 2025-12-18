"use client";

import { Card } from "@/components/ui/Card";
import { motion } from "framer-motion";
import { Users, ArrowLeft, Copy, Share2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { toast } from "react-hot-toast";

import { useState, useEffect } from "react";
import { useUserSession } from "@/components/providers/UserSessionProvider";
import { getOrCreateReferralCode } from "@/lib/referral";

export function ReferralLayout() {
    const { userData } = useUserSession();
    const [referralCode, setReferralCode] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCode() {
            if (userData?.walletAddress) {
                // In a real app, this should be an API call to avoid client-side DB access issues if rules are strict
                // But since we have the lib and it uses Firebase directly (assuming rules allow), we can try:
                try {
                    const code = await getOrCreateReferralCode(userData.walletAddress);
                    setReferralCode(code);
                } catch (e) {
                    console.error("Failed to get code", e);
                }
            }
            setLoading(false);
        }
        fetchCode();
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

            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[20%] w-[60%] h-[60%] bg-green-900/10 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-xl w-full relative z-10 space-y-8">
                {/* Back Link */}
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
                        Earn 10% of every cookie your friends bake.
                    </p>
                </div>

                {/* Code Card */}
                <Card className="p-8 bg-white/5 border-green-500/30 text-center space-y-6">
                    <div>
                        <p className="text-sm text-gray-400 mb-2">Your Unique Referral Link</p>
                        <div className="bg-black/50 p-4 rounded-xl border border-white/10 font-mono text-green-400 break-all">
                            {referralLink}
                        </div>
                    </div>

                    <div className="flex gap-3 justify-center">
                        <Button onClick={handleCopy} className="bg-green-600 hover:bg-green-500 text-white">
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Link
                        </Button>
                        <Button
                            variant="outline"
                            className="border-green-500/50 text-green-400 hover:bg-green-950/30"
                            onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Join me on MomCoin! 🍪\n\nUse my link to get free daily cookies:\n${referralLink}\n\n@momcoin #Base`)}`, '_blank')}
                        >
                            <Share2 className="w-4 h-4 mr-2" />
                            Share on X
                        </Button>
                        <Button
                            className="bg-purple-600 hover:bg-purple-500 text-white border border-purple-400/30"
                            onClick={() => window.open(`https://warpcast.com/~/compose?text=${encodeURIComponent(`Join me on MomCoin! 🍪\n\nUse my link to get free daily cookies:\n${referralLink}`)}&embeds[]=${encodeURIComponent(referralLink)}`, '_blank')}
                        >
                            <Share2 className="w-4 h-4 mr-2" />
                            Cast
                        </Button>
                    </div>
                </Card>

                <div className="text-center text-xs text-gray-500">
                    *Rewards are distributed weekly.
                </div>
            </div>
        </div>
    );
}
