"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { TrendingUp, Users, Coins, Activity } from "lucide-react";
import { motion } from "framer-motion";

export function TokenStats() {
    const [stats, setStats] = useState({
        totalSupply: "0",
        holders: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch("/api/token/stats");
                const data = await res.json();
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch token stats:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();

        // Refresh every 60 seconds
        const interval = setInterval(fetchStats, 60000);
        return () => clearInterval(interval);
    }, []);

    const statItems = [
        {
            label: "Total Supply",
            value: loading ? "..." : `${parseInt(stats.totalSupply).toLocaleString()} MOM`,
            icon: Coins,
            color: "text-yellow-400",
        },
        {
            label: "Holders",
            value: loading ? "..." : stats.holders > 0 ? stats.holders.toLocaleString() : "Coming Soon",
            icon: Users,
            color: "text-purple-400",
        },
    ];

    return (
        <Card className="p-6 bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/30">
            <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-pink-500" />
                <h3 className="text-xl font-bold text-white">Token Stats</h3>
                <div className="ml-auto">
                    <span className="text-xs text-purple-300 bg-purple-500/20 px-2 py-1 rounded-full">
                        Live on Base
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {statItems.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/5 rounded-lg p-4 border border-white/10"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <stat.icon className={`w-4 h-4 ${stat.color}`} />
                            <div className="text-xs text-purple-300 uppercase tracking-wider">
                                {stat.label}
                            </div>
                        </div>
                        <div className="text-xl font-bold text-white">
                            {stat.value}
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
                <a
                    href={`https://basescan.org/token/0x2177bCAC5c26507bfb4F0FF2cCbd255AE4BEDb07`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
                >
                    <TrendingUp className="w-3 h-3" />
                    View on Basescan
                </a>
            </div>
        </Card>
    );
}
