"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { CONTRACT_ADDRESSES } from "@/lib/contracts";

export function MomCoinChart() {
    const [pairAddress, setPairAddress] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPair() {
            try {
                // Fetch pairs for MOM token
                const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${CONTRACT_ADDRESSES.MOM_TOKEN}`);
                const data = await res.json();

                if (data.pairs && data.pairs.length > 0) {
                    // Sort by liquidity to find the best pair
                    const bestPair = data.pairs.sort((a: any, b: any) => b.liquidity.usd - a.liquidity.usd)[0];
                    setPairAddress(bestPair.pairAddress);
                }
            } catch (error) {
                console.error("Failed to fetch DexScreener pair:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchPair();
    }, []);

    if (loading) {
        return (
            <Card className="w-full h-[500px] flex items-center justify-center bg-[#1a1a1a] border-white/10 animate-pulse">
                <span className="text-gray-400">Loading Chart...</span>
            </Card>
        );
    }

    if (!pairAddress) {
        return (
            <Card className="w-full h-[200px] flex items-center justify-center bg-[#1a1a1a] border-white/10">
                <div className="text-center">
                    <p className="text-gray-400 mb-2">Chart not available yet.</p>
                    <p className="text-xs text-gray-500">Add liquidity to Base to see the chart!</p>
                </div>
            </Card>
        );
    }

    return (
        <Card className="w-full overflow-hidden bg-[#1a1a1a] border-white/10 shadow-xl">
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
                <h3 className="font-bold text-lg text-pink-400">MOM/USD Chart 📈</h3>
                <span className="text-xs text-gray-500">Powered by DexScreener</span>
            </div>
            <div className="relative w-full h-[500px]">
                <iframe
                    src={`https://dexscreener.com/base/${pairAddress}?embed=1&theme=dark&trades=0&info=0`}
                    title="MomCoin Chart"
                    className="absolute inset-0 w-full h-full border-0"
                />
            </div>
        </Card>
    );
}
