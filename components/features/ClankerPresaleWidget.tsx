"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { ArrowRight, TrendingUp, DollarSign, Activity, Sparkles, Play } from "lucide-react";
import { motion } from "framer-motion";

interface TokenStats {
    priceUsd: string;
    priceChange: {
        h24: number;
    };
    volume: {
        h24: number;
    };
    marketCap: number;
}

export function ClankerPresaleWidget() {
    const [stats, setStats] = useState<TokenStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Clanker Token Address
                const CLANKER_ADDRESS = "0x1bc0c42215582d5A085795f4baDbaC3ff36d1Bcb"; // Verify if this is the correct address for the presale token or the platform token. Assuming platform for now based on previous context.
                // If the user meant "Buy $MOM on Clanker", we should use the MOM address if it's launched there. 
                // However, the user said "Clanker Presale", implying we are buying on Clanker.
                // Let's stick to the address used in ClankerStats for now, or if MOM is on Clanker, we might need that address.
                // Re-reading: "Buy $MOM on Clanker". 
                // The address in ClankerStats (0x1bc...) was labeled "Clanker Token Address".
                // If $MOM is what we are buying, we need the $MOM address. 
                // CONTRACTS.md says $MOM is 0x2177...
                // The Navbar link uses 0x2177... 
                // So I should use the MOM address for the stats if possible, or Clanker stats if MOM isn't trading yet?
                // "Presale" implies it might not be fully public or is in a specific phase.
                // But the link in Navbar goes to `https://clanker.world/clanker/0x2177...` which is the MOM address.
                // So I will fetch stats for MOM (0x2177...) from DexScreener.

                const MOM_ADDRESS = "0x2177bCAC5c26507bfb4F0FF2cCbd255AE4BEDb07";
                const response = await fetch(
                    `https://api.dexscreener.com/latest/dex/tokens/${MOM_ADDRESS}`
                );
                const data = await response.json();

                if (data.pairs && data.pairs.length > 0) {
                    const pair = data.pairs[0];
                    setStats({
                        priceUsd: pair.priceUsd,
                        priceChange: pair.priceChange,
                        volume: pair.volume,
                        marketCap: pair.fdv,
                    });
                }
            } catch (error) {
                console.error("Failed to fetch stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full space-y-6"
        >
            {/* Main Hero Card with Video */}
            <Card className="relative overflow-hidden border-2 border-pink-500 shadow-[0_0_30px_rgba(236,72,153,0.3)] bg-black/80 backdrop-blur-xl">
                <div className="grid md:grid-cols-2 gap-0">
                    {/* Video Section */}
                    <div className="relative h-64 md:h-auto min-h-[300px] bg-black">
                        <video
                            src="/presale.mp4"
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover opacity-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
                    </div>

                    {/* Content Section */}
                    <div className="p-8 flex flex-col justify-center space-y-6 bg-gradient-to-l from-pink-900/20 to-black">
                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/50 text-pink-300 text-xs font-bold uppercase tracking-wider animate-bounce">
                                <Sparkles className="w-3 h-3" />
                                Presale Live on Clanker
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-white italic tracking-tight">
                                GET IN EARLY
                            </h2>
                            <p className="text-pink-100/80 text-lg">
                                Don't miss the rocket! Buy <span className="font-bold text-white">$MOMCOIN</span> directly on Clanker now.
                            </p>
                        </div>

                        {/* Stats Grid */}
                        {!loading && stats && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                                    <div className="text-xs text-gray-400">Price</div>
                                    <div className="text-xl font-mono text-green-400">${parseFloat(stats.priceUsd).toFixed(6)}</div>
                                </div>
                                <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                                    <div className="text-xs text-gray-400">Market Cap</div>
                                    <div className="text-xl font-mono text-purple-400">${(stats.marketCap / 1000).toFixed(1)}k</div>
                                </div>
                            </div>
                        )}

                        {/* CTA Button */}
                        <a
                            href="https://clanker.world/clanker/0x2177bCAC5c26507bfb4F0FF2cCbd255AE4BEDb07"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative block w-full"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-200" />
                            <button className="relative w-full bg-black text-white border border-white/10 px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-white/5 transition-colors">
                                <span>Buy on Clanker</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </a>
                    </div>
                </div>
            </Card>

        </motion.div>
    );
}
