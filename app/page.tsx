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

  const [currentLogoIndex, setCurrentLogoIndex] = useState(0);
  const logos = [
    "/mom-coin-logo.jpg",
    "/mom-logo-1.jpg",
    "/mom-logo-2.jpg",
    "/mom-logo-3.jpg"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLogoIndex((prev) => (prev + 1) % logos.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleInvite = () => {
    const link = `${window.location.origin}?ref=${userData?.referralCode || "MOM"}`;
    navigator.clipboard.writeText(link);
    // You might want to show a toast here
    alert("Invite link copied! Share it with Mom!");
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen flex flex-col bg-black text-white overflow-hidden relative">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-pink-600/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-pink-500/20">
              M
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
              MomCoined
            </span>
          </div>

          <div className="flex items-center gap-4">
            {isConnected && (
              <div className="hidden md:flex items-center gap-4 text-sm font-medium text-gray-300 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                <span className="text-pink-400">{userData?.momBalance?.toLocaleString() ?? 0} MOM</span>
                <span className="text-purple-400">{userData?.leaderboardScore?.toLocaleString() ?? 0} PTS</span>
              </div>
            )}
            <Button
              onClick={isConnected ? () => disconnect() : handleLogin}
              variant={isConnected ? "outline" : "primary"}
              className={isConnected ? "border-pink-500/50 text-pink-500 hover:bg-pink-500/10" : "bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 shadow-lg shadow-pink-600/20 border-none"}
            >
              {isConnected ? "Disconnect" : "Connect Wallet"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 pt-24 pb-12 flex flex-col items-center justify-center min-h-screen gap-8">
        {isConnected && userData ? (
          <div className="w-full max-w-6xl">
            <Dashboard />
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-8 max-w-2xl w-full">
            {/* Hero Text */}
            <div className="text-center space-y-4 pt-12">
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight drop-shadow-lg">
                Make Mom <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
                  Proud Again
                </span>
              </h1>
              <div className="text-4xl mt-2">💖</div>

              <p className="text-xl text-pink-100/80 font-medium max-w-lg mx-auto leading-relaxed">
                Let Mom trade with trust, knowledge, and transparency.
                <br />
                <span className="text-sm opacity-75">The first AI Agent for Moms.</span>
              </p>
            </div>

            {/* NFT Promo - Visible to all */}
            <div className="w-full">
              <NFTMintPromo />
            </div>

            {/* Auth Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col gap-4 w-full max-w-xs"
            >
              <Button size="lg" onClick={handleLogin} className="w-full text-xl py-8 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 hover:scale-105 transition-transform shadow-xl shadow-pink-600/30 border-none">
                Start Earning Now 🚀
              </Button>
              <Button size="lg" variant="outline" onClick={handleInvite} className="w-full text-xl py-8 rounded-2xl border-2 border-white/20 hover:bg-white/10 hover:border-white/40 backdrop-blur-sm">
                Invite Mom 💌
              </Button>
            </motion.div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-6 w-full max-w-6xl mt-16">
              {[
                { title: "Share & Refer 💌", desc: "Invite Mom and friends to earn $MomCoin rewards." },
                { title: "Like & Create 🎨", desc: "Engage with content and create memes to boost your score." },
                { title: "Mom AI Agent 🤖", desc: "Let Mom trade with trust, knowledge, and transparency." }
              ].map((feature, i) => (
                <Card key={i} className="p-8 text-left bg-white/5 border-white/10 hover:bg-white/10 hover:scale-105 transition-all duration-300 cursor-default backdrop-blur-md rounded-3xl">
                  <h3 className="font-bold text-xl mb-3 text-pink-400">{feature.title}</h3>
                  <p className="text-gray-400 text-lg leading-relaxed">{feature.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

