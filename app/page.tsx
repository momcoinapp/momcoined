"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { motion } from "framer-motion";
import { useUserSession } from "@/components/providers/UserSessionProvider";
import Dashboard from "@/components/dashboard/Dashboard";
import { useEffect, useState } from "react";
import { NFTMintPromo } from "@/components/features/NFTMintPromo";
import MomSwap from "@/components/features/MomSwap";
import { CookieJarSlider } from "@/components/features/CookieJarSlider";
import { MomsJourney } from "@/components/features/MomsJourney";
import { TokenomicsTeaser } from "@/components/features/TokenomicsTeaser";

export default function Home() {
  const { address, isConnected, status } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
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
        <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] rounded-full bg-yellow-500/10 blur-[100px]" />
      </div>

      {/* Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-black shadow-lg shadow-pink-500/20 text-xl border-2 border-white/20">
              M
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600 hidden sm:block">
              MomCoin
            </span>
          </div>

          <div className="flex items-center gap-4">
            {isConnected && (
              <div className="hidden md:flex items-center gap-4 text-sm font-medium text-gray-300 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                <span className="text-pink-400 font-bold">{userData?.momBalance?.toLocaleString() ?? 0} $MOM</span>
                <span className="w-px h-4 bg-white/10" />
                <span className="text-purple-400">{userData?.leaderboardScore?.toLocaleString() ?? 0} Cookies</span>
              </div>
            )}
            <Button
              onClick={isConnected ? () => disconnect() : handleLogin}
              variant={isConnected ? "outline" : "primary"}
              className={isConnected
                ? "border-pink-500/50 text-pink-500 hover:bg-pink-500/10 rounded-full"
                : "bg-gradient-to-r from-pink-600 to-purple-600 hover:scale-105 shadow-lg shadow-pink-600/20 border-none rounded-full font-bold px-6"}
            >
              {isConnected ? "Disconnect" : "Connect Wallet"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center min-h-screen pb-20">

        {isConnected && userData ? (
          <div className="w-full max-w-7xl px-4 pt-8">
            <Dashboard />
          </div>
        ) : (
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
                    Join the movement. Mint cookies, earn crypto, and make Mom proud again.
                    <span className="block mt-2 text-pink-400/80 text-base">Wait... is that a cookie jar? 👇</span>
                  </p>
                </motion.div>

                <motion.div
                  className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  <Button size="lg" onClick={handleLogin} className="w-full sm:w-auto text-xl px-10 py-8 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 hover:scale-105 transition-all shadow-xl shadow-pink-600/30 border-none font-bold">
                    Start Minting 🍪
                  </Button>
                  <Button size="lg" variant="outline" onClick={handleInvite} className="w-full sm:w-auto text-xl px-10 py-8 rounded-2xl border-white/20 hover:bg-white/10 backdrop-blur-sm">
                    Invite Mom 💌
                  </Button>
                </motion.div>

                <div className="flex items-center justify-center lg:justify-start gap-6 text-sm text-gray-400 font-mono pt-4">
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Live on Base</div>
                  <div>•</div>
                  <div>12,403 Moms Joined</div>
                </div>
              </div>

              {/* Right Column: Visual Interaction */}
              <motion.div
                className="flex-1 w-full max-w-md perspective-1000"
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ type: "spring", duration: 1.5 }}
              >
                {/* Replaced Static Image with Interactive Slider */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-600 to-purple-600 rounded-[2.5rem] blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                  <CookieJarSlider />

                  {/* Floating Emojis */}
                  <motion.div animate={{ y: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute -top-6 -right-6 text-6xl drop-shadow-lg">✨</motion.div>
                  <motion.div animate={{ y: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 5, delay: 1 }} className="absolute -bottom-8 -left-8 text-6xl drop-shadow-lg">🟣</motion.div>
                </div>
              </motion.div>

            </section>

            {/* FEATURES / SOCIAL PROOF SNAPSHOT */}
            <section className="w-full max-w-6xl px-4 py-16 border-t border-white/5">
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { title: "Mint & Earn", icon: "🍪", desc: "Fill jars to unlock rarity tiers and $MOM airdrops." },
                  { title: "Viral Referrals", icon: "💌", desc: "Invite family for bonus multipliers. Mom gets perks too!" },
                  { title: "Mom AI Agent", icon: "🤖", desc: "Your personal crypto guide. Warning: She judges your trades." }
                ].map((feature, i) => (
                  <Card key={i} className="p-8 bg-white/5 border-white/10 hover:bg-white/10 transition-colors backdrop-blur-sm rounded-3xl group cursor-default relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 font-black text-9xl group-hover:scale-110 transition-transform select-none">{feature.icon}</div>
                    <div className="relative z-10">
                      <div className="text-4xl mb-4">{feature.icon}</div>
                      <h3 className="text-2xl font-bold text-white mb-2">{feature.title}</h3>
                      <p className="text-gray-400 leading-relaxed font-medium">{feature.desc}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {/* Moms Journey Timeline */}
            <div className="w-full bg-black/40 backdrop-blur-3xl -mx-4 py-16 mt-20 border-y border-white/5">
              <MomsJourney />
            </div>

            {/* Tokenomics */}
            <TokenomicsTeaser />

          </div>
        )}
      </main>
    </div>
  );
}

