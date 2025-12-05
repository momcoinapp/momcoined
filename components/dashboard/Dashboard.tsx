"use client";

import { useState } from "react";
import { useUserSession } from "@/components/providers/UserSessionProvider";
import { BuyMomWidget } from "@/components/features/BuyMomWidget";
import { MerchStoreTeaser } from "@/components/features/MerchStoreTeaser";
import { SocialFeed } from "@/components/features/SocialFeed";
import MemeMaker from "@/components/features/MemeMaker";
import { CharityJar } from "@/components/features/CharityJar";
import MomSwap from "@/components/features/MomSwap";
import { Wallet, Star, Users, Trophy, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { ClankerStats } from "@/components/features/ClankerStats";
import { TokenStats } from "@/components/features/TokenStats";
import { NFTMintPromo } from "@/components/features/NFTMintPromo";
import MomChat from "@/components/features/MomChat";
import { DailyClaim } from "@/components/features/DailyClaim";
import { MomMarket } from "@/components/features/MomMarket";
import ReferralDashboard from "@/components/features/ReferralDashboard";
import Leaderboard from "@/components/features/Leaderboard";
import { InviteMomModal } from "@/components/features/InviteMomModal";
import SocialTasks from "@/components/features/SocialTasks";
import { RedeemPoints } from "@/components/features/RedeemPoints";

export default function Dashboard() {
    const { userData, isLoading } = useUserSession();
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
            </div>
        );
    }

    const stats = [
        {
            label: "MOM Balance",
            value: userData?.momBalance?.toLocaleString() || "0",
            icon: Wallet,
            color: "text-pink-500",
        },
        {
            label: "Points",
            value: userData?.leaderboardScore?.toLocaleString() || "0",
            icon: Star,
            color: "text-yellow-500",
        },
        {
            label: "Referrals",
            value: userData?.referralCount || "0",
            icon: Users,
            color: "text-purple-500",
        },
        {
            label: "Tasks Done",
            value: (userData?.tasksCompleted?.length || 0).toString(),
            icon: CheckCircle,
            color: "text-green-500",
        },
    ];

    return (
        <div className="space-y-8 relative">
            {/* Welcome Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-2"
            >
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
                    Welcome to MomCoined!
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                    Here is what's cooking in your kitchen today.
                </p>
            </motion.div>

            {/* Video Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="w-full max-w-4xl mx-auto"
            >
                <Card className="overflow-hidden border-2 border-pink-500/30 bg-black/40 backdrop-blur-sm">
                    <div className="relative aspect-video bg-gray-900 flex items-center justify-center group cursor-pointer">
                        <div className="absolute inset-0 bg-[url('/mom-logo-1.jpg')] bg-cover bg-center opacity-50 group-hover:opacity-40 transition-opacity" />
                        <div className="relative z-10 flex flex-col items-center gap-4">
                            <div className="w-20 h-20 bg-pink-600/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-pink-500/50">
                                <svg className="w-10 h-10 text-white ml-2" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-white drop-shadow-lg">Watch Our Story</h3>
                            <p className="text-pink-200 font-medium bg-black/50 px-4 py-1 rounded-full backdrop-blur-md">
                                "Code can be copied. Community can't."
                            </p>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="p-4 flex flex-col items-center justify-center text-center space-y-2 hover:border-pink-500/50 transition-colors">
                            <stat.icon className={`w-8 h-8 ${stat.color}`} />
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <div className="text-sm text-gray-500">{stat.label}</div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Main Action Area */}
            < div className="grid md:grid-cols-3 gap-6" >
                {/* Mom AI Agent */}
                < div className="md:col-span-2" >
                    <MomChat />
                </div >

                {/* Daily Claim */}
                < div className="md:col-span-1" >
                    <DailyClaim />
                </div >

                {/* Social Tasks */}
                < div className="md:col-span-2" >
                    <SocialTasks />
                </div >

                {/* Redeem Points */}
                < div className="md:col-span-1" >
                    <RedeemPoints />
                </div >

                {/* Mom Market Prediction Game */}
                < div className="md:col-span-3" >
                    <MomMarket />
                </div >

                {/* Swap Widget */}
                < div className="md:col-span-3" >
                    <MomSwap />
                </div >

                {/* Buy MOM Widget (Legacy/External) */}
                < div className="md:col-span-3" >
                    <BuyMomWidget />
                </div >


                {/* Charity Jar */}
                < div className="md:col-span-1" >
                    <CharityJar />
                </div >

                {/* Referral Dashboard */}
                < div className="md:col-span-1" >
                    <ReferralDashboard />
                </div >

                {/* Merch Store Teaser */}
                < div className="md:col-span-1" >
                    <MerchStoreTeaser />
                </div >

                {/* Social Feed */}
                < div className="md:col-span-2" >
                    <SocialFeed />
                </div >
            </div >

            {/* Modals */}
            {
                showLeaderboard && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div className="relative w-full max-w-2xl">
                            <button
                                onClick={() => setShowLeaderboard(false)}
                                className="absolute -top-10 right-0 text-white hover:text-pink-500"
                            >
                                Close
                            </button>
                            <Leaderboard />
                        </div>
                    </div>
                )
            }

            <InviteMomModal
                isOpen={showInviteModal}
                onClose={() => setShowInviteModal(false)}
            />
        </div >
    );
}
