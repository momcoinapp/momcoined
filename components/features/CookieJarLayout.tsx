"use client";

import { NFTMintPromo } from "@/components/features/NFTMintPromo";
import Leaderboard from "@/components/features/Leaderboard";
import { motion } from "framer-motion";
import { ArrowLeft, Cookie, Zap, Sparkles } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";

export function CookieJarLayout() {
    return (
        <div className="min-h-screen bg-black text-white p-4 md:p-8 flex flex-col items-center relative overflow-hidden">

            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-900/20 rounded-full blur-[100px]" />
                <div className="absolute inset-0 opacity-10 mix-blend-overlay">
                    <img src="/mom-visual-1.jpg" alt="Background" className="w-full h-full object-cover" />
                </div>
            </div>

            <div className="max-w-4xl w-full relative z-10 space-y-12">
                {/* Back Link */}
                <Link href="/" className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Link>

                {/* Hero Section */}
                <div className="text-center space-y-4">
                    <h1 className="text-5xl md:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 drop-shadow-lg">
                        Base Momz & Kidz
                    </h1>
                    <p className="text-xl text-pink-200 font-medium">
                        The OG Collection. Dynamic. Evolving. Delicious. 🍪
                    </p>
                </div>

                {/* How It Works Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                    <Card className="p-6 bg-white/5 border-white/10 text-center space-y-3 hover:bg-white/10 transition-colors">
                        <div className="w-12 h-12 mx-auto bg-pink-500/20 rounded-full flex items-center justify-center text-2xl">🏺</div>
                        <h3 className="font-bold text-lg text-pink-400">1. Mint a Jar</h3>
                        <p className="text-sm text-gray-400">
                            Get a "Sealed Cookie Jar" for just ~$1 (ETH). It contains a hidden Mom or Kid.
                        </p>
                    </Card>
                    <Card className="p-6 bg-white/5 border-white/10 text-center space-y-3 hover:bg-white/10 transition-colors">
                        <div className="w-12 h-12 mx-auto bg-yellow-500/20 rounded-full flex items-center justify-center text-2xl">🍪</div>
                        <h3 className="font-bold text-lg text-yellow-400">2. Fill the Jar</h3>
                        <p className="text-sm text-gray-400">
                            Earn <strong>Cookies</strong> by doing social tasks (Referrals, Posts) OR pay $5 to instant fill.
                        </p>
                    </Card>
                    <Card className="p-6 bg-white/5 border-white/10 text-center space-y-3 hover:bg-white/10 transition-colors">
                        <div className="w-12 h-12 mx-auto bg-purple-500/20 rounded-full flex items-center justify-center text-2xl">✨</div>
                        <h3 className="font-bold text-lg text-purple-400">3. Reveal Mom</h3>
                        <p className="text-sm text-gray-400">
                            Once full, the jar opens to reveal your unique, AI-generated 3D Mom or Kid.
                        </p>
                    </Card>
                </div>

                {/* Main Mint Area */}
                <div className="grid md:grid-cols-2 gap-8 items-start">
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-yellow-400" />
                            Mint Your Jar
                        </h2>
                        <NFTMintPromo />

                        <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl text-sm text-blue-200">
                            <strong>💡 Pro Tip:</strong> Whales (50k+ MOM) get 20% off minting fees.
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Zap className="w-6 h-6 text-orange-400" />
                            Top Cookie Collectors
                        </h2>
                        <Leaderboard />
                    </div>
                </div>

                {/* FAQ / Lore */}
                <div className="prose prose-invert max-w-none bg-white/5 p-8 rounded-3xl border border-white/10">
                    <h3>Why "Dynamic" Metadata?</h3>
                    <p>
                        Unlike boring static NFTs, Momz evolve. Your metadata (image, stats, quotes) is generated
                        <strong>on-demand</strong> when you reveal. This means we can update the collection with new "Seasons"
                        of traits without deploying a new contract.
                    </p>
                    <h3>What are "Cookies"?</h3>
                    <p>
                        Cookies are off-chain points you earn by being a good community member.
                        Refer friends, share on Farcaster, and engage with MomAI to earn them.
                        <strong>500 Cookies = 1 Free Reveal.</strong>
                    </p>
                </div>
            </div>
        </div>
    );
}
