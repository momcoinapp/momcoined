"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { motion } from "framer-motion";
import { useUserSession } from "@/components/providers/UserSessionProvider";
import { useEffect, useState } from "react";
import { CookieJarSlider } from "@/components/features/CookieJarSlider";
import { MomsJourney } from "@/components/features/MomsJourney";
import { MomStory } from "@/components/features/MomStory";
import { XVideoEmbed } from "@/components/ui/XVideoEmbed";
import { DailyClaim } from "@/components/features/DailyClaim";
import { ArrowRight, Gift, Sparkles } from "lucide-react";

export default function Home() {
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { userData } = useUserSession();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogin = () => {
    const coinbaseConnector = connectors.find((c) => c.id === "coinbaseWalletSDK") || connectors[0];
    if (coinbaseConnector) {
      connect({ connector: coinbaseConnector });
    }
  };

  const handleInvite = () => {
    const link = `${window.location.origin}?ref=${userData?.referralCode || "MOM"}`;
    navigator.clipboard.writeText(link);
    alert("Invite link copied! Share it with Mom!");
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen flex flex-col bg-black text-white overflow-hidden relative selection:bg-pink-500 selection:text-white">
      {/* Background Gradients & Particles */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-pink-600/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[120px]" />
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center min-h-screen pb-20">

        <div className="w-full flex-1 flex flex-col items-center">

          {/* HERO SECTION */}
          <section className="w-full max-w-6xl px-4 pt-12 md:pt-20 pb-16 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Left Column: Text & CTA */}
            <div className="flex-1 text-center lg:text-left space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[1.1] mb-6 drop-shadow-sm">
                  MomCoin: The Meme That <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-yellow-400 animate-gradient-x">
                    Trades Like a Boss 🚀
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
                  Join the movement. Mint cookies, send cards, and make Mom proud again.
                </p>
              </motion.div>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                {isConnected ? (
                  <Button size="lg" onClick={() => window.location.href = '/earn'} className="w-full sm:w-auto text-xl px-10 py-8 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-105 transition-all shadow-xl font-bold">
                    Go to Dashboard 🚀
                  </Button>
                ) : (
                  <Button size="lg" onClick={handleLogin} className="w-full sm:w-auto text-xl px-10 py-8 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 hover:scale-105 transition-all shadow-xl font-bold">
                    Start Minting 🍪
                  </Button>
                )}
                <Button size="lg" variant="outline" onClick={handleInvite} className="w-full sm:w-auto text-xl px-10 py-8 rounded-2xl border-white/20 hover:bg-white/10 backdrop-blur-sm flex flex-col items-center justify-center gap-1">
                  <span>Invite Crypto Fam 🚀</span>
                  <span className="text-xs font-normal text-pink-300 opacity-90">(Bonus for Moms)</span>
                </Button>
              </motion.div>
            </div>

            {/* Right Column: Hero Image (No Slider) */}
            <motion.div
              className="flex-1 w-full max-w-md"
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ type: "spring", duration: 1.5 }}
            >
              <div className="relative group perspective-1000">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-600 to-purple-600 rounded-[2.5rem] blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                <img
                  src="/hero.png"
                  alt="MomCoin App"
                  className="relative z-10 w-full rounded-[2.5rem] shadow-2xl border-4 border-white/10 transform transition-transform group-hover:rotate-y-12 bg-black/50"
                />
                {/* Floating Emojis */}
                <motion.div animate={{ y: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute -top-6 -right-6 text-6xl drop-shadow-lg">✨</motion.div>
                <motion.div animate={{ y: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 5, delay: 1 }} className="absolute -bottom-8 -left-8 text-6xl drop-shadow-lg">🟣</motion.div>
              </div>
            </motion.div>
          </section>

          {/* ACTIVE DROPS SECTION (Christmas + Cookie Jar) */}
          <section className="w-full max-w-6xl px-4 pb-16 grid md:grid-cols-2 gap-8">

            {/* 1. Christmas Cards (Featured) */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-900 to-green-900 border border-white/20 shadow-2xl p-8 flex flex-col items-center text-center group">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/snow.png')] opacity-20"></div>
              <div className="relative z-10 space-y-4">
                <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wide">
                  ⚠️ Limited Time Holiday Event
                </div>
                <h2 className="text-3xl font-black text-white">Free Christmas Cards 🎄</h2>
                <p className="text-gray-200">
                  Mint a blockchain card for Mom. We pay gas. She gets 100 MOM.
                </p>
                <img src="/cards/cryptmas-card.png" className="w-48 mx-auto -rotate-3 group-hover:rotate-3 transition-transform duration-500" />
                <Button
                  onClick={() => window.location.href = '/christmas'}
                  className="w-full bg-white text-red-900 font-bold py-4 rounded-xl hover:scale-105 transition-all"
                >
                  Send Card Now <ArrowRight className="ml-2 w-4 h-4 inline" />
                </Button>
              </div>
            </div>

            {/* 2. Mom's Cookie Jar */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-900 to-purple-900 border border-white/20 shadow-2xl p-8 flex flex-col items-center text-center group">
              <div className="relative z-10 space-y-4">
                <div className="inline-block px-3 py-1 bg-pink-500/20 rounded-full text-xs font-bold uppercase tracking-wide text-pink-300">
                  🔥 Minting Live
                </div>
                <h2 className="text-3xl font-black text-white">Mom's Cookie Jar 🍪</h2>
                <p className="text-gray-200">
                  The legendary NFT that gives you daily sweet rewards and perks.
                </p>
                <div className="text-6xl py-4">🍯</div>
                <Button
                  onClick={() => window.location.href = '/ear'}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-4 rounded-xl hover:scale-105 transition-all"
                >
                  Mint Cookie Jar <Sparkles className="ml-2 w-4 h-4 inline" />
                </Button>
              </div>
            </div>

          </section>

          {/* DAILY CLAIM TEASER */}
          <section className="w-full max-w-md mx-auto px-4 pb-16">
            <DailyClaim />
          </section>

          {/* Mom & Son Holiday Message (X Embed) */}
          <section className="w-full max-w-lg mx-auto pb-12">
            <XVideoEmbed />
          </section>

          {/* Mom Story */}
          <MomStory />

          {/* Timeline */}
          <div className="w-full bg-black/40 backdrop-blur-3xl -mx-4 py-16 mt-20 border-y border-white/5">
            <MomsJourney />
          </div>

        </div>
      </main>
    </div>
  );
}

