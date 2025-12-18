"use client";

import React from "react";

import { useAccount, useDisconnect } from "wagmi";
import { useUserSession } from "@/components/providers/UserSessionProvider";
import { Copy, ExternalLink, LogOut, Wallet, User, Share2, Award, Check, Edit2, Save, X as XIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Avatar, Name } from "@coinbase/onchainkit/identity";
import Link from "next/link";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useState } from "react";
import SignInWithFarcaster from "@/components/auth/SignInWithFarcaster";

export function ProfileView() {
    const { address, isConnected } = useAccount();
    const { disconnect } = useDisconnect();
    const { userData, isLoading } = useUserSession();

    if (isLoading) {
        return <div className="p-8 text-center text-gray-400 animate-pulse">Loading profile...</div>;
    }

    if (!isConnected) {
        return (
            <div className="flex flex-col items-center justify-center p-8 space-y-4">
                <Wallet className="w-16 h-16 text-gray-600 pb-2" />
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
                    Connect to View Profile
                </h2>
                <div className="flex flex-col items-center gap-4">
                    <p className="text-gray-400 text-center max-w-sm">
                        Connect your wallet to see your MomCoin stats, NFTs, and social profile.
                    </p>
                    <SignInWithFarcaster />
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto space-y-6 p-4">
            {/* Header Card */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">

                {/* Avatar */}
                <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 p-[2px]">
                        <div className="w-full h-full rounded-full overflow-hidden bg-black flex items-center justify-center">
                            {userData?.farcasterPfp ? (
                                <Image
                                    src={userData.farcasterPfp}
                                    alt="Profile"
                                    width={96}
                                    height={96}
                                    className="object-cover"
                                />
                            ) : (
                                // Fallback to OnchainKit Avatar (Basename/ENS)
                                <div className="w-full h-full">
                                    <Avatar className="w-full h-full" address={address} />
                                </div>
                            )}
                        </div>
                    </div>
                    {userData?.farcasterId && (
                        <div className="absolute -bottom-2 -right-2 bg-[#855DCD] text-white text-xs px-2 py-1 rounded-full border border-black flex items-center gap-1">
                            <img src="/farcaster-logo.png" className="w-3 h-3 invert" alt="" onError={(e) => e.currentTarget.style.display = 'none'} /> WC
                        </div>
                    )}
                </div>

                {/* Details */}
                <div className="flex-1 text-center md:text-left space-y-2">
                    <h1 className="text-2xl font-bold text-white flex items-center justify-center md:justify-start gap-2">
                        {userData?.displayName ? userData.displayName : <Name address={address} className="text-white" />}
                    </h1>
                    <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-gray-400 bg-white/5 px-3 py-1 rounded-full w-fit mx-auto md:mx-0">
                        <Wallet className="w-3 h-3" />
                        <span className="font-mono">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
                        <button onClick={() => navigator.clipboard.writeText(address || "")} className="hover:text-white">
                            <Copy className="w-3 h-3" />
                        </button>
                        <a href={`https://basescan.org/address/${address}`} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                            <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>
                </div>

                <Button
                    variant="outline"
                    onClick={() => disconnect()}
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    Disconnect
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                    <div className="text-gray-400 text-sm mb-1 uppercase tracking-wider font-bold">Total Earned</div>
                    <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                        {userData?.momBalance?.toLocaleString() || 0}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">$MOMCOIN</div>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                    <div className="text-gray-400 text-sm mb-1 uppercase tracking-wider font-bold">Referrals</div>
                    <div className="text-3xl font-black text-white">
                        {userData?.referralCount || 0}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Moms Invited</div>
                </div>
            </div>

            {/* Social Connections */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Share2 className="w-5 h-5 text-pink-500" />
                        Social Connections
                    </h3>
                </div>

                <div className="space-y-3">
                    {/* Farcaster */}
                    <div className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#855DCD] rounded-full flex items-center justify-center text-white font-bold">F</div>
                            <div>
                                <div className="font-bold text-white">Farcaster</div>
                                <div className="text-xs text-gray-400">
                                    {userData?.farcasterUsername ? `@${userData.farcasterUsername}` : "Not connected"}
                                </div>
                            </div>
                        </div>
                        {userData?.farcasterId ? (
                            <div className="text-green-400 text-sm font-bold flex items-center gap-1">
                                Connected <Check className="w-3 h-3" />
                            </div>
                        ) : (
                            <Button size="sm" className="bg-[#855DCD] hover:bg-[#7a55be] text-white" onClick={() => window.open("https://warpcast.com/signup", "_blank")}>
                                Connect
                            </Button>
                        )}
                    </div>

                    {/* X (Twitter) */}
                    <SocialInput
                        label="X (Twitter)"
                        icon={<span className="font-bold text-lg">𝕏</span>}
                        initialValue={userData?.twitterHandle || ""}
                        field="twitterHandle"
                        dbId={address?.toLowerCase() || ""}
                        color="bg-black"
                    />

                    {/* Instagram */}
                    <SocialInput
                        label="Instagram"
                        icon={<span className="font-bold text-lg">📸</span>}
                        initialValue={userData?.instagramHandle || ""}
                        field="instagramHandle"
                        dbId={address?.toLowerCase() || ""}
                        color="bg-gradient-to-tr from-yellow-500 to-purple-500"
                    />
                </div>
            </div>

            {/* NFT Collection Link */}
            <Link href="/nfts" className="block p-1">
                <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-500/30 rounded-2xl p-6 flex items-center justify-between group hover:border-indigo-500/60 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-500/10 rounded-full text-indigo-400">
                            <Award className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">Your NFT Gallery</h3>
                            <p className="text-sm text-gray-400">View your Mom Cards & Cookie Jars</p>
                        </div>
                    </div>
                    <ExternalLink className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                </div>
            </Link>

        </div>
    );
}

function SocialInput({ label, icon, initialValue, field, dbId, color }: any) {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(initialValue);
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!dbId) return;
        setLoading(true);
        try {
            await updateDoc(doc(db, "users", dbId), {
                [field]: value
            });
            setIsEditing(false);
        } catch (e) {
            console.error("Error saving social:", e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5">
            <div className="flex items-center gap-3 w-full">
                <div className={`w-10 h-10 ${color} rounded-full flex items-center justify-center text-white font-bold shrink-0`}>
                    {icon}
                </div>
                <div className="flex-1">
                    <div className="font-bold text-white">{label}</div>
                    {isEditing ? (
                        <input
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder="@username"
                            className="w-full bg-white/10 text-white text-sm p-1 rounded mt-1 border border-white/20 focus:outline-none focus:border-pink-500"
                        />
                    ) : (
                        <div className="text-xs text-gray-400">
                            {initialValue ? `@${initialValue}` : "Not connected"}
                        </div>
                    )}
                </div>
            </div>
            <div className="ml-4">
                {isEditing ? (
                    <div className="flex gap-2">
                        <button onClick={() => setIsEditing(false)} className="p-2 text-gray-400 hover:text-white"><XIcon className="w-4 h-4" /></button>
                        <button onClick={handleSave} disabled={loading} className="p-2 text-green-400 hover:text-green-300">
                            {loading ? <span className="animate-spin">⌛</span> : <Save className="w-4 h-4" />}
                        </button>
                    </div>
                ) : (
                    <button onClick={() => setIsEditing(true)} className="p-2 text-gray-400 hover:text-white">
                        <Edit2 className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
}
