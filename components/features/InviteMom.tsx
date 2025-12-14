"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Heart, Mail, Copy, Check } from "lucide-react";
import { toast } from "react-hot-toast";

import { useUserSession } from "@/components/providers/UserSessionProvider";

export function InviteMom() {
    const { userData } = useUserSession();
    const referralCode = userData?.referralCode || "MOM";
    const [copied, setCopied] = useState(false);
    const inviteLink = typeof window !== "undefined"
        ? `${window.location.origin}?ref=${referralCode}`
        : `https://momcoin.app?ref=${referralCode}`;

    const emailSubject = "Mom, you need to see this!";
    const emailBody = `Hi Mom,\n\nI found this app called MomCoin and I think you'd love it. It's a fun way to learn about crypto and earn rewards.\n\nUse my link to join: ${inviteLink}\n\nLove,\nYour Favorite Child`;

    const handleCopy = () => {
        navigator.clipboard.writeText(inviteLink);
        setCopied(true);
        toast.success("Link copied!");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleEmail = () => {
        window.location.href = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    };

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <div className="inline-block p-3 bg-pink-500/20 rounded-full mb-2">
                    <Heart className="w-8 h-8 text-pink-500 fill-pink-500" />
                </div>
                <h3 className="text-xl font-bold text-white">Invite Your Mom</h3>
                <p className="text-purple-200 text-sm">
                    Help Mom get started with crypto! Send her a personal invite and earn 500 Points when she joins.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                    onClick={handleEmail}
                    className="p-4 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl hover:opacity-90 transition-opacity flex flex-col items-center gap-2 text-white font-bold"
                >
                    <Mail className="w-6 h-6" />
                    Send Email
                </button>

                <button
                    onClick={handleCopy}
                    className="p-4 bg-white/10 border border-white/10 rounded-xl hover:bg-white/20 transition-colors flex flex-col items-center gap-2 text-white font-bold"
                >
                    {copied ? <Check className="w-6 h-6 text-green-400" /> : <Copy className="w-6 h-6" />}
                    Copy Link
                </button>
            </div>

            <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/20">
                <h4 className="text-sm font-bold text-purple-200 mb-2">Mom's Checklist:</h4>
                <ul className="text-xs text-purple-300 space-y-1 list-disc list-inside">
                    <li>Click your link</li>
                    <li>Connect a wallet (we'll help her!)</li>
                    <li>Claim her first 10 MOM</li>
                </ul>
            </div>
        </div>
    );
}
