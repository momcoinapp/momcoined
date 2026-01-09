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
    <div className="min-h-screen flex flex-col bg-[#0f1016] text-white overflow-hidden relative selection:bg-pink-500 selection:text-white">
      {/* Background Gradients & Particles - Lightened for "Mom Mode" */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-pink-500/15 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-500/15 blur-[120px]" />
        <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[100px]" />
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
                <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
                  <span className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-purple-300">
                    🍪 Mom-Backed Trust & Positivity
                  </span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[1.1] mb-6 drop-shadow-sm">
                  Baseposting With Mom: <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-yellow-400 animate-gradient-x">
                    The Onchain Movement 🚀
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
                  Real Mom. Real Son. Real Gains. <br />
                  No more dirty rugs — just daily rewards and family fun.
                </p>
              </motion.div>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                <div className="w-full sm:w-auto">
                  {/* Primary CTA: Watch Video / Story */}
                  <Button size="lg" onClick={() => document.getElementById('mom-story-video')?.scrollIntoView({ behavior: 'smooth' })} className="w-full text-xl px-8 py-8 rounded-2xl bg-white text-purple-900 hover:bg-gray-100 transition-all shadow-xl font-bold flex items-center justify-center gap-3">
                    Watch Our Real Story 📺
                  </Button>
                </div>

                {isConnected ? (
                  <Button size="lg" onClick={() => window.location.href = '/earn'} className="w-full sm:w-auto text-xl px-10 py-8 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-105 transition-all shadow-xl font-bold">
                    Go to Dashboard 🚀
                  </Button>
                ) : (
                  <Button size="lg" onClick={handleLogin} className="w-full sm:w-auto text-xl px-10 py-8 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 hover:scale-105 transition-all shadow-xl font-bold">
                    Connect Wallet 🍪
                  </Button>
                )}
              </motion.div>
            </div>

            {/* Right Column: Hero Image / Morphing Jar */}
            <motion.div
              className="flex-1 w-full max-w-md relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", duration: 1.5 }}
            >
              {/* Decorative Blobs Behind */}
              <div className="absolute -inset-10 bg-gradient-to-tr from-pink-500/30 to-purple-500/30 rounded-full blur-3xl animate-pulse" />

              <div className="relative group perspective-1000">
                <img
                  src="/hero.png" // User mentioned keeping optimized for Base, standard placeholder for now
                  alt="MomCoin App"
                  className="relative z-10 w-full rounded-[2.5rem] shadow-2xl border-4 border-white/10 transform transition-transform group-hover:scale-[1.02] bg-black/20"
                />

                {/* Floating Badges */}
                <motion.div animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute -top-4 -right-4 bg-yellow-400 text-black font-black px-4 py-2 rounded-xl shadow-lg border-2 border-white rotate-12 z-20">
                  GET 100 MOM
                </motion.div>
              </div>
            </motion.div>
          </section>

          {/* ACTIVE DROPS SECTION (Cards + Bingo + Jars) */}
          <section className="w-full max-w-7xl px-4 pb-16 grid md:grid-cols-4 gap-6">

            {/* 1. Mom's Cookie Jar (The Yield) */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-600/10 to-purple-600/10 border border-white/10 shadow-2xl hover:shadow-pink-500/10 p-6 flex flex-col items-center text-center group hover:-translate-y-1 transition-all">
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 space-y-4 w-full">
                <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-2xl shadow-lg">🍪</div>
                <h2 className="text-xl font-black text-white">1. Get the Jar</h2>
                <p className="text-gray-300 text-sm">
                  Mint Mom's Legendary Cookie Jar. It's your vault for daily sweet rewards.
                </p>
                <div className="pt-2">
                  <Button
                    onClick={() => window.location.href = '/cookie-jar'}
                    variant="outline"
                    className="w-full border-pink-500/30 hover:bg-pink-500/20 text-white font-bold"
                  >
                    Mint Jar <Sparkles className="ml-2 w-4 h-4 inline" />
                  </Button>
                </div>
              </div>
            </div>

            {/* 2. baseMOMZ (The Reveal) */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600/10 to-indigo-600/10 border border-white/10 shadow-2xl hover:shadow-purple-500/10 p-6 flex flex-col items-center text-center group hover:-translate-y-1 transition-all">
              <div className="relative z-10 space-y-4 w-full">
                <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-2xl shadow-lg">👵</div>
                <h2 className="text-xl font-black text-white">2. Reveal baseMOMZ</h2>
                <p className="text-gray-300 text-sm">
                  Fill your jar to reveal the Gen 1 PFP set: baseMOMZ. Coming soon to loyal holders.
                </p>
                <div className="pt-2">
                  <span className="inline-block px-3 py-1 rounded-full bg-purple-500/20 text-purple-200 text-xs font-bold border border-purple-500/30">
                    Coming Soon
                  </span>
                </div>
              </div>
            </div>

            {/* 3. HodlDay Cards (Generic/Viral) */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600/10 to-cyan-600/10 border border-white/10 shadow-2xl hover:shadow-cyan-500/10 p-6 flex flex-col items-center text-center group hover:-translate-y-1 transition-all">
              <div className="relative z-10 space-y-4 w-full">
                <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-2xl shadow-lg">🎁</div>
                <h2 className="text-xl font-black text-white">3. Send Cards</h2>
                <p className="text-gray-300 text-sm">
                  Send a card for FREE (we pay gas). Or use AI to gen a custom one (small fee).
                </p>
                <div className="pt-2">
                  <Button
                    onClick={() => window.location.href = '/cards'}
                    variant="outline"
                    className="w-full border-cyan-500/30 hover:bg-cyan-500/20 text-white font-bold"
                  >
                    Send for Free <ArrowRight className="ml-2 w-4 h-4 inline" />
                  </Button>
                </div>
              </div>
            </div>

            {/* 4. Daily Bingo Drop (New!) */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-orange-500/20 shadow-2xl hover:shadow-orange-500/10 p-6 flex flex-col items-center text-center group hover:-translate-y-1 transition-all">
              <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold text-xs rounded-bl-xl">
                NEW!
              </div>
              <div className="relative z-10 space-y-4 w-full">
                <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-orange-600 flex items-center justify-center text-2xl shadow-lg">🎰</div>
                <h2 className="text-xl font-black text-white">4. Daily Drops</h2>
                <p className="text-gray-300 text-sm">
                  Bingo-style daily claims. 'Dab' your spot for extra yield.
                </p>
                <div className="pt-2">
                  <Button
                    onClick={() => alert("Bingo Beta Launching Soon! Join the list.")} // Placeholder
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 text-black font-black hover:scale-105 transition-transform"
                  >
                    DAB NOW 🎲
                  </Button>
                </div>
              </div>
            </div>

          </section>

          {/* DAILY CLAIM TEASER */}
          <section className="w-full max-w-md mx-auto px-4 pb-16">
            <DailyClaim />
          </section>

          {/* Mom & Son Holiday Message (X Embed) & Mom Story */}
          <section id="mom-story-video" className="w-full max-w-4xl mx-auto pb-12 flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1 w-full">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
                <p className="text-center text-gray-400 text-xs mb-2 uppercase tracking-wide">The Real Story Verified</p>
                <XVideoEmbed />
              </div>
            </div>
            <div className="flex-1 w-full pt-8 md:pt-0">
              <MomStory />
            </div>
          </section>

          {/* (MomStory is merged above) */}

          {/* Timeline */}
          <div className="w-full bg-black/40 backdrop-blur-3xl -mx-4 py-16 mt-20 border-y border-white/5">
            <MomsJourney />
          </div>

        </div>
      </main>
    </div>
  );
}

