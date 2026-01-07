"use client";

import { useState, useEffect, useCallback } from "react";
import { useAccount, useReadContract, useWriteContract, useSwitchChain, useChainId, usePublicClient } from "wagmi";
import { base } from "wagmi/chains";
import { CONTRACT_ADDRESSES, MOM_COOKIE_JAR_ABI } from "@/lib/contracts";
import { parseEther } from "viem";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useShareToFarcaster } from "@/hooks/useShareToFarcaster";
import toast from "react-hot-toast";
import { Cookie, Share2, Sparkles, ExternalLink, Gift, Loader2 } from "lucide-react";

interface JarData {
    tokenId: bigint;
    tier: number; // 0=sealed, 1=BaseMom, 2=FarMom, 3=BaseKid, 4=FarKid
}

const TIER_NAMES: Record<number, string> = {
    0: "Sealed",
    1: "BaseMom",
    2: "FarMom",
    3: "BaseKid",
    4: "FarKid",
};

const TIER_COLORS: Record<number, string> = {
    0: "bg-gray-700",
    1: "bg-gradient-to-br from-purple-600 to-pink-600",
    2: "bg-gradient-to-br from-blue-600 to-purple-600",
    3: "bg-gradient-to-br from-green-500 to-teal-500",
    4: "bg-gradient-to-br from-orange-500 to-yellow-500",
};

export function MyJars() {
    const { address } = useAccount();
    const { switchChain } = useSwitchChain();
    const chainId = useChainId();
    const publicClient = usePublicClient();
    const { shareJar } = useShareToFarcaster();
    const { writeContract, isPending } = useWriteContract();
    const [jars, setJars] = useState<JarData[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedJar, setSelectedJar] = useState<bigint | null>(null);
    const [cookieCount, setCookieCount] = useState(0);

    // Get user's jar balance
    const { data: balance, refetch: refetchBalance } = useReadContract({
        address: CONTRACT_ADDRESSES.MOM_COOKIE_JAR as `0x${string}`,
        abi: MOM_COOKIE_JAR_ABI,
        functionName: "balanceOf",
        args: address ? [address] : undefined,
        query: { enabled: !!address },
    });

    const jarCount = balance ? Number(balance) : 0;

    // Fetch user's cookie count
    useEffect(() => {
        const fetchCookies = async () => {
            if (!address) return;
            try {
                const res = await fetch(`/api/cookies/track?wallet=${address}`);
                const data = await res.json();
                setCookieCount(data.cookieCount || 0);
            } catch (e) {
                console.error("Failed to fetch cookies:", e);
            }
        };
        fetchCookies();
    }, [address]);

    // Fetch user's jar token IDs and tiers
    const fetchJars = useCallback(async () => {
        if (!address || jarCount === 0 || !publicClient) {
            setJars([]);
            return;
        }

        setLoading(true);
        try {
            const jarData: JarData[] = [];

            for (let i = 0; i < jarCount; i++) {
                // Get token ID at index
                const tokenId = await publicClient.readContract({
                    address: CONTRACT_ADDRESSES.MOM_COOKIE_JAR as `0x${string}`,
                    abi: MOM_COOKIE_JAR_ABI,
                    functionName: "tokenOfOwnerByIndex",
                    args: [address, BigInt(i)],
                }) as bigint;

                // Get tier for this token
                const tier = await publicClient.readContract({
                    address: CONTRACT_ADDRESSES.MOM_COOKIE_JAR as `0x${string}`,
                    abi: MOM_COOKIE_JAR_ABI,
                    functionName: "tokenTiers",
                    args: [tokenId],
                }) as bigint;

                jarData.push({
                    tokenId,
                    tier: Number(tier),
                });
            }

            setJars(jarData);
        } catch (error) {
            console.error("Error fetching jars:", error);
            // Fallback to mock if contract doesn't support tokenOfOwnerByIndex
            setJars([{ tokenId: BigInt(1), tier: 0 }]);
        } finally {
            setLoading(false);
        }
    }, [address, jarCount, publicClient]);

    useEffect(() => {
        fetchJars();
    }, [fetchJars]);

    const handleFillJar = async (tokenId: bigint) => {
        if (!address) {
            toast.error("Connect wallet first!");
            return;
        }

        if (chainId !== base.id) {
            switchChain({ chainId: base.id });
            return;
        }

        setSelectedJar(tokenId);

        try {
            await writeContract({
                address: CONTRACT_ADDRESSES.MOM_COOKIE_JAR as `0x${string}`,
                abi: MOM_COOKIE_JAR_ABI,
                functionName: "instantFillETH",
                args: [tokenId],
                value: parseEther("0.0006"), // ~$2 (updated from $5)
                // @ts-ignore
                capabilities: {
                    paymasterService: {
                        url: process.env.NEXT_PUBLIC_PAYMASTER_URL || "https://api.developer.coinbase.com/rpc/v1/base/sb",
                    }
                }
            });
            toast.success("Jar Filled! Mom Revealed! 👩");
            fetchJars(); // Refresh
        } catch (error) {
            console.error("Fill error:", error);
            toast.error("Fill failed. Check console.");
        } finally {
            setSelectedJar(null);
        }
    };

    const handleAskMom = async () => {
        if (!address) {
            toast.error("Connect wallet first!");
            return;
        }

        try {
            const res = await fetch("/api/cookies/checkin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ walletAddress: address }),
            });
            const data = await res.json();

            if (data.success) {
                toast.success(data.message);
                setCookieCount(data.totalCookies);
            } else {
                toast.error(data.message);
            }
        } catch (e) {
            toast.error("Failed to ask Mom for cookies");
        }
    };

    const handleShareJar = (tokenId: bigint, tier: number) => {
        const tierName = TIER_NAMES[tier];
        const displayName = address?.slice(0, 8) || "Anon";
        shareJar(tokenId.toString(), displayName, cookieCount, tierName);
    };

    if (!address) {
        return (
            <Card className="p-6 bg-white/5 border-white/10 text-center">
                <Cookie className="w-12 h-12 mx-auto mb-4 text-yellow-400 opacity-50" />
                <p className="text-gray-400">Connect wallet to see your jars</p>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Cookie Count & Ask Mom */}
            <Card className="p-4 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-yellow-500/30">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                        <Cookie className="w-8 h-8 text-yellow-400" />
                        <div>
                            <p className="text-2xl font-bold text-white">{cookieCount}</p>
                            <p className="text-xs text-yellow-300">Your Cookies</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="text-right text-xs text-gray-400">
                            <p>500 cookies = Free Reveal</p>
                            <div className="w-32 h-2 bg-gray-700 rounded-full mt-1">
                                <div
                                    className="h-full bg-yellow-500 rounded-full transition-all"
                                    style={{ width: `${Math.min((cookieCount / 500) * 100, 100)}%` }}
                                />
                            </div>
                        </div>

                        <Button
                            onClick={handleAskMom}
                            className="bg-yellow-600 hover:bg-yellow-500 text-black font-bold"
                            size="sm"
                        >
                            <Gift className="w-4 h-4 mr-1" />
                            Ask Mom
                        </Button>
                    </div>
                </div>
            </Card>

            {/* My Jars Header */}
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Cookie className="w-5 h-5 text-yellow-400" />
                My Cookie Jars ({jarCount})
                {loading && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
            </h3>

            {jarCount === 0 ? (
                <Card className="p-6 bg-white/5 border-white/10 text-center">
                    <Cookie className="w-12 h-12 mx-auto mb-4 text-yellow-400 opacity-50" />
                    <p className="text-gray-400 mb-4">You don't have any Cookie Jars yet!</p>
                    <p className="text-sm text-gray-500">Mint one above to get started 🍪</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {jars.map((jar) => (
                        <Card
                            key={jar.tokenId.toString()}
                            className={`p-4 border transition-all ${jar.tier > 0
                                ? "bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/30"
                                : "bg-white/5 border-white/10"
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                {/* Jar Icon */}
                                <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl ${TIER_COLORS[jar.tier]}`}>
                                    {jar.tier > 0 ? (jar.tier <= 2 ? "👩" : "👦") : "🏺"}
                                </div>

                                {/* Jar Info */}
                                <div className="flex-1">
                                    <p className="font-bold text-white">
                                        {jar.tier > 0 ? TIER_NAMES[jar.tier] : "Cookie Jar"} #{jar.tokenId.toString()}
                                    </p>
                                    <p className={`text-sm ${jar.tier > 0 ? "text-purple-300" : "text-gray-400"}`}>
                                        {jar.tier > 0 ? "✨ Revealed!" : "🔒 Sealed - Fill to Reveal"}
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 mt-4">
                                {jar.tier === 0 && (
                                    <Button
                                        onClick={() => handleFillJar(jar.tokenId)}
                                        disabled={isPending && selectedJar === jar.tokenId}
                                        className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-black font-bold text-sm"
                                        size="sm"
                                    >
                                        {isPending && selectedJar === jar.tokenId ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            "Fill ($2)"
                                        )}
                                    </Button>
                                )}

                                <Button
                                    onClick={() => handleShareJar(jar.tokenId, jar.tier)}
                                    variant="outline"
                                    className="border-purple-500/50 text-purple-300 hover:bg-purple-900/30"
                                    size="sm"
                                >
                                    <Share2 className="w-4 h-4 mr-1" />
                                    Share
                                </Button>

                                <Button
                                    onClick={() => window.open(`https://opensea.io/assets/base/${CONTRACT_ADDRESSES.MOM_COOKIE_JAR}/${jar.tokenId}`, '_blank')}
                                    variant="outline"
                                    className="border-white/20 text-gray-400 hover:text-white"
                                    size="sm"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
