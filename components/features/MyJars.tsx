"use client";

import { useState, useEffect } from "react";
import { useAccount, useReadContract, useWriteContract, useSwitchChain, useChainId } from "wagmi";
import { base } from "wagmi/chains";
import { CONTRACT_ADDRESSES, MOM_COOKIE_JAR_ABI } from "@/lib/contracts";
import { parseEther } from "viem";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useShareToFarcaster } from "@/hooks/useShareToFarcaster";
import toast from "react-hot-toast";
import { Cookie, Share2, Sparkles, ExternalLink } from "lucide-react";

interface JarData {
    tokenId: bigint;
    isFilled: boolean;
}

export function MyJars() {
    const { address } = useAccount();
    const { switchChain } = useSwitchChain();
    const chainId = useChainId();
    const { shareJar } = useShareToFarcaster();
    const { writeContract, isPending } = useWriteContract();
    const [jars, setJars] = useState<JarData[]>([]);
    const [selectedJar, setSelectedJar] = useState<bigint | null>(null);

    // Get user's jar balance
    const { data: balance } = useReadContract({
        address: CONTRACT_ADDRESSES.MOM_COOKIE_JAR,
        abi: MOM_COOKIE_JAR_ABI,
        functionName: "balanceOf",
        args: address ? [address] : undefined,
        query: { enabled: !!address },
    });

    const jarCount = balance ? Number(balance) : 0;

    // Fetch user's jar IDs (would need to call tokenOfOwnerByIndex for each)
    useEffect(() => {
        const fetchJars = async () => {
            if (!address || jarCount === 0) {
                setJars([]);
                return;
            }

            // For now, mock the jar data - in production, 
            // you'd call tokenOfOwnerByIndex for each index
            const mockJars: JarData[] = [];
            for (let i = 0; i < jarCount; i++) {
                mockJars.push({
                    tokenId: BigInt(i + 1), // Mock token IDs
                    isFilled: Math.random() > 0.7, // 30% filled
                });
            }
            setJars(mockJars);
        };

        fetchJars();
    }, [address, jarCount]);

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
                address: CONTRACT_ADDRESSES.MOM_COOKIE_JAR,
                abi: MOM_COOKIE_JAR_ABI,
                functionName: "instantFillETH",
                args: [tokenId],
                value: parseEther("0.0015"), // ~$5
            });
            toast.success("Jar Filled! Mom Revealed! 👩");
        } catch (error) {
            console.error("Fill error:", error);
            toast.error("Fill failed. Check console.");
        } finally {
            setSelectedJar(null);
        }
    };

    const handleShareJar = (tokenId: bigint, isFilled: boolean) => {
        const tier = isFilled ? "Base" : "Sealed";
        const cookies = isFilled ? Math.floor(Math.random() * 500) + 100 : 0;
        const displayName = address?.slice(0, 6) || "Anon";

        shareJar(tokenId.toString(), displayName, cookies, tier);
    };

    if (!address) {
        return (
            <Card className="p-6 bg-white/5 border-white/10 text-center">
                <Cookie className="w-12 h-12 mx-auto mb-4 text-yellow-400 opacity-50" />
                <p className="text-gray-400">Connect wallet to see your jars</p>
            </Card>
        );
    }

    if (jarCount === 0) {
        return (
            <Card className="p-6 bg-white/5 border-white/10 text-center">
                <Cookie className="w-12 h-12 mx-auto mb-4 text-yellow-400 opacity-50" />
                <p className="text-gray-400 mb-4">You don't have any Cookie Jars yet!</p>
                <p className="text-sm text-gray-500">Mint one above to get started 🍪</p>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Cookie className="w-5 h-5 text-yellow-400" />
                My Cookie Jars ({jarCount})
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {jars.map((jar) => (
                    <Card
                        key={jar.tokenId.toString()}
                        className={`p-4 border transition-all ${jar.isFilled
                                ? "bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/30"
                                : "bg-white/5 border-white/10"
                            }`}
                    >
                        <div className="flex items-center gap-4">
                            {/* Jar Icon */}
                            <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl ${jar.isFilled
                                    ? "bg-gradient-to-br from-purple-500 to-pink-500"
                                    : "bg-gray-800"
                                }`}>
                                {jar.isFilled ? "👩" : "🏺"}
                            </div>

                            {/* Jar Info */}
                            <div className="flex-1">
                                <p className="font-bold text-white">
                                    Jar #{jar.tokenId.toString()}
                                </p>
                                <p className={`text-sm ${jar.isFilled ? "text-purple-300" : "text-gray-400"}`}>
                                    {jar.isFilled ? "✨ Mom Revealed!" : "🔒 Sealed - Fill to Reveal"}
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 mt-4">
                            {!jar.isFilled && (
                                <Button
                                    onClick={() => handleFillJar(jar.tokenId)}
                                    disabled={isPending && selectedJar === jar.tokenId}
                                    className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-black font-bold text-sm"
                                    size="sm"
                                >
                                    {isPending && selectedJar === jar.tokenId ? "Filling..." : "Fill ($5)"}
                                </Button>
                            )}

                            <Button
                                onClick={() => handleShareJar(jar.tokenId, jar.isFilled)}
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
        </div>
    );
}
