"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { motion } from "framer-motion";
import { Gift, Clock, AlertCircle } from "lucide-react";
import { useWriteContract, useReadContract, useAccount } from "wagmi";
import { CONTRACT_ADDRESSES, MOM_HELPER_ABI, MOM_PREDICTION_ABI } from "@/lib/contracts";
import { toast } from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";

export function DailyClaim() {
    const { address } = useAccount();
    const [timeLeft, setTimeLeft] = useState<string | null>(null);
    const [canClaim, setCanClaim] = useState(false);

    // Season 1 Stats (Mocked for now, could be fetched from API)
    const SEASON_TOTAL = 25000000;
    const CLAIMED_TOTAL = 1250000; // Mock progress
    const progress = (CLAIMED_TOTAL / SEASON_TOTAL) * 100;

    const { data: lastClaimTimestamp, refetch } = useReadContract({
        address: CONTRACT_ADDRESSES.MOM_HELPER as `0x${string}`,
        abi: MOM_HELPER_ABI,
        functionName: "lastClaimTime",
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
        }
    });

    const { data: currentRoundId } = useReadContract({
        address: CONTRACT_ADDRESSES.MOM_PREDICTION as `0x${string}`,
        abi: MOM_PREDICTION_ABI,
        functionName: "currentRoundId",
    });

    const { writeContractAsync: claimDaily, isPending } = useWriteContract();

    useEffect(() => {
        if (!lastClaimTimestamp) {
            setCanClaim(true);
            return;
        }

        const lastClaim = Number(lastClaimTimestamp) * 1000;
        const nextClaim = lastClaim + (24 * 60 * 60 * 1000);
        const now = Date.now();

        if (now >= nextClaim) {
            setCanClaim(true);
            setTimeLeft(null);
        } else {
            setCanClaim(false);
            setTimeLeft(formatDistanceToNow(nextClaim));
        }
    }, [lastClaimTimestamp]);

    const handleClaim = async () => {
        if (!claimDaily || !currentRoundId) {
            toast.error("Unable to claim at this time (Round ID missing)");
            return;
        }
        try {
            await claimDaily({
                address: CONTRACT_ADDRESSES.MOM_HELPER as `0x${string}`,
                abi: MOM_HELPER_ABI,
                functionName: "claim",
                args: [currentRoundId],
            });
            toast.success("Claim submitted! Waiting for confirmation...");
            // In a real app, we'd wait for receipt here
        } catch (error) {
            console.error("Claim error:", error);
            toast.error("Failed to claim. Try again later.");
        }
    };

    return (
        <Card className="p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Gift className="w-24 h-24 text-pink-500" />
            </div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Gift className="w-5 h-5 text-pink-500" />
                            Daily Faucet
                        </h3>
                        <p className="text-purple-200 text-sm">Claim your daily 10 MOM</p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-purple-300 uppercase tracking-wider">Season 1 Pool</div>
                        <div className="text-sm font-bold text-white">{progress.toFixed(1)}% Claimed</div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-white/10 rounded-full mb-6 overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-pink-500 to-purple-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Holder Status */}
                <div className="mb-6 p-3 bg-pink-500/10 border border-pink-500/20 rounded-lg">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-pink-300">Holder Status</span>
                        {Number(userData?.momBalance || 0) >= 50000 ? (
                            <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded">
                                WHALE (20% OFF MINTS)
                            </span>
                        ) : (
                            <span className="text-xs text-gray-400">
                                Hold 50k MOM for 20% Off
                            </span>
                        )}
                    </div>
                </div>

                {canClaim ? (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleClaim}
                        disabled={isPending}
                        className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl font-bold text-white shadow-lg shadow-pink-500/20 flex items-center justify-center gap-2"
                    >
                        {isPending ? (
                            "Claiming..."
                        ) : (
                            <>
                                <Gift className="w-5 h-5" />
                                Claim 10 MOM
                            </>
                        )}
                    </motion.button>
                ) : (
                    <div className="w-full py-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center gap-2 text-purple-300 font-medium">
                        <Clock className="w-5 h-5" />
                        Next claim in {timeLeft}
                    </div>
                )}

                <div className="mt-4 flex items-start gap-2 text-xs text-purple-300 bg-purple-900/20 p-3 rounded-lg">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <p>
                        Note: Faucet requires a small amount of ETH on Base for gas.
                        Rewards are distributed from the Season 1 allocation.
                    </p>
                </div>
            </div>
        </Card>
    );
}
