"use client";

import { useUserSession } from "@/components/providers/UserSessionProvider";
import { NFTMintPromo } from "@/components/features/NFTMintPromo";
import { CookieLeaderboard } from "@/components/features/CookieLeaderboard";
import { Card } from "@/components/ui/Card";
import { motion } from "framer-motion";
import { Sparkles, Cookie } from "lucide-react";

export default function NFTPage() {
    const { userData } = useUserSession();

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4">
            <div className="container mx-auto max-w-6xl space-y-12">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-4"
                >
                    <h1 className="text-4xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
                        Mom's Collection
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Mint Jars, Collect Cookies, and Reveal the Truth.
                    </p>
                </motion.div>

                {/* Active Mint */}
                <div className="max-w-4xl mx-auto">
                    <NFTMintPromo />
                </div>

                {/* Dual Columns: Your Collection & Leaderboard */}
                <div className="grid md:grid-cols-3 gap-8">

                    {/* Your Collection (Placeholder for now) */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="flex items-center gap-3">
                            <Cookie className="w-6 h-6 text-pink-500" />
                            <h2 className="text-2xl font-bold">Your Jars</h2>
                        </div>

                        {userData?.walletAddress ? (
                            <Card className="p-8 border-dashed border-2 border-white/10 bg-white/5 flex flex-col items-center justify-center text-center min-h-[300px]">
                                <p className="text-gray-400 mb-4">You haven't minted any Jars yet!</p>
                                <p className="text-sm text-gray-500">Mint a Jar above to start collecting Cookies.</p>
                            </Card>
                        ) : (
                            <Card className="p-8 bg-white/5 flex items-center justify-center min-h-[200px]">
                                <p className="text-gray-400">Connect Wallet to view your collection.</p>
                            </Card>
                        )}
                    </div>

                    {/* Cookie Leaderboard */}
                    <div className="md:col-span-1">
                        <CookieLeaderboard />
                    </div>

                </div>

                {/* Future Mints Teaser */}
                <div className="pt-12 border-t border-white/10">
                    <h3 className="text-xl font-bold text-center mb-8 text-gray-500 uppercase tracking-widest">Coming Soon</h3>
                    <div className="grid md:grid-cols-3 gap-6 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {['Mom Gen 2', 'Grandma Edition', 'Pet Moms'].map((item, i) => (
                            <Card key={i} className="p-6 bg-white/5 border-white/5">
                                <div className="aspect-square bg-white/5 rounded-lg mb-4 flex items-center justify-center">
                                    <span className="text-4xl">🔒</span>
                                </div>
                                <h4 className="font-bold text-center">{item}</h4>
                            </Card>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
