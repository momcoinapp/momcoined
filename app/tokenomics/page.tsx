"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card } from "@/components/ui/Card";
import { motion } from "framer-motion";

const data = [
    { name: "Community Rewards", value: 50, color: "#EC4899" }, // Pink
    { name: "Liquidity Pool", value: 30, color: "#8B5CF6" },    // Purple
    { name: "Marketing & Virality", value: 10, color: "#F59E0B" }, // Amber
    { name: "Dev & Team", value: 10, color: "#10B981" },        // Emerald
];

export default function TokenomicsPage() {
    return (
        <div className="min-h-screen bg-black text-white pt-20 px-4">
            <section className="max-w-6xl mx-auto flex flex-col items-center gap-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-4"
                >
                    <h1 className="text-4xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
                        MomCoin Tokenomics
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Fair, transparent, and built for the long haul. Verify everything on-chain.
                    </p>
                    <div className="flex justify-center gap-4 pt-4">
                        <a
                            href="https://clanker.world/clanker/0x2177bCAC5c26507bfb4F0FF2cCbd255AE4BEDb07"
                            target="_blank"
                            className="px-6 py-3 bg-blue-600 rounded-full font-bold hover:bg-blue-700 transition"
                        >
                            View on Clanker 🌊
                        </a>
                        <a
                            href="https://basescan.org/token/0x2177bCAC5c26507bfb4F0FF2cCbd255AE4BEDb07"
                            target="_blank"
                            className="px-6 py-3 bg-white/10 border border-white/20 rounded-full font-bold hover:bg-white/20 transition"
                        >
                            View on Basescan 🔍
                        </a>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full">
                    {/* Stats */}
                    <div className="space-y-6">
                        <Card className="p-8 bg-white/5 border-pink-500/20">
                            <h3 className="text-2xl font-bold mb-6">Real-Time Stats</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                    <span className="text-gray-400">Total Supply</span>
                                    <span className="font-mono text-xl font-bold">100,000,000,000</span>
                                </div>
                                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                    <span className="text-gray-400">Liquidity Status</span>
                                    <span className="text-green-400 font-bold flex items-center gap-2">
                                        🔒 LOCKED on Clanker
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                    <span className="text-gray-400">Moms On-Chain</span>
                                    <span className="font-mono text-xl text-pink-400 font-bold">12,403+</span>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-8 bg-gradient-to-br from-pink-900/20 to-purple-900/20 border-purple-500/20">
                            <h3 className="text-2xl font-bold mb-4">Mission Funds 🏠</h3>
                            <p className="text-gray-300 mb-4">
                                A portion of fees goes directly to:
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-2">
                                    <span className="text-xl">🏠</span>
                                    <span>Building Tiny Home Communities for Moms</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-xl">🛡️</span>
                                    <span>Anti-Trafficking Support & Prevention</span>
                                </li>
                            </ul>
                        </Card>
                    </div>

                    {/* Chart */}
                    <div className="h-[400px] bg-white/5 rounded-3xl p-4 flex items-center justify-center relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={90}
                                    outerRadius={160}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-5xl">🍪</span>
                            <span className="font-bold text-white mt-2">100B Supply</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
