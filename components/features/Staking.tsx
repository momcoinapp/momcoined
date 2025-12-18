"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { TrendingUp, Lock } from "lucide-react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { CONTRACT_ADDRESSES, MOM_HELPER_ABI, MOM_TOKEN_ABI } from "@/lib/contracts";
import { toast } from "react-hot-toast";
import { formatEther, parseEther } from "viem";

export default function Staking() {
    const { address } = useAccount();
    const [amount, setAmount] = useState("");
    const [activeTab, setActiveTab] = useState<"stake" | "withdraw">("stake");

    // Read Staked Balance
    const { data: stakedBalance } = useReadContract({
        address: CONTRACT_ADDRESSES.MOM_HELPER,
        abi: MOM_HELPER_ABI,
        functionName: "stakedBalance",
        args: address ? [address] : undefined,
    });

    // Read MOM Balance
    const { data: momBalance } = useReadContract({
        address: CONTRACT_ADDRESSES.MOM_TOKEN,
        abi: MOM_TOKEN_ABI,
        functionName: "balanceOf",
        args: address ? [address] : undefined,
    });

    const { writeContract, isPending } = useWriteContract();

    const handleAction = () => {
        if (!amount || !address) return;

        try {
            if (activeTab === "stake") {
                // Note: In a real app, you'd check allowance first and do approve() if needed
                writeContract({
                    address: CONTRACT_ADDRESSES.MOM_HELPER,
                    abi: MOM_HELPER_ABI,
                    functionName: "stake",
                    args: [parseEther(amount)],
                });
            } else {
                writeContract({
                    address: CONTRACT_ADDRESSES.MOM_HELPER,
                    abi: MOM_HELPER_ABI,
                    functionName: "withdraw",
                    args: [parseEther(amount)],
                });
            }
        } catch (error) {
            console.error(error);
            toast.error("Transaction failed");
        }
    };

    return (
        <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <Lock className="w-5 h-5 text-pink-500" />
                    Mom's Savings Jar (Staking)
                </h3>
                <div className="text-sm text-green-400 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>APY: 12%</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 p-4 rounded-xl">
                    <div className="text-sm text-gray-400">Staked Balance</div>
                    <div className="text-2xl font-bold text-white">
                        {stakedBalance ? formatEther(stakedBalance as bigint) : "0"} MOM
                    </div>
                </div>
                <div className="bg-white/5 p-4 rounded-xl">
                    <div className="text-sm text-gray-400">Wallet Balance</div>
                    <div className="text-2xl font-bold text-white">
                        {momBalance ? formatEther(momBalance as bigint) : "0"} MOM
                    </div>
                </div>
            </div>

            <div className="flex gap-2 mb-4 bg-white/5 p-1 rounded-lg">
                <button
                    onClick={() => setActiveTab("stake")}
                    className={`flex-1 py-2 rounded-md text-sm font-bold transition-colors ${activeTab === "stake" ? "bg-pink-500 text-white" : "text-gray-400 hover:text-white"
                        }`}
                >
                    Stake
                </button>
                <button
                    onClick={() => setActiveTab("withdraw")}
                    className={`flex-1 py-2 rounded-md text-sm font-bold transition-colors ${activeTab === "withdraw" ? "bg-purple-500 text-white" : "text-gray-400 hover:text-white"
                        }`}
                >
                    Withdraw
                </button>
            </div>

            <div className="space-y-4">
                <div className="relative">
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                    />
                    <button
                        onClick={() => setAmount(activeTab === "stake" ? formatEther((momBalance as bigint) || BigInt(0)) : formatEther((stakedBalance as bigint) || BigInt(0)))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs bg-white/10 px-2 py-1 rounded hover:bg-white/20"
                    >
                        MAX
                    </button>
                </div>

                <button
                    onClick={handleAction}
                    disabled={isPending || !amount}
                    className={`w-full py-3 rounded-xl font-bold text-white transition-all ${activeTab === "stake"
                        ? "bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700"
                        : "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                        }`}
                >
                    {isPending ? "Confirming..." : activeTab === "stake" ? "Stake MOM" : "Withdraw MOM"}
                </button>
            </div>
        </Card>
    );
}
