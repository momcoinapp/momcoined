"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Sparkles, Share2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";

export default function DailyMomNews() {
    const [news, setNews] = useState<string>("");
    const [loading, setLoading] = useState(true);

    // Simulated "Daily" News (In prod, this would fetch from an API that caches the daily result)
    // For now, we generate a fresh one on mount or refresh to demonstrate.
    const fetchNews = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: "Generate a short, funny 'Daily Mom News' update about the crypto market. Use Mom humor. Mention 'eating vegetables' or 'cleaning rooms' as metaphors for market corrections. Keep it under 280 chars for Twitter."
                }),
            });
            const data = await res.json();
            setNews(data.response || "Mom is busy watching the charts. Check back later!");
        } catch (e) {
            setNews("Mom is napping. Market is sideways.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const shareText = encodeURIComponent(`🚨 Daily Mom Update 🚨\n\n${news}\n\n@momcoin #MOMCOIN #Base`);
    const shareUrl = "https://app.momcoined.com";

    return (
        <Card className="p-6 bg-gradient-to-br from-pink-900/20 to-purple-900/20 border-pink-500/30">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-pink-400 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                    Daily Mom News
                </h3>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={fetchNews}
                    disabled={loading}
                    className="text-pink-300 hover:bg-pink-900/20"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                </Button>
            </div>

            <div className="min-h-[80px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-purple-300/50 text-sm animate-pulse"
                        >
                            Consulting the crystal ball (and the neighbors)...
                        </motion.div>
                    ) : (
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-lg text-white font-medium italic text-center leading-relaxed"
                        >
                            "{news}"
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>

            <div className="mt-6 flex gap-3 justify-center">
                <Button
                    onClick={() => window.open(`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`, '_blank')}
                    className="bg-black/40 hover:bg-black/60 text-white border border-white/10"
                    size="sm"
                >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share on X
                </Button>
                <Button
                    onClick={() => window.open(`https://warpcast.com/~/compose?text=${shareText}&embeds[]=${shareUrl}`, '_blank')}
                    className="bg-purple-900/40 hover:bg-purple-900/60 text-purple-200 border border-purple-500/30"
                    size="sm"
                >
                    <Share2 className="w-4 h-4 mr-2" />
                    Recast
                </Button>
            </div>
        </Card>
    );
}
