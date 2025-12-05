"use client";

import { Card } from "@/components/ui/Card";
import { motion } from "framer-motion";
import { BarChart3, ArrowLeft, DollarSign, Users, Flame } from "lucide-react";
import Link from "next/link";

export function StatsLayout() {
    // Mock Data (Replace with real API calls to Basescan/DexScreener)
    const stats = [
        { label: "Price", value: "$0.00420", icon: DollarSign, color: "text-green-400" },
        { label: "Holders", value: "1,240", icon: Users, color: "text-blue-400" },
        { label: "Market Cap", value: "$420k", icon: BarChart3, color: "text-purple-400" },
        { label: "Burned", value: "4.2M", icon: Flame, color: "text-orange-400" },
    ];

    return (
        <div className="min-h-screen bg-black text-white p-4 md:p-8 flex flex-col items-center justify-center relative overflow-hidden">

            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[50%] w-[60%] h-[60%] bg-blue-900/10 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-4xl w-full relative z-10 space-y-8">
                {/* Back Link */}
                <Link href="/" className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Link>

                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center gap-3">
                        <BarChart3 className="w-8 h-8 text-blue-400" />
                        MomCoin Stats
                    </h1>
                    <p className="text-gray-400">
                        Live data from the kitchen.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="p-6 bg-white/5 border-white/10 hover:bg-white/10 transition-colors flex flex-col items-center text-center gap-2">
                                <div className={`p-3 rounded-full bg-white/5 ${stat.color}`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <p className="text-sm text-gray-400">{stat.label}</p>
                                <p className="text-2xl font-bold font-mono">{stat.value}</p>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Chart Placeholder */}
                {/* Chart Embed */}
                <Card className="p-0 bg-black/40 border-white/10 h-[500px] overflow-hidden relative">
                    <iframe
                        src="https://dexscreener.com/base/0x2177bCAC5c26507bfb4F0FF2cCbd255AE4BEDb07?embed=1&theme=dark"
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        className="absolute inset-0 w-full h-full"
                    ></iframe>
                </Card>
            </div>
        </div>
    );
}
