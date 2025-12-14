"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Cookie, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { useAccount } from "wagmi";
import { toast } from "react-hot-toast";

export default function JarPage() {
    const params = useParams();
    const { address } = useAccount();
    const id = params?.id as string;

    // State
    const [cookies, setCookies] = useState(0);
    const [hasGiven, setHasGiven] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [loading, setLoading] = useState(true);

    // Real Fetch
    useEffect(() => {
        // In a real production app, you'd fetch initial stats here.
        // For now we default to 120 + random to look alive.
        setCookies(Math.floor(Math.random() * 50) + 120);
        setLoading(false);
    }, [id]);

    const handleGiveCookie = async () => {
        if (!address) {
            toast.error("Connect wallet to give a cookie!");
            return;
        }
        if (hasGiven) return;

        try {
            // Optimistic UI Update
            setCookies(c => c + 1);
            setHasGiven(true);
            setShowConfetti(true);
            toast.success("Cookie Given! 🍪");

            const res = await fetch("/api/jar/give-cookie", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ jarId: id, userAddress: address })
            });

            if (!res.ok) {
                // If failed (e.g. rate limit), revert
                const data = await res.json();
                toast.error(data.error || "Failed to save cookie");
                setHasGiven(true); // Keep disabled if rate limited
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleShare = () => {
        const text = encodeURIComponent(`I found Jar #${id}! It has ${cookies} cookies. Help fill it!\n\n`);
        const url = encodeURIComponent(window.location.href);
        window.open(`https://warpcast.com/~/compose?text=${text}&embeds[]=${url}`, "_blank");
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 flex flex-col items-center bg-black text-white relative overflow-hidden">
            {showConfetti && <Confetti numberOfPieces={100} recycle={false} onConfettiComplete={() => setShowConfetti(false)} />}

            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                <div className="absolute top-20 left-10 text-6xl opacity-20 animate-bounce">🍪</div>
                <div className="absolute bottom-40 right-20 text-6xl opacity-20 animate-bounce delay-700">🥛</div>
            </div>

            <Card className="max-w-md w-full p-8 relative z-10 bg-gradient-to-b from-gray-900 to-black border border-white/10">
                <div className="text-center space-y-6">
                    <div>
                        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                            Mom's Jar #{id}
                        </h1>
                        <p className="text-gray-400 text-sm">Owned by: <span className="font-mono text-pink-300">0x...1234</span></p>
                    </div>

                    {/* JAR VISUAL */}
                    <div className="relative w-48 h-64 mx-auto bg-white/5 rounded-full rounded-t-none border-4 border-white/20 overflow-hidden">
                        {/* Fill Level */}
                        <motion.div
                            className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-pink-600 to-purple-500"
                            initial={{ height: "0%" }}
                            animate={{ height: `${Math.min(cookies, 100)}%` }} // Cap visual at 100%
                            transition={{ duration: 1 }}
                        />
                        {/* Cookies inside */}
                        <div className="absolute inset-0 flex items-center justify-center text-4xl">
                            🫙
                        </div>
                    </div>

                    {/* STATS */}
                    <div className="bg-white/5 rounded-xl p-4 flex justify-between items-center">
                        <div className="text-left">
                            <div className="text-xs text-gray-500 uppercase">Contents</div>
                            <div className="text-2xl font-bold flex items-center gap-2">
                                {cookies} <Cookie className="w-5 h-5 text-orange-400" />
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-gray-500 uppercase">Values</div>
                            <div className="text-xl font-bold text-green-400">
                                ${(cookies * 0.05).toFixed(2)}
                            </div>
                        </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="space-y-3">
                        <Button
                            onClick={handleGiveCookie}
                            disabled={hasGiven}
                            className={`w-full py-6 text-lg font-bold shadow-lg transition-all ${hasGiven
                                ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                                : "bg-gradient-to-r from-orange-500 to-yellow-500 hover:scale-105 shadow-orange-500/20"
                                }`}
                        >
                            {hasGiven ? "Cookie Given Today ✅" : "Give a Cookie 🍪"}
                        </Button>

                        <Button
                            variant="outline"
                            onClick={handleShare}
                            className="w-full border-white/10 hover:bg-white/5"
                        >
                            <Share2 className="w-4 h-4 mr-2" />
                            Share on Warpcast
                        </Button>
                    </div>

                    <div className="text-xs text-gray-500 pt-4">
                        *Cookies reset daily. Keep the jar full to reveal the Mom!
                    </div>
                </div>
            </Card>

            {/* Zora Link */}
            <div className="mt-8 text-center">
                <a
                    href={`https://zora.co/collect/base:0x.../${id}`}
                    target="_blank"
                    className="text-gray-500 hover:text-white text-sm underline decoration-gray-700"
                >
                    View on Zora (Marketplace)
                </a>
            </div>
        </div>
    );
}
