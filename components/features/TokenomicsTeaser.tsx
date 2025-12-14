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

export function TokenomicsTeaser() {
    return (
        <section className="py-20 px-4 w-full">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">

                {/* Text Side */}
                <div className="flex-1 space-y-6">
                    <h2 className="text-4xl font-black text-white">Mom's Secret Recipe 📜</h2>
                    <p className="text-xl text-gray-300">
                        Not your average memecoin. $MomCoin is baked with fair mechanics and long-term sustainability. No rugs, just hugs.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="p-6 bg-white/5 rounded-2xl border border-white/10 text-center">
                            <div className="text-3xl font-black text-white mb-2">100B</div>
                            <div className="text-sm text-gray-400 uppercase tracking-wider">Total Supply</div>
                        </div>
                        <div className="p-6 bg-white/5 rounded-2xl border border-white/10 text-center">
                            <div className="text-3xl font-black text-pink-400 mb-2">8.2B</div>
                            <div className="text-sm text-gray-400 uppercase tracking-wider">Locked (Moms)</div>
                            <div className="text-xs text-gray-500 mt-1">One for every human on Earth</div>
                        </div>
                        <div className="p-6 bg-white/5 rounded-2xl border border-white/10 text-center">
                            <div className="text-3xl font-black text-purple-400 mb-2">20B</div>
                            <div className="text-sm text-gray-400 uppercase tracking-wider">Community Grant</div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-pink-900/20 to-purple-900/20 rounded-3xl p-8 border border-white/10">
                        <h3 className="text-2xl font-bold text-white mb-6 text-center">Our Mission Goals</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 text-left p-3 bg-black/30 rounded-lg">
                                <span className="text-2xl">🏠</span>
                                <div>
                                    <div className="font-bold text-pink-200">Tiny Home Communities</div>
                                    <div className="text-xs text-gray-400">Safe housing for single moms</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-left p-3 bg-black/30 rounded-lg">
                                <span className="text-2xl">🛡️</span>
                                <div>
                                    <div className="font-bold text-purple-200">Anti-Trafficking Support</div>
                                    <div className="text-xs text-gray-400">Direct aid to victims & prevention</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-400 rounded-lg border border-green-500/20 text-sm font-mono">
                            <span>✅ Liquidity Locked on Clanker</span>
                        </div>
                    </div>
                </div>

                {/* Chart Side */}
                <div className="flex-1 w-full h-[400px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={80}
                                outerRadius={140}
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

                    {/* Center Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-5xl">🍪</span>
                        <span className="font-bold text-white mt-2">100B Supply</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
