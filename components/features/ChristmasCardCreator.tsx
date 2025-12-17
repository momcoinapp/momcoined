"use client";

// @ts-nocheck
import React, { useState, useRef, useEffect } from 'react';
import { useAccount } from "wagmi";
import { useUserSession } from "@/components/providers/UserSessionProvider";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { motion } from "framer-motion";
import { Loader2, Link, Copy, Check, Sparkles, Image as ImageIcon, Grid } from "lucide-react";
import { addDoc, collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

const CARDS = [
    { id: 1, name: "Merry Cryptmas 🎄", img: "/cards/Merry_CryptMas_-_Festive_crypto_Christmas_NFT.png", bg: "bg-black" },
    { id: 2, name: "Diamond Hands Mom 💎", img: "/cards/Diamond_Hands_Mom_-_Crypto_meme_NFT.png", bg: "bg-blue-900" },
    { id: 3, name: "Bitcoin Mom", img: "/cards/Bitcoin_Mom_-_Crypto_maximalist_NFT.png", bg: "bg-yellow-900" },
    { id: 4, name: "Mom Hodls The Dip", img: "/cards/Mom_Hodls_the_Dip_-_Trading_meme_NFT.png", bg: "bg-red-900" },
    { id: 5, name: "Wen Lambo Mom 🏎️", img: "/cards/Wen_Lambo_Mom_-_Crypto_humor_meme_NFT.png", bg: "bg-purple-900" },
    { id: 6, name: "Mom to the Moon 🚀", img: "/cards/Mom_to_the_Moon_-_Meme-inspired_crypto_NFT.png", bg: "bg-indigo-900" },
    { id: 7, name: "Supermom Energy ⚡", img: "/cards/Supermom_Energy_NFT_-_Updated_with_branding_and_crypto_elements.png", bg: "bg-pink-900" },
    { id: 8, name: "Greatest Gift 🎁", img: "/cards/The_Greatest_Gift_NFT_-_Updated_with_branding_and_crypto_elements.png", bg: "bg-green-900" },
    { id: 9, name: "World Shine 🌟", img: "/cards/You_Make_the_World_Shine_NFT_-_Updated_with_branding_and_blockchain_elements.png", bg: "bg-orange-900" },
    { id: 10, name: "Merry CryptMas Tree 🎄", img: "/cards/Merry_CryptMas_Tree_-_Holiday_crypto_pun_NFT.png", bg: "bg-teal-900" },
];

export function ChristmasCardCreator() {
    const { address, isConnected } = useAccount();
    const { userData } = useUserSession();

    const [mode, setMode] = useState<"standard" | "ai">("standard");
    const [selectedCard, setSelectedCard] = useState(CARDS[0]);
    const [message, setMessage] = useState("");
    const [name, setName] = useState(userData?.displayName || "");
    const [isGeneratingLink, setIsGeneratingLink] = useState(false);
    const [generatedLink, setGeneratedLink] = useState("");
    const [copied, setCopied] = useState(false);

    // AI States
    const [prompt, setPrompt] = useState("");
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    const [generatedImage, setGeneratedImage] = useState("");
    const [aiError, setAiError] = useState("");

    const generateAiImage = async () => {
        if (!prompt) return;
        setIsGeneratingImage(true);
        setAiError("");
        try {
            const res = await fetch("/api/generate-card", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt })
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setGeneratedImage(data.imageUrl);
        } catch (err: any) {
            console.error("AI Gen Error:", err);
            setAiError(err.message || "Failed to generate image.");
        } finally {
            setIsGeneratingImage(false);
        }
    };

    const handleCreateLink = async () => {
        if (!message || !name) return;
        if (mode === "ai" && !generatedImage) return;

        setIsGeneratingLink(true);

        try {
            // SPAM CHECK: Limit to 3 cards per day per wallet
            if (address) {
                const oneDayAgo = new Date();
                oneDayAgo.setHours(oneDayAgo.getHours() - 24);

                const q = query(
                    collection(db, "christmas_cards"),
                    where("senderAddress", "==", address),
                    where("createdAt", ">=", oneDayAgo)
                );

                const querySnapshot = await getDocs(q);
                if (querySnapshot.size >= 3) {
                    alert("You've created 3 cards today! Please come back tomorrow or try a custom AI card.");
                    setIsGeneratingLink(false);
                    return;
                }
            }

            const cardId = mode === "ai" ? 1000 + Math.floor(Math.random() * 9000) : selectedCard.id;

            // Save to Firebase
            const docRef = await addDoc(collection(db, "christmas_cards"), {
                cardId: cardId,
                imageUrl: mode === "ai" ? generatedImage : null,
                message,
                senderName: name,
                senderAddress: address || "0x00...00",
                createdAt: new Date(),
                claimed: false,
                isAiCustom: mode === "ai"
            });

            const refCode = userData?.referralCode || "MOM";
            const link = `${window.location.origin}/card/${docRef.id}?ref=${refCode}`;
            setGeneratedLink(link);
        } catch (error) {
            console.error("Error creating card:", error);
            alert("Failed to create card. Please try again.");
        } finally {
            setIsGeneratingLink(false);
        }
    };

    const copyLink = () => {
        navigator.clipboard.writeText(generatedLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (generatedLink) {
        return (
            <div className="max-w-md mx-auto p-6 bg-white/5 backdrop-blur border border-white/10 rounded-3xl text-center space-y-6">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-black" />
                </div>
                <h2 className="text-2xl font-bold text-white">Card Created!</h2>
                <p className="text-gray-300">Share this magic link with Mom (or anyone!). They don't need a wallet to view it.</p>

                <div className="p-4 bg-black/50 rounded-xl border border-white/10 flex items-center gap-2 overflow-hidden">
                    <span className="text-sm text-gray-400 truncate flex-1">{generatedLink}</span>
                    <button onClick={copyLink} className="p-2 hover:bg-white/10 rounded-lg text-white">
                        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                </div>

                <div className="flex flex-col gap-2">
                    <Button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent("I made you a MomCoin Christmas card! 🎄 Open it here: " + generatedLink)}`, '_blank')} className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white">
                        Share on WhatsApp
                    </Button>
                    <Button onClick={() => setGeneratedLink("")} variant="outline" className="w-full border-white/20 text-white">
                        Create Another
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Mode Switcher */}
            <div className="flex justify-center mb-8">
                <div className="bg-white/10 p-1 rounded-full flex gap-1">
                    <button
                        onClick={() => setMode("standard")}
                        className={`px-6 py-2 rounded-full font-bold transition-all ${mode === "standard" ? "bg-pink-500 text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
                    >
                        <Grid className="inline-block w-4 h-4 mr-2" />
                        Templates (Free)
                    </button>
                    <button
                        onClick={() => setMode("ai")}
                        className={`px-6 py-2 rounded-full font-bold transition-all ${mode === "ai" ? "bg-purple-600 text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
                    >
                        <Sparkles className="inline-block w-4 h-4 mr-2" />
                        AI Custom ($1)
                    </button>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-start">
                {/* Preview Section */}
                <div className="order-2 md:order-1 relative group">
                    <div className={`aspect-[3/4] rounded-3xl overflow-hidden relative shadow-2xl border-4 border-white/10 ${selectedCard.bg} transition-all duration-500 transform group-hover:scale-[1.02]`}>
                        {/* Image Layer */}
                        <div className="absolute inset-0 z-0">
                            {mode === "ai" && generatedImage ? (
                                <img src={generatedImage} alt="AI Generated" className="w-full h-full object-cover" />
                            ) : mode === "standard" ? (
                                <img src={selectedCard.img} alt="Card Theme" className="w-full h-full object-cover opacity-30" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center text-white/20">
                                    <Sparkles className="w-20 h-20" />
                                </div>
                            )}
                        </div>

                        {/* Text Layer */}
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-8 text-center bg-black/20 backdrop-blur-[2px]">
                            {mode === "standard" && <div className="text-6xl mb-4 animate-bounce">🎄</div>}
                            <h3 className="text-3xl font-black text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] mb-2">
                                {mode === "standard" ? selectedCard.name : "Custom AI Card"}
                            </h3>
                            <p className="text-white/90 font-medium italic text-xl drop-shadow-md">
                                "{message || 'Your message here...'}"
                            </p>
                            <div className="mt-8 text-sm text-white/80 font-bold bg-black/40 px-4 py-2 rounded-full backdrop-blur-md">
                                From: {name || "Your Name"}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Controls Section */}
                <div className="order-1 md:order-2 space-y-8">
                    <div>
                        <h2 className="text-4xl font-black text-white mb-2">
                            {mode === "standard" ? "Design Your Card" : "Generate with AI"}
                        </h2>
                        <p className="text-gray-400 text-lg">
                            {mode === "standard"
                                ? "Choose from our HodlDAY Collection."
                                : "Describe your dream card and let MomAI paint it."}
                        </p>
                    </div>

                    <div className="space-y-6">
                        {/* Custom Inputs based on Mode */}
                        {mode === "standard" ? (
                            <div>
                                <label className="text-sm font-bold text-gray-400 mb-3 block">1. Choose Template</label>
                                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                                    {CARDS.map(card => (
                                        <button
                                            key={card.id}
                                            onClick={() => setSelectedCard(card)}
                                            className={`aspect-square rounded-xl border-2 transition-all relative overflow-hidden group ${selectedCard.id === card.id ? 'border-pink-500 scale-105 ring-4 ring-pink-500/20' : 'border-white/10 hover:border-white/30'}`}
                                        >
                                            <img src={card.img} className="absolute inset-0 w-full h-full object-cover" />
                                            {selectedCard.id === card.id && (
                                                <div className="absolute inset-0 bg-pink-500/20 flex items-center justify-center">
                                                    <Check className="text-white w-6 h-6 drop-shadow-md" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-bold text-purple-400 mb-2 block">1. Describe Image</label>
                                    <textarea
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        placeholder="e.g., A futuristic Shiba Inu delivering presents on a rocket sled..."
                                        className="w-full h-24 bg-purple-900/20 border border-purple-500/30 rounded-xl p-4 text-white placeholder-purple-300/30 focus:outline-none focus:border-purple-500 transition-colors"
                                    />
                                </div>
                                <Button
                                    onClick={generateAiImage}
                                    disabled={!prompt || isGeneratingImage}
                                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:scale-[1.02] border border-white/10"
                                >
                                    {isGeneratingImage ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                                    Generate Art ($0 for preview)
                                </Button>
                                {aiError && <p className="text-red-400 text-sm">{aiError}</p>}
                            </div>
                        )}

                        <div className="space-y-4 pt-4 border-t border-white/10">
                            <div>
                                <label className="text-sm font-bold text-gray-400 mb-2 block">2. Personal Message</label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Merry Christmas! HODL tight..."
                                    className="w-full h-24 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors resize-none"
                                    maxLength={200}
                                />
                                <div className="text-right text-xs text-gray-500">{message.length}/200</div>
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-400 mb-2 block">3. Signed By</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your Name"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors"
                                />
                            </div>
                        </div>

                        {!isConnected ? (
                            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-200 text-sm text-center">
                                Connect wallet to finalize & share.
                            </div>
                        ) : (
                            <Button
                                onClick={handleCreateLink}
                                disabled={!message || !name || isGeneratingLink || (mode === "ai" && !generatedImage)}
                                className="w-full h-14 text-lg font-bold bg-gradient-to-r from-pink-500 to-purple-600 hover:scale-[1.02] transition-transform shadow-xl shadow-pink-500/20"
                            >
                                {isGeneratingLink ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                        Creating Magic Link...
                                    </>
                                ) : (
                                    "Create & Copy Link 🎁"
                                )}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
