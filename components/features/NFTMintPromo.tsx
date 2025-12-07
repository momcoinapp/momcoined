

"use client";

import { Card } from "@/components/ui/Card";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useUserSession } from "@/components/providers/UserSessionProvider";
import { toast } from "react-hot-toast";
import { useWriteContract, useReadContract } from "wagmi";
import { CONTRACT_ADDRESSES, MOM_COOKIE_JAR_ABI } from "@/lib/contracts";
import { parseEther, formatUnits } from "viem";
import { Button } from "@/components/ui/Button";

export function NFTMintPromo() {
    const { userAddress } = useUserSession();
    const { writeContract, isPending } = useWriteContract();

    // Fetch Total Supply
    const { data: totalSupply } = useReadContract({
        address: CONTRACT_ADDRESSES.MOM_COOKIE_JAR,
        abi: MOM_COOKIE_JAR_ABI,
        functionName: "totalSupply",
    });

    const mintedCount = totalSupply ? Number(totalSupply) : 0;
    const remaining = 5958 - mintedCount;

    const handleMintJar = async () => {
        if (!userAddress) {
            toast.error("Connect wallet first!");
            return;
        }
        // Mint Jar for ~$1 (0.0003 ETH)
        try {
            await writeContract({
                address: CONTRACT_ADDRESSES.MOM_COOKIE_JAR,
                abi: MOM_COOKIE_JAR_ABI,
                functionName: "mintJarETH",
                args: [],
                value: parseEther("0.0003"),
            });
            toast.success("Cookie Jar Minted! 🍪");
        } catch (error) {
            console.error("Mint error:", error);
            toast.error("Mint failed.");
        }
    };

    const handleFillJar = async () => {
        if (!userAddress) {
            toast.error("Connect wallet first!");
            return;
        }
        // Fill Jar for ~$5 (0.0015 ETH)
        // Note: In real app, we need to know WHICH tokenId to fill. 
        // For this promo, we assume they fill their most recent one or we prompt for ID.
        // Simplified for MVP: Just call the function (user would need to pass ID in real UI)
        toast("Select a Jar to fill! (Coming soon in Dashboard)");
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full"
        >
            <Card className="p-6 bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-purple-500/30 backdrop-blur-md overflow-hidden relative min-h-[200px]">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Sparkles className="w-32 h-32 text-pink-500" />
                </div>

                {/* Cooking Animation Overlay */}
                <AnimatePresence>
                    {isPending && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6"
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="mb-4"
                            >
                                <Sparkles className="w-16 h-16 text-yellow-400" />
                            </motion.div>
                            <h3 className="text-2xl font-bold text-white mb-2">Mom is Cooking... 🍪</h3>
                            <p className="text-purple-200 animate-pulse">Mixing the dough... Adding love...</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    {/* Image Section */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                        <div className="relative w-48 h-48 bg-black rounded-xl overflow-hidden border-2 border-purple-500/50 flex items-center justify-center">
                            <video
                                src="/jar-placeholder.mp4"
                                poster="/cookie-jar-promo.jpg"
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 text-center md:text-left space-y-4">
                        <div>
                            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                                Mom's Cookie Jar 🍪
                            </h3>
                            <p className="text-pink-200 font-medium text-sm">
                                Honoring the Original Mom (Est. 1958)
                            </p>
                            <p className="text-purple-200/80 text-sm mt-2 leading-relaxed">
                                Help free the locked Moms! Mint a jar to start the journey.
                                <br />
                                <span className="text-xs opacity-75">4 Rarities. 1,958 of each. Rarest mint first.</span>
                            </p>
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-xs text-pink-300 bg-pink-900/20 px-3 py-1 rounded-full w-fit mx-auto md:mx-0">
                                <Sparkles className="w-3 h-3" />
                                <span>{mintedCount > 0 ? `${mintedCount} / 7,832 Minted` : "7,832 Moms Remaining"}</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                            <Button
                                onClick={handleMintJar}
                                disabled={isPending}
                                className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white border-0 shadow-lg shadow-purple-500/25"
                            >
                                {isPending ? "Minting..." : "Mint Jar ($1)"}
                            </Button>

                            <Button
                                onClick={handleFillJar}
                                variant="outline"
                                className="border-pink-500/50 text-pink-300 hover:bg-pink-950/30"
                            >
                                Fill Jar ($5)
                            </Button>
                        </div>

                        <p className="text-xs text-purple-400/60 italic">
                            *Pay $5 to instantly reveal your Mom Tier!
                        </p>

                        {/* Social Sharing */}
                        <div className="pt-4 mt-2 border-t border-white/10">
                            <p className="text-xs text-purple-300 mb-2 font-medium">Share the Alpha:</p>
                            <div className="flex gap-3 justify-center md:justify-start">
                                {/* X / Twitter */}
                                <button
                                    onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent("Helping free the locked Moms on Base! 🍪\n\nHonoring the real OG Mom (Est. 1958) ❤️\n\n1. Mint Jar 🏺\n2. Fill with Cookies 🍪\n3. Reveal Mom 👩\n\n@momcoin #Base #MomsCookieJar\nhttps://app.momcoined.com")}`, '_blank')}
                                    className="p-2 bg-black/40 hover:bg-black/60 rounded-lg text-white transition flex items-center gap-2 text-xs"
                                >
                                    𝕏 Share
                                </button >

                                {/* Farcaster */}
                                < button
                                    onClick={() => window.open(`https://warpcast.com/~/compose?text=${encodeURIComponent("Helping free the locked Moms on Base! 🍪\n\nHonoring the real OG Mom (Est. 1958) ❤️\n\n1. Mint Jar 🏺\n2. Fill with Cookies 🍪\n3. Reveal Mom 👩\n\n@momcoin #Base #MomsCookieJar\nhttps://app.momcoined.com")}`, '_blank')}
                                    className="p-2 bg-purple-900/40 hover:bg-purple-900/60 rounded-lg text-purple-200 transition flex items-center gap-2 text-xs"
                                >
                                    🟣 Warpcast
                                </button >

                                {/* TikTok (Copy Link) */}
                                < button
                                    onClick={() => {
                                        navigator.clipboard.writeText("https://app.momcoined.com");
                                        toast.success("Link Copied! Post on TikTok! 🎵");
                                    }}
                                    className="p-2 bg-pink-900/40 hover:bg-pink-900/60 rounded-lg text-pink-200 transition flex items-center gap-2 text-xs"
                                >
                                    🎵 TikTok
                                </button >
                            </div >
                        </div >
                    </div >
                </div >
            </Card >
        </motion.div >
    );
}

