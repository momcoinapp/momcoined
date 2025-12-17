"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAccount, useWriteContract } from "wagmi";
import { Button } from "@/components/ui/Button";
import { ConnectWallet, Wallet } from "@coinbase/onchainkit/wallet";
import { Loader2, Gift, Check } from "lucide-react";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { Transaction, TransactionButton, TransactionStatus, TransactionStatusLabel, TransactionToast, TransactionToastIcon, TransactionToastLabel, TransactionToastAction } from '@coinbase/onchainkit/transaction';

const CARDS = [
    { id: 1, name: "Merry Cryptmas", img: "/cards/cryptmas-card.png", bg: "bg-black" },
    { id: 2, name: "Diamond Hands Mom", img: "/cards/Diamond_Hands_Mom_-_Crypto_meme_NFT.png", bg: "bg-blue-900" },
    { id: 3, name: "Bitcoin Mom", img: "/cards/Bitcoin_Mom_-_Crypto_maximalist_NFT.png", bg: "bg-yellow-900" },
    { id: 4, name: "Mom Hodls Dip", img: "/cards/Mom_Hodls_the_Dip_-_Trading_meme_NFT.png", bg: "bg-red-900" },
    { id: 5, name: "Wen Lambo", img: "/cards/Wen_Lambo_Mom_-_Crypto_humor_meme_NFT.png", bg: "bg-purple-900" },
    { id: 6, name: "Mom to the Moon", img: "/cards/Mom_to_the_Moon_-_Meme-inspired_crypto_NFT.png", bg: "bg-indigo-900" },
    { id: 7, name: "Supermom Energy", img: "/cards/Supermom_Energy_NFT_-_Updated_with_branding_and_crypto_elements.png", bg: "bg-pink-900" },
    { id: 8, name: "Greatest Gift", img: "/cards/The_Greatest_Gift_NFT_-_Updated_with_branding_and_crypto_elements.png", bg: "bg-green-900" },
    { id: 9, name: "World Shine", img: "/cards/You_Make_the_World_Shine_NFT_-_Updated_with_branding_and_blockchain_elements.png", bg: "bg-orange-900" },
    { id: 10, name: "Merry CryptMas Tree", img: "/cards/Merry_CryptMas_Tree_-_Holiday_crypto_pun_NFT.png", bg: "bg-teal-900" },
];

const CONTRACT_ADDRESS = "0xE2feD307E70E76F1B089EF34996c4b2187051AFE"; // Deployed MomChristmasCards
const ABI = [
    {
        "inputs": [{ "internalType": "uint256", "name": "id", "type": "uint256" }],
        "name": "mintCard",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "id", "type": "uint256" }],
        "name": "mintCustomCard",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    }
];

export function CardViewer({ id }: { id: string }) {
    const { address, isConnected } = useAccount();

    const [cardData, setCardData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isClaimed, setIsClaimed] = useState(false);

    useEffect(() => {
        async function fetchCard() {
            if (!id) return;
            try {
                const docRef = doc(db, "christmas_cards", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setCardData(docSnap.data());
                } else {
                    setError("Card not found. It might have expired or the link is wrong.");
                }
            } catch (err) {
                console.error("Error fetching card:", err);
                setError("Could not load the card. Please try again.");
            } finally {
                setLoading(false);
            }
        }
        fetchCard();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-6 text-center">
                <h1 className="text-3xl font-bold mb-4">😢 Oh no!</h1>
                <p className="text-gray-400">{error}</p>
                <Button onClick={() => window.location.href = '/'} className="mt-8">Go Home</Button>
            </div>
        );
    }

    const cardDesign = CARDS.find(c => c.id === cardData.cardId) || CARDS[0];
    const isCustom = cardData.cardId >= 1000;

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 py-20 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-pink-900/20 to-transparent pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg space-y-8 relative z-10"
            >
                {/* The Card */}
                <div className={`aspect-[3/4] rounded-3xl overflow-hidden relative shadow-2xl border-4 border-white/10 ${cardDesign.bg} flex flex-col items-center justify-center p-8 text-center`}>
                    <div className="absolute inset-0 z-0 opacity-50">
                        {cardData.imageUrl ? (
                            <img src={cardData.imageUrl} alt="Custom Card" className="w-full h-full object-cover" />
                        ) : (
                            <img src={cardDesign.img} alt="Card BG" className="w-full h-full object-cover opacity-50" />
                        )}
                    </div>

                    <div className="relative z-10">
                        <div className="text-6xl mb-6 drop-shadow-lg">🎄</div>
                        <div className="text-white font-serif italic text-xl md:text-2xl leading-relaxed drop-shadow-md">
                            "{cardData.message}"
                        </div>
                        <div className="mt-8 text-white font-bold drop-shadow-md">
                            With love,<br />
                            <span className="text-pink-300 text-lg">{cardData.senderName}</span>
                        </div>
                    </div>
                </div>

                {/* Claim Section */}
                <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 text-center space-y-4">
                    <h2 className="text-xl font-bold text-white">
                        {isClaimed ? "Gift Claimed!" : "This card is an NFT Gift for you!"}
                    </h2>

                    {!isConnected ? (
                        <div className="flex flex-col items-center gap-4">
                            <p className="text-gray-400 text-sm">
                                Connect or create a free wallet to claim this digital card forever.
                            </p>
                            <Wallet>
                                <ConnectWallet className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold px-6 py-3 rounded-full hover:scale-105" />
                            </Wallet>
                        </div>
                    ) : (
                        isClaimed ? (
                            <div className="text-green-400 flex items-center justify-center gap-2 font-bold p-4 bg-green-900/20 rounded-xl">
                                <Check className="w-5 h-5" />
                                Added to your collection!
                            </div>
                        ) : (
                            <Transaction
                                contracts={[{
                                    address: CONTRACT_ADDRESS as `0x${string}`,
                                    abi: ABI,
                                    functionName: isCustom ? 'mintCustomCard' : 'mintCard',
                                    args: [BigInt(cardData?.cardId || 1)],
                                    value: isCustom ? BigInt(300000000000000) : BigInt(0) // 0.0003 ETH
                                }]}
                                className="w-full"
                                onSuccess={() => {
                                    // 1. Visual & State
                                    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
                                    setIsClaimed(true);

                                    // 2. Claim Reward (100 MomCoin)
                                    fetch('/api/reward/claim-card', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                            userAddress: address,
                                            cardId: id
                                        })
                                    }).catch(e => console.error("Reward failed:", e));
                                }}
                            >
                                <TransactionButton className="w-full h-14 text-lg font-bold bg-gradient-to-r from-pink-500 to-purple-600 shadow-xl shadow-pink-500/20 border-none text-white rounded-xl" text="Claim My Gift 🎁" />
                                <TransactionStatus>
                                    <TransactionStatusLabel />
                                </TransactionStatus>
                                <TransactionToast>
                                    <TransactionToastIcon />
                                    <TransactionToastLabel />
                                    <TransactionToastAction />
                                </TransactionToast>
                            </Transaction>
                        )
                    )}
                </div>

                <div className="text-center">
                    <a href="/christmas" className="text-gray-500 hover:text-white text-sm underline">
                        Send your own card
                    </a>
                </div>
            </motion.div>
        </div>
    );
}
