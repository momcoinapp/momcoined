"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

const CARDS = [
    { id: 1, img: "/cards/Merry_CryptMas_-_Festive_crypto_Christmas_NFT.png" },
    { id: 2, img: "/cards/Diamond_Hands_Mom_-_Crypto_meme_NFT.png" },
    { id: 3, img: "/cards/Bitcoin_Mom_-_Crypto_maximalist_NFT.png" },
    { id: 4, img: "/cards/Mom_Hodls_the_Dip_-_Trading_meme_NFT.png" },
    { id: 5, img: "/cards/Wen_Lambo_Mom_-_Crypto_humor_meme_NFT.png" },
    { id: 6, img: "/cards/Mom_to_the_Moon_-_Meme-inspired_crypto_NFT.png" },
    { id: 7, img: "/cards/Supermom_Energy_NFT_-_Updated_with_branding_and_crypto_elements.png" },
    { id: 8, img: "/cards/The_Greatest_Gift_NFT_-_Updated_with_branding_and_crypto_elements.png" },
    { id: 9, img: "/cards/You_Make_the_World_Shine_NFT_-_Updated_with_branding_and_blockchain_elements.png" },
    { id: 10, img: "/cards/Merry_CryptMas_Tree_-_Holiday_crypto_pun_NFT.png" },
    { id: 11, img: "/cards/Feliz_NaviDApp_-_Base_builders_&_Farcaster_focused.png" },
    { id: 12, img: "/cards/Feliz_NaviDApp_-_Web3_degen_greeting_card.png" },
    { id: 13, img: "/cards/Happy_HodlDays_-_Base_&_Farcaster_frens_card.png" },
    { id: 14, img: "/cards/HodlDays_Degen_Greetings_-_Crypto_friend_card.png" },
    { id: 15, img: "/cards/Stack_&_Celebrate_-_Base_&_Farcaster_community_card.png" },
    { id: 16, img: "/cards/Stack_and_Celebrate_-_Inclusive_crypto_greeting_card.png" },
    { id: 17, img: "/Momcoin-Christmas.jpeg" },
    { id: 18, img: "/Momcoin Christmas(1).jpeg" },
];

export function NFTCarousel() {
    return (
        <section className="py-12 relative overflow-hidden bg-black/50">
            {/* Header */}
            <div className="container mx-auto px-4 mb-8 text-center">
                <div className="inline-flex items-center gap-2 bg-pink-500/10 border border-pink-500/20 px-4 py-2 rounded-full mb-4">
                    <Sparkles className="w-4 h-4 text-pink-400" />
                    <span className="text-pink-200 font-bold text-xs uppercase tracking-wider">Active Drops</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white">
                    2025 <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">HODLday Collection</span>
                </h2>
            </div>

            {/* Marquee Container */}
            <div className="flex relative items-center overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black z-10" />

                <motion.div
                    className="flex gap-6 px-6"
                    animate={{ x: "-50%" }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 30
                    }}
                    style={{ width: "fit-content" }}
                >
                    {/* Double the list for seamless loop */}
                    {[...CARDS, ...CARDS, ...CARDS].map((card, idx) => (
                        <Link
                            key={`${card.id}-${idx}`}
                            href={`/cards`}
                            className="relative group shrink-0 w-[200px] aspect-[3/4] rounded-2xl overflow-hidden border-2 border-white/10 hover:border-pink-500/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 shadow-xl"
                        >
                            <img
                                src={card.img}
                                alt="HODLday Card"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
                                <span className="font-bold text-white text-sm bg-pink-600 px-3 py-1 rounded-full">
                                    Mint Free
                                </span>
                            </div>
                        </Link>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
