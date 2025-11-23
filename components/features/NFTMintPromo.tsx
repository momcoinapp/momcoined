"use client";

import { Card } from "@/components/ui/Card";
import { motion } from "framer-motion";
import { Vote, Sparkles } from "lucide-react";

export function NFTMintPromo() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full"
        >
            <Card className="p-6 bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-purple-500/30 backdrop-blur-md overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-20">
                    <Sparkles className="w-24 h-24 text-pink-500" />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 text-center md:text-left">
                        <h3 className="text-2xl font-bold text-white flex items-center gap-2 justify-center md:justify-start">
                            <Sparkles className="w-6 h-6 text-yellow-400" />
                            OG Mom NFT Collection
                        </h3>
                        <p className="text-purple-200 max-w-md">
                            Mint your OG Mom NFT to unlock exclusive staking rewards and AI features.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <button className="px-6 py-3 bg-white text-purple-900 font-bold rounded-xl hover:bg-purple-100 transition-colors flex items-center gap-2 shadow-lg shadow-purple-500/20">
                            <Vote className="w-5 h-5" />
                            Mint Now
                        </button>
                        {/* Placeholder for OnchainKit Buy Component */}
                        <button className="px-6 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-500 transition-colors flex items-center gap-2 shadow-lg shadow-purple-500/20">
                            <Sparkles className="w-5 h-5" />
                            Buy with Card
                        </button>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
