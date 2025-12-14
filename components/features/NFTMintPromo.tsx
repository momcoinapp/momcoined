

"use client";

import { Card } from "@/components/ui/Card";
import { motion as motionOriginal, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

const motion = motionOriginal as any;
// Fetch User Balance (to check if they already minted)
const { data: balance } = useReadContract({
    address: CONTRACT_ADDRESSES.MOM_COOKIE_JAR,
    abi: MOM_COOKIE_JAR_ABI,
    functionName: "balanceOf",
    args: [userAddress],
    query: {
        enabled: !!userAddress,
    }
});

const hasJar = balance ? Number(balance) > 0 : false;

const handleMintJar = async () => {
    if (!userAddress) {
        toast.error("Connect wallet first!");
        return;
    }

    if (hasJar) {
        toast.error("You already have a Cookie Jar! Fill it to reveal.");
        return;
    }

    // 1. Enforce Base Chain
    if (chainId !== base.id) {
        try {
            switchChain({ chainId: base.id });
            return;
        } catch (e) {
            toast.error("Please switch to Base Network");
            return;
        }
    }

    try {
        await writeContract({
            address: CONTRACT_ADDRESSES.MOM_COOKIE_JAR,
            abi: MOM_COOKIE_JAR_ABI,
            functionName: "mintJarETH",
            args: [],
            value: parseEther("0.0003"), // ~$1
            // @ts-ignore
            capabilities: {
                paymasterService: {
                    url: process.env.NEXT_PUBLIC_PAYMASTER_URL || "https://api.developer.coinbase.com/rpc/v1/base/sb",
                }
            }
        });
        toast.success("Cookie Jar Minted! 🍪");
    } catch (error) {
        console.error("Mint error:", error);
        toast.error("Mint failed. (Check console)");
    }
};

// ... (handleFillJar remains)

return (
    <motion.div>
        {/* ... (Video/Card UI) ... */}
        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            {!hasJar ? (
                <Button
                    onClick={handleMintJar}
                    disabled={isPending}
                    className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white border-0 shadow-lg shadow-purple-500/25"
                >
                    {isPending ? "Minting..." : "Mint Jar ($1)"}
                </Button>
            ) : (
                <div className="text-green-400 font-bold px-4 py-2 bg-green-900/20 rounded-lg border border-green-500/30">
                    ✅ Jar Owned
                </div>
            )}

            <Button
                onClick={handleFillJar}
                variant="outline"
                className="border-pink-500/50 text-pink-300 hover:bg-pink-950/30"
            >
                Fill Jar ($5)
            </Button>
        </div>
        {/* ... */}
    </motion.div>
);
}

