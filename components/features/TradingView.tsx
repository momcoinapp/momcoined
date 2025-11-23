"use client";

import { Card } from "@/components/ui/Card";
import { TrendingUp, ExternalLink, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function TradingView() {
    return (
        <Card className="p-6 bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-500/30">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center md:text-left">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2 justify-center md:justify-start">
                        <TrendingUp className="w-6 h-6 text-green-400" />
                        Trade on Flaunch.gg
                    </h3>
                    <p className="text-green-100/80 max-w-md">
                        Buy and sell MomCoin securely on the Flaunch launchpad. Join the group to earn trading fees!
                    </p>
                </div>

                <motion.a
                    href="https://flaunch.gg/group/momcoin"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-green-500 hover:bg-green-400 text-green-950 font-bold rounded-xl transition-colors flex items-center gap-2 shadow-lg shadow-green-500/20"
                >
                    Start Trading
                    <ArrowRight className="w-5 h-5" />
                </motion.a>
            </div>
        </Card>
    );
}
