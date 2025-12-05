"use client";

import { NFTMintPromo } from "@/components/features/NFTMintPromo";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function CookieJarLayout() {
    return (
        <div className="min-h-screen bg-black text-white p-4 md:p-8 flex flex-col items-center justify-center relative overflow-hidden">

            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-900/20 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-2xl w-full relative z-10 space-y-8">
                {/* Back Link */}
                <Link href="/" className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Link>

                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
                        The Cookie Jar
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Mint a Jar. Free a Mom. Join the Family.
                    </p>
                </div>

                {/* The Mint Component */}
                <NFTMintPromo />

                {/* Footer / Context */}
                <div className="text-center text-sm text-gray-500 max-w-md mx-auto">
                    <p>
                        Each jar contains 1 of 4 Rarity Tiers.
                        <br />
                        Reveal your Mom to see if you got a <strong>Based Mom</strong> (Tier 1).
                    </p>
                </div>
            </div>
        </div>
    );
}
