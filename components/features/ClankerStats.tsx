"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { ArrowUpRight, TrendingUp, DollarSign, Activity } from "lucide-react";

const MOM_CONTRACT_ADDRESS = "0x2177bCAC5c26507bfb4F0FF2cCbd255AE4BEDb07";

interface TokenStats {
    priceUsd: string;
    priceChange: {
        h1: number;
        h24: number;
    };
    volume: {
        h24: number;
    };
    marketCap: number;
}

export function ClankerStats() {
    const [stats, setStats] = useState<TokenStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch(
                    `https://api.dexscreener.com/latest/dex/tokens/${MOM_CONTRACT_ADDRESS}`
                );
                const data = await response.json();

                if (data.pairs && data.pairs.length > 0) {
                    // Get the pair with the highest liquidity or volume
                    const pair = data.pairs[0];
                    setStats({
                        priceUsd: pair.priceUsd,
                        priceChange: pair.priceChange,
                        volume: pair.volume,
                        marketCap: pair.fdv, // Fully Diluted Valuation is often used as Market Cap for new tokens
                    });
                }
            } catch (error) {
                console.error("Failed to fetch Clanker stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
        const interval = setInterval(fetchStats, 30000); // Update every 30s
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-24 bg-white/5 rounded-xl"></div>
                ))}
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-4 bg-gradient-to-br from-pink-500/10 to-purple-600/10 border-pink-500/20 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Price</span>
                    <DollarSign className="w-4 h-4 text-pink-500" />
                </div>
                <div className="text-2xl font-bold text-white">
                    ${parseFloat(stats.priceUsd).toFixed(6)}
                </div>
                <div className={`text-xs flex items-center mt-1 ${stats.priceChange.h24 >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {stats.priceChange.h24 >= 0 ? '+' : ''}{stats.priceChange.h24}% (24h)
                </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-indigo-600/10 border-purple-500/20 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Market Cap</span>
                    <Activity className="w-4 h-4 text-purple-500" />
                </div>
                <div className="text-2xl font-bold text-white">
                    ${stats.marketCap?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-600/10 border-blue-500/20 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Volume (24h)</span>
                    <TrendingUp className="w-4 h-4 text-blue-500" />
                </div>
                <div className="text-2xl font-bold text-white">
                    ${stats.volume.h24?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
            </Card>

            <a
                href={`https://clanker.world/clanker/${MOM_CONTRACT_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
            >
                <Card className="p-4 h-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 transition-colors border-none flex flex-col justify-center items-center cursor-pointer group">
                    <span className="text-white font-bold text-lg flex items-center gap-2">
                        Buy on Clanker <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </span>
                </Card>
            </a>
        </div>
    );
}
