"use client";

import NFTMintPromo from "@/components/features/NFTMintPromo";
import { Cookie } from "lucide-react";

export default function NFTsPage() {
    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 bg-pink-500/10 border border-pink-500/20 px-4 py-2 rounded-full mb-2">
                    <Cookie className="w-5 h-5 text-pink-500" />
                    <span className="text-pink-200 font-bold text-sm uppercase tracking-wider">Mom's Collection</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white drop-shadow-xl">
                    Mint Your Mom
                </h1>
                <p className="text-xl text-purple-200 max-w-2xl mx-auto">
                    Every degen needs a Mom. Mint your Cookie Jar and Mom NFT to unlock exclusive perks and join the family.
                </p>
            </div>

            <NFTMintPromo />
        </div>
    );
}
